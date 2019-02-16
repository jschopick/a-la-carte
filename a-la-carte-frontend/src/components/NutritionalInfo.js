import React, { Component } from 'react'
import Header from './Header'
import { connect } from 'react-redux'
import './NutritionalInfo.css'

// Dispatches
import { setAllergies } from '../actions/setAllergies'
import { setCalories } from '../actions/setCalories'
import { setMeals } from '../actions/setMeals'

class NutritionalInfo extends Component {
  handleSubmit = e => {
    e.preventDefault()
    
    let calories = e.target.totalCalories.value
    let meals = e.target.meals.value
    let allergies = e.target.allergies.value.split(", ") // ex. Nuts, peanuts, bananas
    
    for (let i = 0; i < allergies.length; ++i) {
      allergies[i] = allergies[i].toLowerCase()
    }

    this.props.setCalories(calories)
    this.props.setAllergies(allergies)
    this.props.setMeals(meals)

    console.log(this.props.content)
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

const mapStateToProps = state => {
  return {
    content: state,
    gender: state.gender,
    age: state.age,
    weight: state.weight,
    feet: state.feet,
    inches: state.inches,
    meals: state.meals,
    calories: state.calories,
    allergies: state.allergies
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAllergies: allergies => { dispatch(setAllergies(allergies)) },
    setCalories: calories => { dispatch(setCalories(calories)) },
    setMeals: meals => { dispatch(setMeals(meals)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NutritionalInfo)