import React, { Component } from 'react'
import Header from './Header'
import { connect } from 'react-redux'
import MultiSlider from "multi-slider";
import './NutritionalInfo.css'

// Dispatches
import { setAllergies } from '../actions/setAllergies'
import { setCalories } from '../actions/setCalories'
import { setMeals } from '../actions/setMeals'

const colors = ["#FCBD7E", "#EB9F71", "#E6817C"]

class NutritionalInfo extends Component {
  state = {
    values: [33, 33, 34],
    fats: 33,
    proteins: 33,
    carbohydrates: 34
  }

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
  }

  //fat, protein, carbs (macro distribution)
  onChange = values => {
    let fats = values[0]
    let proteins = values[1]
    let carbohydrates = values[2]

    this.setState({ values, fats, proteins, carbohydrates })
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
                  <div className="row">
                    <div className="col-md-12">
                      <p className="info-caption" id="macro-distribution">Macro Distribution</p>
                      <MultiSlider
                        colors={ colors }
                        values={ this.state.values }
                        onChange={ this.onChange }
                      />
                    </div>
                  </div>
                  <div class="percentage-container">
                    <div className="row">
                      <div className="col-md-4 percentage">Fats: { this.state.fats }%</div>
                      <div className="col-md-4 percentage">Proteins: { this.state.proteins }%</div>
                      <div className="col-md-4 percentage">Carbohydrates: { this.state.carbohydrates }%</div>
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
