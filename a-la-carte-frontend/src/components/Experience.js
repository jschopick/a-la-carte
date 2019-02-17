import React, { Component } from 'react'
import './Experience.css'
import Header from './Header'
import { connect } from 'react-redux'
import { Button, ButtonGroup } from 'reactstrap';

// Dispatches
import { setExperience } from '../actions/setExperience'

class Experience extends Component {
  state = {
    cSelected: 1
  }

  onRadioBtnClick(cSelected) {
    this.setState({ cSelected });
  }

  handleClick = e => {
    e.preventDefault()
    let experience = ""

    if (this.state.cSelected == 1) {
      console.log("expert")
      experience = "expert"
    }
    else {
      experience = "beginner"
    }

    this.props.setExperience(experience)
    console.log(experience)
    this.props.history.push('/nutritional-info')
  }

  render() {
    return (
      <div className="experience-info-container">
        <div class="container-fluid">
        	<div class="left-container">
            <div class="row">
                <div class="col-md-8">
                  <Header/>
                  <div class="row justify-content-center">
                    <div className="experience-info-title-container">
                      <h1 className="title">Experience</h1>
                    </div>
                  </div>
                  <div className="row justify-content-center">
                    <p className="info-caption" id="macro-caption">Do you know what your macro distribution is?</p>
                  </div>
                  <div className="row justify-content-center">
                    <ButtonGroup>
                      <Button className="experience-button" color="danger" onClick={() => this.onRadioBtnClick(1)} active={this.state.cSelected === 1}>Yes</Button>
                      <Button className="experience-button" color="danger" onClick={() => this.onRadioBtnClick(2)} active={this.state.cSelected === 2}>No</Button>
                    </ButtonGroup>
                  </div>
                  <div className="row justify-content-center">
                    <button id="experience-next" type="submit" onClick={ this.handleClick } className="btn btn-primary">Next</button>
                  </div>
                </div>
                <div className="col-md-4 image-filler-experience" id="special"></div>
              </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setExperience: experience => { dispatch(setExperience(experience)) }
  }
}

export default connect(null, mapDispatchToProps)(Experience)