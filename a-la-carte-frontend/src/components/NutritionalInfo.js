import React, { Component } from 'react'
import Header from './Header'
import { connect } from 'react-redux'
import './NutritionalInfo.css'

const nutritionOne = require('../assets/images/nutrition-1.jpg')

class NutritionalInfo extends Component {
  handleSubmit = e => {
    e.preventDefault()
    
    let calories = e.target.totalCalories.value
    let meals = e.target.meals.value
    let allergies = e.target.allergies.value
  }

  render() {
    return (
      <div className="nutritional-info-container">
        <div class="container-fluid">
        	<div class="row">
            <div class="col-md-8">
              <Header/>
              	<div class="row justify-content-center">
                  <div className="nutritional-info-title-container">
                  	  <h1 className="title">Nutritional Info</h1>
                  	</div>
                </div>
                <div class="nutritional-info-form-container">
                  <form className="nutritional-info-form" onSubmit={ this.handleSubmit }>
                    <div class="row">
                      <div className="col-md-12">
                        <p className="info-caption">Enter your preferred total calories for the day.</p>
                        <input className="form-control" id="total-calories" name="totalCalories" type="text" placeholder="Total calories..."/>
                      </div>
                    </div>
                    <div class="row">
                      <div className="col-md-12">
                        <p className="info-caption">Enter your preferred number of meals for the day.</p>
                        <input className="form-control" id="meals" name="meals" type="text" placeholder="Number of meals..."/>
                      </div>
                    </div>
                    <div class="row">
                      <div className="col-md-12">
                        <p className="info-caption">Any allergies? (Separate items by comma)</p>
                        <textarea class="form-control" placeholder="Enter your allergies here..." id="allergies" name="allergies" rows="3"></textarea>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <button id="submit-button" type="submit" className="btn btn-primary">Submit</button>
                    </div>
                  </form>
                </div>
            </div>
            <div className="col-md-4 image-filler"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null, null)(NutritionalInfo)
