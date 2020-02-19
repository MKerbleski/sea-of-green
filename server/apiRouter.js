require('dotenv').config();
const express = require('express');
const router = express.Router();
const { exec } = require('child_process')
const fs = require('fs')
const { addUser, updateUser, getUsers, getUser } = require('../db/functions/users')

const git = (command, canReject=false) => {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if(err && canReject){
                console.log(err, stderr)
                reject({err: true, msg: err})
            } else if( err){
                console.log(err, stderr)
                resolve({err: true, msg: err})
            } else {
                // console.log('stdout', stdout)
                resolve({err: false, msg: stdout})
            }
        })
    })
}

const createFile = (path, content=null) => {
    if(!content){
        content = Date.now()
    }
    return new Promise((resolve, reject) => {
        fs.writeFile(path, `change made at: ${content}\n`, (err) => {
            if(err){
                console.log('Failed to write file', err)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

const appendFile = (path, content) => {
    if(!content){
        content = Date.now()
    }
    return new Promise((resolve, reject) => {
        fs.appendFile(path, content, (err) => {
            if(err){
                console.log('Failed to write file', err)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

const deleteContents = (path) => {
    return new Promise(async (resolve, reject) => {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file, index) => {
              const curPath = path + '/' + file ;
              if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteContents(curPath);
              } else { // delete file
                fs.unlinkSync(curPath);
              }
            });
            fs.rmdirSync(path);
          }
          resolve()
    })
}

const runEveryDay = async () => {

    var now = new Date();
    let beginAt = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        process.env.HOUR, 
        process.env.MINUTE, 
        );
        
    if(beginAt < Date.now()){ // if that time has already passed today (the day the processs starts)
        beginAt = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1, // sets the timer for tomorrow
            process.env.HOUR, 
            process.env.MINUTE, 
        );
        console.log('batch commits will happen tomorrow', beginAt)        
    } else {
        console.log('batch commits will happen today', beginAt)
    }

    var msTillStartTime = beginAt.getTime() - Date.now();
    
    const displayCountdown = () => {
        var timeRemaining = beginAt.getTime() - Date.now();
        if(timeRemaining < 0){
            return 
        } else {
            setTimeout(() => {
                displayCountdown()
                console.log('minutes till batch commiting begins', timeRemaining / 1000 / 60)
            }, process.env.COUNTDOWN_UPDATE)
        }
    }
    displayCountdown()

    const asyncForEach = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    const runBatchCommitsForAll = async () => {
        let totalCommits = 0
        const startTime = Date.now()

        const countAndMakeCommits = async (user) => {
            totalCommits += user.frequency
            await makeNumOfCommits(user, user.frequency + (Date.now() % 11))
        }

        const usersToCommit = await getUsers().catch(err => { 
            console.log('err', err)
        })

        await asyncForEach(usersToCommit, countAndMakeCommits)

        const endTime = Date.now()
        const totalTime = endTime - startTime
        
        console.log(`completed ${totalCommits} commits for ${usersToCommit.length} users in `, totalTime, 'ms' )
        runEveryDay(); // recursivly call this function once process is complete
    }

    return setTimeout(runBatchCommitsForAll, msTillStartTime);
}

runEveryDay()

const makeNumOfCommits = (user, num=null) => {
    return new Promise(async (resolve, reject) => {
        try {
            let n = user.frequency
            if(num){
                n = num
            }
            if(user.frequency==0){
                n=1
            }
            console.log(`begin making ${n} commit(s) on behalf of ${user.first} ${user.last}`)
        
            const stopIfFails = true

            await deleteContents('./tempRepo')
            
            //uses my credentials to authrize a push to the repo
            console.log('git clone')
            await git(`git clone https://${process.env.GITHUB_NAME}:${process.env.GITHUB_TOKEN}@github.com/MKerbleski/green-squares.git tempRepo`, stopIfFails).catch(err => { 
                console.log(err)
                throw 'failed to aquire status'})

            //sets author to the user being called
            console.log(`git config --global user.email "${user.email}"`)
            await git(`git config --global user.email "${user.email}"`).catch(err => { 
                console.log(err)
                throw ' failed to add files'})

            console.log(`git config --global user.name "${user.first} ${user.last}"`)
            await git(`git config --global user.name "${user.first} ${user.last}"`).catch(err => { 
                console.log(err)
                throw ' failed to add files'})

            while(n > 0){
                console.log('modify file')
                await appendFile(`tempRepo/square.txt`, "M").catch(err => { 
                    console.log(err)
                    throw 'failed to write file'})
                console.log('git add')
                await git('cd ./tempRepo && git add .').catch(err => { 
                    console.log(err)
                    throw 'failed to add files'})
                console.log(`git commit`)
                await git(`cd ./tempRepo && git commit -m"hello, git." --author="${user.first} ${user.last} <${user.email}>"`).catch(err => { 
                    console.log(err)
                    throw 'failed to commit'})
                n--    
            }

            console.log('git push')
            await git('cd ./tempRepo && git push origin HEAD')

            await deleteContents('./tempRepo')
           
            resolve('good')
        } catch (err) {
            reject(err)
        }
    })
}

router.get('/git/:numOfCommits/:email', async (req, res, next) => {
    try {
        const user = await getUser(req.params.email).catch(err => {
            console.log('err', err)
            throw err
        })

        console.log(`make ${req.params.numOfCommits} for `, user[0].first, user[0].last)
        await makeNumOfCommits(user[0], req.params.numOfCommits).catch(err => {
            console.log('err', err)
            throw err
        })

        res.status(200).send(`commits made`)
    } catch (err) {
        console.log('endpoint catch', err)
        res.status(500).json(err)
    }
})

router.post('/user', async (req, res, next) => {
    console.log('saving new user:', req.body)
    try {
        addUser(req.body).then(user => {
            res.status(201).json(user)
        }).catch(err => {
            throw err
        })
    } catch (err) {
        console.log('endpoint catch', err)
        res.status(500).json(err)
    }
})

router.put('/user', async (req, res, next) => {
    console.log('updating user: ', req.body)
    try {
        const updatedUser = await updateUser(req.body).catch(err => {
            console.log('err', err)
            throw err
        })
        console.log('updated user', updatedUser)
        res.status(200).send(`user updated`)
    } catch (err) {
        console.log('endpoint catch', err)
        res.status(500).json(err)
    }
})

router.get('/:email', async (req, res, next) => {
    try {
        const user = await getUser(req.params.email)
        console.log('get user', user)
        if(user[0]){
            res.send(user) 
        } else {
            res.status(204).json(null)
        }
    } catch (err) {
        console.log('endpoint catch', err)
        res.status(500).json(err)
    }
})

module.exports = router;
