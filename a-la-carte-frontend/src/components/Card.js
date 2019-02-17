import React, { Component } from 'react'
import './Card.css'

export default class Card extends Component {
  convertFoodString = foods => {
    let foodItems = ""

    for (let i = 0; i < foods.length - 1; ++i) {
      foodItems += foods[i][0] + "(" +  foods[i][1] + "g) "
    }
    // return foodItems.split(" ").join(", ").substring(0, foodItems.length - 1)
    return foodItems.split(" ").join(", ") + foods[foods.length - 1][0] + "(" +  foods[foods.length - 1][1] + ") "
  }

  render () {
    return (
      <div className="card-container">
        <div class="container-fluid">
          <h1 className="restaurant-name">{ this.props.name }</h1>
          <div class="meal-container">
            <p className="meal-name">BREAKFAST</p>
            <div class="text-container">
              <p className="food-items">{ this.convertFoodString(this.props.breakfast) }</p>
            </div>
          </div>
          <div class="meal-container">
            <p className="meal-name">LUNCH</p>
            <div class="text-container">
              <p className="food-items">{ this.convertFoodString(this.props.breakfast) }</p>
            </div>
          </div>
          <div class="meal-container">
            <p className="meal-name">DINNER</p>
            <div class="text-container">
              <p className="food-items">{ this.convertFoodString(this.props.breakfast) }</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}