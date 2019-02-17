import React, { Component } from 'react'
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
                  // breakfast={}
                  // lunch={}
                  // dinner={}
                />
              </div>
              <div className="col-md-5">
                <Card
                  // breakfast={}
                  // lunch={}
                  // dinner={}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Results
