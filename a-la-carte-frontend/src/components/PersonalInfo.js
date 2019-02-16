import React, { Component } from 'react'
import './PersonalInfo.css'
import Header from './Header'
import { connect } from 'react-redux'

// Dispatches
import { setGender } from '../actions/setGender'
import { setAge } from '../actions/setAge'
import { setWeight } from '../actions/setWeight'
import { setFeet } from '../actions/setFeet'
import { setInches } from '../actions/setInches'

class PersonalInfo extends Component {
  handleSubmit = e => {
    e.preventDefault()

    let gender = e.target.gender.value
    let years = e.target.years.value
    let weight = e.target.weight.value
    let feet = e.target.feet.value
    let inches = e.target.inches.value

    this.props.setGender(gender)
    this.props.setAge(years)
    this.props.setWeight(weight)
    this.props.setFeet(feet)
    this.props.setInches(inches)

    this.props.history.push("/nutritional-info")
  }

  render() {
    return (
      <div className="personal-info-container">
        <div class="container-fluid">
        	<div class="row">
            <div class="col-md-8">
              <Header/>
              <div class="row justify-content-center">
                <div className="personal-info-title-container">
                    <h1 className="title">Personal Info</h1>
                  </div>
              </div>
              <div class="personal-info-form-container">
                <form className="personal-info-form" onSubmit={ this.handleSubmit }>
                  <div class="row">
                    <div class="col-md-8">
                      <p className="info-caption">Please select your gender.</p>
                      <select className="form-control" name="gender" id="gender">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div className="col-md-8">
                      <p className="info-caption">Enter your age (in years).</p>
                      <input className="form-control" id="years" name="years" type="text" placeholder="Years..."/>
                    </div>
                  </div>
                  <div class="row">
                    <div className="col-md-10">
                      <p className="info-caption">Enter your height (ft, in).</p>
                        <div class="row">
                          <div class="col-md-5">
                            <input className="form-control form-inline" id="feet" name="feet" type="text" placeholder="Feet..."/>
                          </div>
                          <div class="col-md-5">
                            <input className="form-control form-inline" id="inches" name="inches" type="text" placeholder="Inches..."/>
                          </div>
                        </div>
                    </div>
                  </div>
                  <div class="row">
                    <div className="col-md-8">
                      <p className="info-caption">Enter your weight (lbs).</p>
                      <input className="form-control" id="weight" type="text" name="weight" placeholder="Weight..."/>
                    </div>
                  </div>
                  <div className="row justify-content-center">
                    <button id="submit-button" type="submit" className="btn btn-primary">Next</button>
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

const mapDispatchToProps = dispatch => {
  return {
    setGender: gender => { dispatch(setGender(gender)) },
    setWeight: weight => { dispatch(setWeight(weight)) },
    setAge: age => { dispatch(setAge(age)) },
    setFeet: feet => { dispatch(setFeet(feet)) },
    setInches: inches => { dispatch(setInches(inches)) }
  }
}

export default connect(null, mapDispatchToProps)(PersonalInfo)