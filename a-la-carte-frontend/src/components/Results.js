import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './Results.css'
import Card from './Card'
import axios from 'axios'
import html2canvas from 'html2canvas'

class Results extends Component {
  onClick = () => { // Takes a screenshot of the page and lets user save it
    html2canvas(document.body).then(function(canvas) {
      axios.post("http://localhost:8000/api/sendemail", {
        to: 'justin@schopick.com',
        from: 'support@alacar.tech',
        subject: 'Your Custom Meal Plan',
        html: '<body><p>You wanted it, you got it! We at A-la-carte hope that we can help you reach your nutrition goals! You will find your meal plan for tomorrow attached to this email. Please remember that even though we use high-tech algorithms to create your meal plan, we are not a substitute for professional medical advice.</p><img alt="Meal Plan" src="' + canvas.toDataURL() + '"/></body>'
      }).then(res => console.log(res))
      .catch(err => console.log(err))
    });
  }

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
              <div>&nbsp;&nbsp;&nbsp;</div>
              <button id="screenshot-button" type="button" className="btn btn-danger" onClick={this.onClick}>Email Me</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Results
