import React, { Component } from 'react'
import './Card.css'

export default class Card extends Component {
  convertFoodString = foods => {
    let foodItems = ""

    for (let i = 0; i < foods.length; ++i) {
      foodItems += foods[i][0] + " "
    }
    return foodItems.split(" ").join(", ").substring(0, foodItems.length - 1)
  }

  render () {
    return (
      <div className="card-container">
        <div class="container-fluid">
          <h1 className="restaurant-name">{ this.props.name }</h1>
          <p className="meal-name">BREAKFAST</p>
          <div class="text-container">
            <p className="food-items">{ this.convertFoodString(this.props.breakfast) }</p>
          </div>
        </div>
      </div>
    )
  }
}