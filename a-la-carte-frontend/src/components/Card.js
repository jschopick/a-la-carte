import React from 'react'
import './Card.css'

const Card = props => {
  return (
    <div className="card-container">
      <h1 className="restaurant-name">Restaurant</h1>
      <div className="breakfast-container">
        <div className="row justify-content-center">
          <div class="meal-container">
            <div class="meal-name">
              BREAKFAST
            </div>
          </div>
        </div>
      </div>
      <div className="lunch-container">
        <div className="row justify-content-center">
          <div class="meal-container">
            <div class="meal-name">
              LUNCH
            </div>
          </div>
        </div>
      </div>
      <div className="dinner-container">
        <div className="row justify-content-center">
          <div class="meal-container">
            <div class="meal-name">
              DINNER
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card