const express = require('express');
const router = express.Router();
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const git = (command, canReject=false) => {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if(err && canReject){
                reject({err: true, msg: err})
            } else if( err){
                resolve({err: true, msg: err})
            } else {
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
        fs.appendFile(path, `change made at: ${content}\n`, (err) => {
            if(err){
                console.log('Failed to write file', err)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

router.get('/git/:numOfCommits', async (req, res, next) => {
    try {
        const stopIfFails = true
        const folderLocation = path.join(__dirname + '/randomCommits.txt')

        await git('git status', stopIfFails).catch(err => { throw 'failed to aquire status'})
        const fileExists = await doesPathExist(folderLocation)
        if(!fileExists){
            await createFile(folderLocation).catch(err => { throw 'failed to make folder'})
        }
        
        let n = req.params.numOfCommits

        while(n !== 0){
            await appendFile(`timestamps.txt`).catch(err => { throw ' failed to write file'})
            await git('git add .').catch(err => { throw ' failed to add files'})
            await git('git commit -m"hello, git."').catch(err => { throw ' failed to commit'})
            n--    
        }

        await git('git push origin HEAD')
        res.status(200).send(`commits made`)
    } catch (err) {
        console.log('endpoint catch', err)
        res.status(500).json(err)
    }
})

module.exports = router;
