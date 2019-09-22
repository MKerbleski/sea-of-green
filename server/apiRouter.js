const express = require('express');
const router = express.Router();
const { exec } = require('child_process')

const cb = (err, stdout, stderr) => {
    if(err){
        console.log('err', err)
        console.log('stderr', stderr)
    } else {
        console.log('success')
        console.log('\n------\nstdout', stdout)
    }
}

const git = (command) => {
    console.log('running ->', command)
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if(err){
                console.log('err', err)
                console.log('stderr', stderr)
                reject()
            } else {
                console.log('\n------stdout', stdout)
                resolve()
            }
        })
    })
}

router.get('/git', async (req, res, next) => {
    console.log('git')
    await git('git status')
    console.log('===========next===========')
    await git('git add .')
    console.log('===========next===========')
    await git('git add .')
    // await git('git reset HEAD')
})

module.exports = router;
