import React from 'react';
import styled from 'styled-components'

export default class App extends React.Component{
  constructor(){
    super()
    this.state = {}
  }

  componentDidMount(){
   
  }

  render(){

      return (
        <AppDiv>
         Blank App
        </AppDiv>
    );
  }
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