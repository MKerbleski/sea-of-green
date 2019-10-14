import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import axios from 'axios'

export default function App (){
	const [ update, setUpdate ] = useState(false)
	const [state, setState] = useState({ 
		email: '', 
		frequency: '', 
		first: '', 
		last: '' 
	})

	const handleChange = e =>
		setState({
		...state,
		[e.target.name]: e.target.value
		})
	
	const { email, frequency, first, last } = state
	
	useEffect(() => {
		let user = localStorage.getItem('user')
		if(user){
			// setEmail(user.email)
			// setFrequency(user.frequency)
			// setFirst(user.first)
			// setLast(user.last)
			// setUpdate(true)
		}
	})

	const handleSubmit = (user) => {
		console.log(email, this, user)
		if(false){
			axios.put('/api/user', {email, frequency, first, last}).then(res => {
				console.log('res', res)
				localStorage.setItem('user', res.data)
			}).catch(err => {
				console.log('err', err)
			})
		} else {
			const { email, frequency, first, last } = state
			const postObj = {email, frequency, first, last}
			console.log('post', postObj)
			axios.post('/api/user', postObj).then(res => {
				console.log('res', res)
				localStorage.setItem('user', {email, frequency, first, last})
			}).catch(err => {
				console.log('err', err)
			})
		}
	}

	const commitNow = () => {
		axios.get('/api/git/1/19').then(res => {
			console.log('res', res)
			alert('done')
			localStorage.setItem('user', res.data)
		}).catch(err => {
			console.log('err', err)
		})  //s
	}

	console.log(email, frequency, first, last)
	
	return (	
		<AppDiv>
			This application will make as many commits as you want
			<label>Github First Name</label>
			<input type="text" name="first" onChange={(e) => handleChange(e)} value={first}></input>
			<label>Github Last Name</label>
			<input type="text" name="last" onChange={(e) => handleChange(e)} value={last}></input>
			<label>Github Email Address</label>
			<input type="email" name="email" onChange={(e) => handleChange(e)} value={email}></input>
			<label>Make this many Commits</label>
			<input type="number" name="frequency" onChange={(e) => handleChange(e)} value={frequency}></input>
			<label>every day</label>
			<button onClick={() => handleSubmit(first, last, email, frequency)}>Schedule</button>
			<button onClick={commitNow}>Do One Now</button>
			<iframe src="https://ghbtns.com/github-btn.html?user=mkerbleski&repo=sea-of-green&type=star&count=true&size=large" frameborder="0" scrolling="0" width="320px" height="60px"></iframe>
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