import React, { Component } from 'react'
import './Card.css'

export default class Card extends Component {
  convertFoodString = foods => {
    let foodItems = ""

    for (let i = 0; i < foods.length - 1; ++i) {
      foodItems += foods[i].foodName + " (" +  foods[i].numGrams + "g), "
    }

    foodItems += foods[foods.length - 1].foodName + " (" + foods[foods.length - 1].numGrams + "g)"

    return foodItems
  }

  render () {
    return (
      <div className="card-container">
        <div class="container-fluid">
          <h1 className="restaurant-name">{ this.props.name }</h1>
          <div class="meal-container">
            <p className="meal-name">BREAKFAST</p>
            <div class="text-container">
              { this.props.breakfast && <p className="food-items">{ this.convertFoodString(this.props.breakfast) }</p> }
            </div>
          </div>
          <div class="meal-container">
            <p className="meal-name">LUNCH</p>
            <div class="text-container">
              { this.props.lunch && <p className="food-items">{ this.convertFoodString(this.props.lunch) }</p> }
            </div>
          </div>
          <div class="meal-container">
            <p className="meal-name">DINNER</p>
            <div class="text-container">
              { this.props.dinner && <p className="food-items">{ this.convertFoodString(this.props.dinner) }</p> }
            </div>
          </div>
        </div>
      </div>
    )
  }
}