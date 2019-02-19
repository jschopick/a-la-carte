import React, { Component } from 'react'
import Header from './Header'
import { connect } from 'react-redux'
import MultiSlider from "multi-slider";
import axios from 'axios'
import './NutritionalInfo.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dispatches
import { setAllergies } from '../actions/setAllergies'
import { setCalories } from '../actions/setCalories'
import { setMeals } from '../actions/setMeals'
import { setGoalWeight } from '../actions/setGoalWeight'
import { setFats } from '../actions/setFats'
import { setProteins } from '../actions/setProteins'
import { setCarbohydrates } from '../actions/setCarbohydrates'
import { setAIBreakfast } from '../actions/setAIBreakfast'
import { setAILunch } from '../actions/setAILunch'
import { setAIDinner } from '../actions/setAIDinner'
import { setLothianBreakfast } from '../actions/setLothianBreakfast'
import { setLothianLunch } from '../actions/setLothianLunch'
import { setLothianDinner } from '../actions/setLothianDinner'

const colors = ["#FCBD7E", "#EB9F71", "#E6817C"]
const spinner = require('../assets/images/spinner.svg')

class NutritionalInfo extends Component {
  state = {
    values: [33, 33, 34],
    fats: 33,
    proteins: 33,
    carbohydrates: 34,
    isLoading: false
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
      if (!goalWeight) {
        toast.error("Enter a target weight!")
        return
      }
      if (Math.abs(this.props.weight - goalWeight) > 20) {
        toast.warn("You might be trying to either gain or lose too much!")
        return
      }
    }
    else if (this.props.experience == "expert") {
      calories = e.target.totalCalories.value
      fats = this.state.fats
      proteins = this.state.proteins
      carbohydrates = this.state.carbohydrates

      if (!calories) {
        toast.error("You forgot to enter your total calories for the day :(")
        return
      }
      if (calories < 1000 || calories > 4000) {
        toast.warn("Try entering a value between 1000 and 4000, inclusive.")
        return
      }
    }

    let meals = e.target.meals.value
    if (!meals) {
      toast.error("Don't forget to input your meals")
      return
    }
    if (meals < 1 || meals > 3) {
      toast.error("The number of meals should be between 1 and 3, inclusive")
      return
    }

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

    console.log({
      weight: this.props.weight,
      gender: this.props.gender,
      age: this.props.age,
      feet: this.props.feet,
      inches: this.props.inches,
      calories: calories,
      meals: meals,
      allergies: allergies,
      experience: this.props.experience,
      goalWeight,
      fats,
      proteins,
      carbohydrates,
      activity: this.props.activity
    })

    this.setState({ isLoading: true })
    axios.post("http://localhost:8000/api/userinfo", {
    // axios.post("https://www.alacar.tech:2053/api/userinfo", {
      weight: this.props.weight,
      gender: this.props.gender,
      age: this.props.age,
      feet: this.props.feet,
      inches: this.props.inches,
      calories: calories,
      meals: meals,
      allergies: allergies,
      experience: this.props.experience,
      goalWeight,
      fats,
      proteins,
      carbohydrates,
      activity: this.props.activity
    }).then(res => {
      let ai = res.data[0]
      let lothian = res.data[1]

      console.log(ai)

      this.props.setAIBreakfast(ai.breakfast)
      this.props.setAILunch(ai.lunch)
      this.props.setAIDinner(ai.dinner)
      this.props.setLothianBreakfast(lothian.breakfast)
      this.props.setLothianLunch(lothian.lunch)
      this.props.setLothianDinner(lothian.dinner)

      this.setState({ isLoading: false })

      this.props.history.push("/results")
    })
    .catch(err => console.log(err))
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
                    { this.props.experience === "expert" && <div className="col-md-12">
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
                  { this.props.experience === "beginner" && <div class="row">
                    <div className="col-md-12">
                      <p className="info-caption">Set your target weight (lbs).</p>
                      <input className="form-control" id="goal-weight" name="goalWeight" type="text" placeholder="Target weight..."/>
                    </div>
                  </div> }
                  { this.props.experience === "expert" && <div class="macro-container">
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
                    <div class="col-md-5">
                      <button id="submit-button" type="submit" className="btn btn-danger">Submit</button>
                    </div>
                    <div className="col-md-4">
                      <div className="loading-container">
                      { this.state.isLoading && <div className="loading"><img id="spinner" src={ spinner } alt=""/></div> }
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-4 image-filler-nutritional"></div>
          </div>
        </div>
        <ToastContainer
          position="bottom-center"
          hideProgressBar
        />
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
    setCarbohydrates: carbohydrates => { dispatch(setCarbohydrates(carbohydrates)) },
    setAIBreakfast: breakfast => { dispatch(setAIBreakfast(breakfast)) },
    setAILunch: lunch => { dispatch(setAILunch(lunch)) },
    setAIDinner: dinner => { dispatch(setAIDinner(dinner)) },
    setLothianBreakfast: breakfast => { dispatch(setLothianBreakfast(breakfast)) },
    setLothianLunch: lunch => { dispatch(setLothianLunch(lunch)) },
    setLothianDinner: dinner => { dispatch(setLothianDinner(dinner)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NutritionalInfo)
