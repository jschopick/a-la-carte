import React, { Component } from 'react'
import Header from './Header'
import './NutritionalInfo.css'

export default class NutritionalInfo extends Component {
  render() {
    return (
      <div className="nutritional-info-container">
        <Header/>
        <div className="nutritional-info-title-container">
          <h1 className="title">Nutritional Info</h1>
        </div>
      </div>
    )
  }
}
