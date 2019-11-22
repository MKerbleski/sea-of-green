import React, {useState} from 'react';
import styled from 'styled-components'
import axios from 'axios'
import './App.css'

// -
// -
// -
// -
// -
// -
// -
// -
// -
// -  THIS USER INTERFACE IS UNDER DEVELOPMENT. I AM COLLABORATING 
// -
// -
// -
// -
// -
// -
// -
// -
// -

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
		if(e.target.name === 'bomb' && e.target.value > 100){
			alert('FYI the higher the commits you do in a day the lighter the rest of your squares will become.')
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
			// localStorage.setItem('user', res.data)
		}).catch(err => {
			console.log('err', err)
		})

	}

	const handleNewUser = (user) => {
		const { email, frequency, first, last } = state
		const postObj = {email, frequency, first, last}
		axios.post('/api/user', postObj).then(res => {
			console.log('res', res)
			alert('Scheduled!')
			setReturningUser(true)
			localStorage.setItem('user', {email, frequency, first, last})
		}).catch(err => {
			console.log('err', err)
		})
	}

	const commitNow = () => {
		axios.get(`/api/git/${bomb}/${email}`).then(res => {
			alert('done')
			localStorage.setItem('user', res.data)
		}).catch(err => {
			console.log('err', err)
		})
	}

	const sendEmail = () => {
		axios.get(`/api/${state.email}`).then(res => {
			if(res.data.length){
				setReturningUser(true)
				const { first, last, frequency, email } = res.data[0]
				setState({
					...state,
					first, last, frequency, email
				})
			} else {
				setReturningUser(false)
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
		setLoggedin(false)
	}


	return (	
		<AppDiv>
			<h1>SEA of Green</h1>
			This application allows you to make as many commits as you want every day. Or at one time. 
			<br></br>
			<br></br>
			<label>Enter your email address that you use to login to github.</label>
			<br></br>
			<form onSubmit={(e) => {
				e.preventDefault()
				sendEmail()
				}}>
				<label>Github Email Address</label>
				<input type="email" name="email" onChange={(e) => handleChange(e)} value={email}></input>
				<button type="submit">Submit</button>
			</form>
			{loggedin ? <button onClick={(e) => {logout()}}>Clear</button> : null}
			{loggedin ? <div className="lower">
				{returningUser ? <div className="update two">
					Welcome back! Modify your schedule
					<form className="two" onSubmit={(e) => {
						e.preventDefault()
						handleUpdate(first, last, email, frequency)
						}}>
						<label>Github First Name</label>
						<input type="text" name="first" onChange={(e) => handleChange(e)} value={first}></input>
						<label>Github Last Name</label>
						<input type="text" name="last" onChange={(e) => handleChange(e)} value={last}></input>
						<label>Make this many Commits</label>
						<input type="number" name="frequency" onChange={(e) => handleChange(e)} value={frequency}></input>
						<label>every day</label>
						<button type="submit">UPDATE</button>
					</form>
					<br></br>
					<br></br>
				 	OR just make a few extra right now to a text file called <b>green squares</b>
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
					<form className="two" onSubmit={(e) => {
						e.preventDefault()
						handleNewUser(first, last, email, frequency)
						}}>
						<label>Github First Name</label>
						<input type="text" name="first" onChange={(e) => handleChange(e)} value={first}></input>
						<label>Github Last Name</label>
						<input type="text" name="last" onChange={(e) => handleChange(e)} value={last}></input>
						<label>Make this many Commits</label>
						<input type="number" name="frequency" onChange={(e) => handleChange(e)} value={frequency}></input>
						<label>every day</label>
						<button type="ubmit">Schedule</button>
					</form>
					<br></br>
					<label>Step 2: Star this Repository</label>
					<iframe src="https://ghbtns.com/github-btn.html?user=mkerbleski&repo=green-squares&type=star&count=true&size=large" frameborder="0" title="star" scrolling="0" width="320px" height="60px"></iframe>
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
