import React, { Component } from 'react'
import './Card.css'

export default class Card extends Component {
  convertFoodString = foods => {
    console.log(foods)

    let uniqueFoods = [foods[0]];
    for (let i = 1; i < foods.length; ++i) {
      let food = foods[i];
      let exists = false;

      for (let j = 0; j < uniqueFoods.length; ++j) {
        if (food.foodName == uniqueFoods[j].foodName) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        uniqueFoods.push(food)
      }
    }

    console.log(uniqueFoods)

    let foodItems = ""

    for (let i = 0; i < uniqueFoods.length - 1; ++i) {
      foodItems += foods[i].foodName + " (" +  foods[i].numGrams + "g), "
    }

    foodItems += uniqueFoods[uniqueFoods.length - 1].foodName + " (" + uniqueFoods[uniqueFoods.length - 1].numGrams + "g)"

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