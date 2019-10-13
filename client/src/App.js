import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import axios from 'axios'

export default function App (){
	const [ email, setEmail ] = useState('')
	const [ frequency, setFrequency ] = useState('')
	const [ first, setFirst ] = useState('')
	const [ last, setLast ] = useState('')
	const [ update, setUpdate ] = useState(false)
	
	useEffect(() => {
		let user = localStorage.getItem('user')
		if(user){
			setEmail(user.email)
			setFrequency(user.frequency)
			setFirst(user.first)
			setLast(user.last)
			setUpdate(true)
		}
	})

	const handleSubmit = () => {
		if(update){
			axios.put('/api/user', {email, frequency, first, last}).then(res => {
				console.log('res', res)
				localStorage.setItem('user', res.data)
			}).catch(err => {
				console.log('err', err)
			})
		} else {
			axios.post('/api/user', {email, frequency, first, last}).then(res => {
				console.log('res', res)
				localStorage.setItem('user', res.data)
			}).catch(err => {
				console.log('err', err)
			})
		}
	}

	const commitNow = () => {
		axios.get('/api/git/1', {email, frequency, first, last}).then(res => {
			console.log('res', res)
			alert('done')
			localStorage.setItem('user', res.data)
		}).catch(err => {
			console.log('err', err)
		})
	}

	return (
		<AppDiv>
			This application will make as many commits as you want
			<label>Github First Name</label>
			<input type="text" onChange={(e) => setFirst(e.target.value)} value={first}></input>
			<label>Github Last Name</label>
			<input type="text" onChange={(e) => setLast(e.target.value)} value={last}></input>
			<label>Github Email Address</label>
			<input type="email" onChange={(e) => setEmail(e.target.value)} value={email}></input>
			<label>Make this many Commits</label>
			<input type="number" onChange={(e) => setFrequency(e.target.value)} value={frequency}></input>
			<label>every day</label>
			<button onClick={handleSubmit}>Schedule</button>
			<button onClick={commitNow}>Do One Now</button>
		</AppDiv>
	);
}

const AppDiv = styled.div`
    /* border: 1px solid red; */
    box-sizing: border-box;
    max-width: 100vw;
    color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    .data{
      /* border: 1px solid blue; */
      display: flex;
      width: 95%;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      .top{
        /* border: 1px solid green; */
        /* max-width: 100%; */
        box-sizing: border-box;
        width: 100%;
        display: flex;
        flex-direction: row;
      }
    }
`