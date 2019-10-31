require('dotenv').config();
const express = require('express');
const router = express.Router();
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const { addUser, updateUser, getUsers, getUser } = require('../db/functions/users')

const git = (command, canReject=false) => {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            console.log(err, stderr)
            if(err && canReject){
                reject({err: true, msg: err})
            } else if( err){
                resolve({err: true, msg: err})
            } else {
                console.log('stdout', stdout)
                resolve({err: false, msg: stdout})
            }
        })
    })
}

const doesPathExist = (path) => {
    return new Promise((resolve, reject) => {
        resolve(fs.existsSync(path))
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

const appendFile = (path, content=null) => {
    if(!content){
        content = Date.now()
    }
    return new Promise((resolve, reject) => {
        fs.appendFile(path, `M`, (err) => {
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

const runEveryDay = async (t) => {

    console.log('Begin Batch Commits')
    var now = new Date();
    var noon = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + t, // the next day, ...
        3, 41, 0 // ...at 03:41:00 hours
    );

    var msToNoon = noon.getTime() - now.getTime();
console.log('minutes till it starts', msToNoon / 1000 / 60)

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    await new Promise((res,rej) => {
        const startTime = Date.now()
        setTimeout(async function() {
            let totalCommits = 0
            const usersToCommit = await getUsers().catch(err => { 
                console.log('err', err)
            })
            await asyncForEach(usersToCommit, async (user) => {
                totalCommits += user.frequency
                await makeNumOfCommits(user, user.frequency)
            })              //      <-- This is the function being called at midnight.
            const endTime = Date.now()
            const totalTime = endTime - startTime
            console.log(`completed ${totalCommits} commits for ${usersToCommit.length} users in `, totalTime, 'ms' )
            runEveryDay(1);    //      Then, reset again next midnight.
        }, msToNoon);
    })
}

runEveryDay(0)

const makeNumOfCommits = (user, num=null) => {
    return new Promise(async (resolve, reject) => {
        console.log('start Git Process', user)
        try {
            const stopIfFails = true
            // const folderLocation = path.join(__dirname + '/tempRepo')
            // const fileExists = await doesPathExist(folderLocation)
            
            // if(!fileExists){
            //     fs.mkdirSync(folderLocation)
            //     // git clone 
            // } else {
            //     // git pull 
            // }
            await deleteContents('./tempRepo')


            // const start = await git('ls', stopIfFails).catch(err => { 
            const start = await git(`git clone https://${process.env.GITHUB_NAME}:${process.env.GITHUB_TOKEN}@github.com/MKerbleski/green-squares.git tempRepo`, stopIfFails).catch(err => { 
                console.log(err)
                throw 'failed to aquire status'})
console.log('start', start)

            const status = await git('cd tempRepo  && git status', stopIfFails).catch(err => { 
                console.log(err)
                throw 'failed to aquire status'})
                console.log('status', status)

                
                
                // const ls = await git('cd ./tempRepo && ls')
                // console.log('ls', ls)

console.log(`git config --global user.email "${user.email}"`)
            await git(`git config --global user.email "${user.email}"`).catch(err => { 
                console.log(err)
                throw ' failed to add files'})
console.log(`git config --global user.name "${user.first} ${user.last}"`)
            await git(`git config --global user.name "${user.first} ${user.last}"`).catch(err => { 
                console.log(err)
                throw ' failed to add files'})

            let n = user.frequency
            if(num){
                n = num
            }
            if(user.frequency==0){
                n=1
            }
            console.log('n', n)
            while(n > 0){
                await appendFile(`tempRepo/square.txt`).catch(err => { 
                    console.log(err)
                    throw ' failed to write file'})
                await git('cd ./tempRepo && git add .').catch(err => { 
                    console.log(err)
                    throw ' failed to add files'})
                console.log(`cd ./tempRepo && git commit -m"hello, git." --author="${user.first} ${user.last} <${user.email}>"`)
                await git(`cd ./tempRepo && git commit -m"hello, git." --author="${user.first} ${user.last} <${user.email}>"`).catch(err => { 
                    console.log(err)
                    throw ' failed to commit'})
                n--    
            }

           const pushed =  await git('cd ./tempRepo && git push origin HEAD')
            console.log('pushed', pushed)

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
        console.log('get numOfCommits', user[0])
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
    console.log('post user', req.body)
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
    console.log('put user WIP')
    try {
        const updatedUser = await updateUser(req.body).catch(err => {
            console.log('err', err)
            throw err
        })
        console.log(updatedUser)
        res.status(200).send(`user updated`)
    } catch (err) {
        console.log('endpoint catch', err)
        res.status(500).json(err)
    }
})

router.get('/:email', async (req, res, next) => {
    try {
        const user = await getUser(req.params.email)
        console.log('user', user)
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
