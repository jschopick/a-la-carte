import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './Home.css'

const logo = require('../assets/images/alc-logo.png')

export default class Home extends Component {
  render() {
    return (
      <div className="home-container">
        <div class="container-fluid">
          <div class="logo-container">
            <img id="logo" src={ logo } alt="a-la-carte logo"/>
          </div>
          <div className="begin-container">
            <NavLink to="/personal-info"><button id="begin-button" type="button" className="btn btn-primary">Get Started</button></NavLink>
          </div>
        </div>
      </div>
    )
  }
}
