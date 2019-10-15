import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import axios from 'axios'
import './App.css'

export default function App (){
	// const [ update, setUpdate ] = useState(false)
	const [ loggedin, setLoggedin ] = useState(false)
	const [ returningUser, setReturningUser ] = useState(false)
	const [state, setState] = useState({ 
		email: '', 
		frequency: '', 
		first: '', 
		last: '',
		bomb: 1
	})
	const { email, frequency, first, last, bomb } = state

	const handleChange = e => {
		if(e.target.name == 'bomb' && e.target.value > 100){
			alert('dude... chill. Maybe try something reasonable, like 42.')
			setState({
			...state,
			[e.target.name]: 42
			})
		} else {
			setState({
			...state,
			[e.target.name]: e.target.value
			})
		}
	}

	const handleUpdate = (user) => {
		axios.put('/api/user', {email, frequency, first, last}).then(res => {
			console.log('res', res)
			localStorage.setItem('user', res.data)
		}).catch(err => {
			console.log('err', err)
		})

	}

	const handleNewUser = (user) => {
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

	const commitNow = () => {
		axios.get(`/api/git/${bomb}/${email}`).then(res => {
			console.log('res', res)
			alert('done')
			localStorage.setItem('user', res.data)
		}).catch(err => {
			console.log('err', err)
		})
	}

	const loadUser = () => {

		axios.get('/api/git/1/19').then(res => {
			console.log('res', res)
			alert('done')
			localStorage.setItem('user', res.data)
		}).catch(err => {
			console.log('err', err)
		})  //s
	}

	const sendEmail = () => {
		axios.get(`/api/${state.email}`).then(res => {
			console.log('res', res)
			if(res.status === 200){
				setReturningUser(true)
				const { first, last, frequency, email } = res.data[0]
				setState({
					...state,
					first, last, frequency, email
				})
			}
			setLoggedin(true)
		}).catch(err => {
			console.log('err', err)
		})
	}

	const logout = () => {
		setState({
			email: '', 
			frequency: '', 
			first: '', 
			last: '',
			bomb: 1
		})
	}

	console.log(email, frequency, first, last)
	
	return (	
		<AppDiv>
			This application will make as many commits as you want
			<br></br>
			<label>Enter your email address that you use to login to github.</label>
			<label>Github Email Address</label>
			<input type="email" name="email" onChange={(e) => handleChange(e)} value={email}></input>
			<button onClick={sendEmail}>Submit</button>
			{loggedin ? <button onClick={(e) => {logout()}}>Clear</button> : null}
			{loggedin ? <div className="lower">
				{returningUser ? <div className="update two">
				UPDATE
					Welcome back! Modify your schedule
					<label>Github First Name</label>
					<input type="text" name="first" onChange={(e) => handleChange(e)} value={first}></input>
					<label>Github Last Name</label>
					<input type="text" name="last" onChange={(e) => handleChange(e)} value={last}></input>
					<label>Make this many Commits</label>
					<input type="number" name="frequency" onChange={(e) => handleChange(e)} value={frequency}></input>
					<label>every day</label>
					<button onClick={() => handleUpdate(first, last, email, frequency)}>UPDATE</button>
					<br></br>
					<br></br>
				 	OR
					<br></br>
					<input type="number" name="bomb" onChange={(e) => handleChange(e)} value={bomb}></input>
					<button onClick={commitNow}>{`Make ${bomb} commits now`}</button>
				</div>
				: 
				<div className="new two">
					NEW 
					Welcome! Create your schedule
					<label>Step 1: Enter your name, email, and how many commits to make per day.</label>
					<br></br>
					<label>Github First Name</label>
					<input type="text" name="first" onChange={(e) => handleChange(e)} value={first}></input>
					<label>Github Last Name</label>
					<input type="text" name="last" onChange={(e) => handleChange(e)} value={last}></input>
					<label>Make this many Commits</label>
					<input type="number" name="frequency" onChange={(e) => handleChange(e)} value={frequency}></input>
					<label>every day</label>
					<button onClick={() => handleNewUser(first, last, email, frequency)}>Schedule</button>
					<br></br>
					<label>Step 2: Star this Repository</label>
					<iframe src="https://ghbtns.com/github-btn.html?user=mkerbleski&repo=sea-of-green&type=star&count=true&size=large" frameborder="0" scrolling="0" width="320px" height="60px"></iframe>
				</div>}
			</div> : null }
			
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