import React from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

const pizza = require('../assets/images/pizza.png')

const Header = () => {
  return (
    <div className="header-container">
      <div className="pizza-container">
        <NavLink to="/"><img id="pizza" src={ pizza } alt="Pizza"/></NavLink>
      </div>
    </div>
  )
}

export default Header