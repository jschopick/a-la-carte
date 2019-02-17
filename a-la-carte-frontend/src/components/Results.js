import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './Results.css'
import Card from './Card'

class Results extends Component {
  render() {
    return (
      <div className="results-container">
        <div className="container-fluid">
          <div class="card-group-container">
            <div className="row justify-content-center">
              <div className="col-md-5">
                <Card
                  name="Aberdeen & Inverness"
                  // breakfast={}
                  // lunch={}
                  // dinner={}
                />
              </div>
              <div className="col-md-5">
                <Card
                  name="Lothian"
                  // breakfast={}
                  // lunch={}
                  // dinner={}
                />
              </div>
            </div>
          </div>
          <div className="restart-container">
            <div class="row justify-content-center">
              <NavLink to="/personal-info"><button id="restart-button" type="button" className="btn btn-danger">Restart</button></NavLink>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Results
