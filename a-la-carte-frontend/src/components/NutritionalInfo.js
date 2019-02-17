import React, { Component } from 'react'
import Header from './Header'
import { connect } from 'react-redux'
import MultiSlider from "multi-slider";
import axios from 'axios'
import './NutritionalInfo.css'

// Dispatches
import { setAllergies } from '../actions/setAllergies'
import { setCalories } from '../actions/setCalories'
import { setMeals } from '../actions/setMeals'
import { setGoalWeight } from '../actions/setGoalWeight'
import { setFats } from '../actions/setFats'
import { setProteins } from '../actions/setProteins'
import { setCarbohydrates } from '../actions/setCarbohydrates'

const colors = ["#FCBD7E", "#EB9F71", "#E6817C"]

class NutritionalInfo extends Component {
  state = {
    values: [33, 33, 34],
    fats: 33,
    proteins: 33,
    carbohydrates: 34
  }

  submitFix = e => {
    this.handleSubmit(e)
    setTimeout(this.handleSubmit(e), 3000)
  }

  handleSubmit = e => {
    e.preventDefault()

    let goalWeight;
    let calories;
    let fats;
    let proteins;
    let carbohydrates;

    if (this.props.experience == "beginner") {
      goalWeight = e.target.goalWeight.value
    }
    else if (this.props.experience == "expert") {
      calories = e.target.totalCalories.value
      fats = this.state.fats
      proteins = this.state.proteins
      carbohydrates = this.state.carbohydrates
    }

    let meals = e.target.meals.value
    let allergies = e.target.allergies.value.split(", ") // ex. Nuts, peanuts, bananas
    
    for (let i = 0; i < allergies.length; ++i) {
      allergies[i] = allergies[i].toLowerCase()
    }

    this.props.setCalories(calories)
    this.props.setAllergies(allergies)
    this.props.setMeals(meals)
    this.props.setGoalWeight(goalWeight)
    this.props.setFats(fats)
    this.props.setProteins(proteins)
    this.props.setCarbohydrates(carbohydrates)

    if (this.props.experience == "beginner") {
      // Send a post request with:
      //    gender, weight, feet, inches, age, activity level, goal weight, meals, allergies
    }
    else {
      // Send a post request with:
      //    gender, weight, feet, inches, age, activity level, calories, fats, proteins, carbohydrates, allergies
    }

    axios.post("http://localhost:8000/api/userinfo", {
      weight: this.props.weight,
      gender: this.props.gender,
      age: this.props.age,
      feet: this.props.feet,
      inches: this.props.inches,
      calories: this.props.calories,
      meals: this.props.meals,
      allergies: this.props.allergies,
      experience: this.props.experience,
      goalWeight: this.props.goalWeight,
      fats: this.props.fats,
      proteins: this.props.proteins,
      carbohydrates: this.props.carbohydrates,
      activity: this.props.activity
    }).then(res => console.log(res))
    .catch(err => console.log(err))

    console.log(this.props.content)
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
                <form className="nutritional-info-form" onSubmit={ this.submitFix }>
                  <div class="row">
                    { this.props.experience == "expert" && <div className="col-md-12">
                      <p className="info-caption">Enter your preferred total calories for the day.</p>
                      <input className="form-control" id="total-calories" name="totalCalories" type="text" placeholder="Total calories..."/>
                    </div> }
                  </div>
                  <div class="row">
                    <div className="col-md-12">
                      <p className="info-caption">Enter your preferred number of meals for the day.</p>
                      <input className="form-control" id="meals" name="meals" type="text" placeholder="Number of meals..."/>
                    </div>
                  </div>
                  { this.props.experience == "beginner" && <div class="row">
                    <div className="col-md-12">
                      <p className="info-caption">Set your target weight (lbs).</p>
                      <input className="form-control" id="goal-weight" name="goalWeight" type="text" placeholder="Target weight..."/>
                    </div>
                  </div> }
                  { this.props.experience == "expert" && <div class="macro-container">
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
                  </div> }
                  <div class="row">
                    <div className="col-md-12">
                      <div class="allergies-container">
                        <p className="info-caption">Any allergies? (Separate items by comma)</p>
                        <textarea class="form-control" placeholder="Enter your allergies here..." id="allergies" name="allergies" rows="3"></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-center">
                    <button id="submit-button" type="submit" className="btn btn-danger">Submit</button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-4 image-filler-nutritional"></div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    content: state,
    weight: state.weight,
    gender: state.gender,
    age: state.age,
    feet: state.feet,
    inches: state.inches,
    calories: state.calories,
    meals: state.meals,
    allergies: state.allergies,
    experience: state.experience,
    goalWeight: state.goalWeight,
    fats: state.fats,
    proteins: state.proteins,
    carbohydrates: state.carbohydrates,
    activity: state.activity
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAllergies: allergies => { dispatch(setAllergies(allergies)) },
    setCalories: calories => { dispatch(setCalories(calories)) },
    setMeals: meals => { dispatch(setMeals(meals)) },
    setGoalWeight: goalWeight => { dispatch(setGoalWeight(goalWeight)) },
    setFats: fats => { dispatch(setFats(fats)) },
    setProteins: proteins => { dispatch(setProteins(proteins)) },
    setCarbohydrates: carbohydrates => { dispatch(setCarbohydrates(carbohydrates)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NutritionalInfo)
