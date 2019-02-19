import React, { Component } from 'react'
import './Results.css'
import Card from './Card'
import { connect } from 'react-redux'
import axios from 'axios'
import html2canvas from 'html2canvas'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dispatches
import { setAllergies } from '../actions/setAllergies'
import { setCalories } from '../actions/setCalories'
import { setGoalWeight } from '../actions/setGoalWeight'
import { setFats } from '../actions/setFats'
import { setProteins } from '../actions/setProteins'
import { setCarbohydrates } from '../actions/setCarbohydrates'

const validator = require("email-validator")

// { 
//    breakfast:
//    [ 
//      { foodName: 'Assorted Bagels (Plain, Onion, Blueberry, Cinn raisin)', numGrams: 57 },
//      { foodName: 'Bacon', numGrams: 15 } 
//    ],
//    lunch:
//    [ 
//      { foodName: 'All-American Blended Burger', numGrams: 113 },
//      { foodName: 'Black Bean Burger', numGrams: 120 },
//      { foodName: 'Grilled Chicken Breast', numGrams: 112 },
//      { foodName: 'Minestrone', numGrams: 227 } ],
//    dinner:
//    [
//      { foodName: 'Topping', numGrams: 16 },
//      { foodName: 'Grilled Chicken Breast', numGrams: 112 },
//      { foodName: 'Grilled Chicken Breast', numGrams: 112 },
//      { foodName: 'Grilled Chicken Breast', numGrams: 112 } ] 
// }

class Results extends Component {
  state = {
    modal: false
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  // onClick = () => { // Takes a screenshot of the page and lets user save it
  //   html2canvas(document.body).then(canvas => {
  //     axios.post("http://localhost:8000/api/sendemail", {
  //       to: 'justin@schopick.com',
  //       from: 'support@alacar.tech',
  //       subject: 'Your Custom Meal Plan',
  //       html: '<body><p>You wanted it, you got it! We at A-la-carte hope that we can help you reach your nutrition goals! You will find your meal plan for tomorrow below. Please remember that even though we use high-tech algorithms to create your meal plan, we are not a substitute for professional medical advice.</p><img alt="Meal Plan" src="' + canvas.toDataURL() + '"/></body>'
  //     }).then(res => console.log(res))
  //     .catch(err => console.log(err))
  //   });
  // }

  submitEmail = e => {
    e.preventDefault()

    let email = e.target.email.value

    if (!validator.validate(email)) {
      toast.error("Invalid e-mail!")
      return
    }

    console.log(email)

    html2canvas(document.body).then(canvas => {
      axios.post("http://localhost:8000/api/sendemail", {
      // axios.post("https://www.alacar.tech:2053/api/sendemail", {
        to: email,
        from: 'support@alacar.tech',
        subject: 'Your Custom Meal Plan',
        html: '<body><p>You wanted it, you got it! We at A-la-carte hope that we can help you reach your nutrition goals! You will find your meal plan for tomorrow below. Please remember that even though we use high-tech algorithms to create your meal plan, we are not a substitute for professional medical advice.</p><img alt="Meal Plan" src="' + canvas.toDataURL() + '"/></body>'
      }).then(res => {
        console.log(res)
        this.setState({ modal: false })
      }).catch(err => console.log(err))
    });
  }

  handleRestart = e => {
    e.preventDefault()

    this.props.setAllergies(undefined)
    this.props.setCalories(undefined)
    this.props.setGoalWeight(undefined)
    this.props.setFats(undefined)
    this.props.setProteins(undefined)
    this.props.setCarbohydrates(undefined)

    this.props.history.push("/personal-info")
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
                  breakfast={ this.props.aiBreakfast }
                  lunch={ this.props.aiLunch }
                  dinner={ this.props.aiDinner }
                />
              </div>
              <div className="col-md-5">
                <Card
                  name="Lothian"
                  breakfast={ this.props.lothianBreakfast }
                  lunch={ this.props.lothianLunch }
                  dinner={ this.props.lothianDinner }
                />
              </div>
            </div>
          </div>
          <div className="restart-container">
            <div class="row justify-content-center">
              <button id="restart-button" type="button" className="btn btn-danger" onClick={ this.handleRestart }>Restart</button>
              <div>&nbsp;&nbsp;&nbsp;</div>
              <button id="screenshot-button" type="button" className="btn btn-secondary" onClick={this.toggleModal}>Email Me</button>
            </div>
          </div>
          <div className="modal-container">
            <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="email-modal">
              <ModalHeader className="email-header">
                E-mail Results
              </ModalHeader>
              <ModalBody>
                <form onSubmit={ this.submitEmail } autoComplete="off">
                  <input type="text" class="form-control border" id="email-input" name="email" placeholder="johndoe@alacar.tech"/>
                  <div class="submit-email-container">
                    <button className="btn btn-secondary" id="submit-email" type="submit">Submit</button>
                  </div>
                </form>
              </ModalBody>
            </Modal>
          </div>
          <ToastContainer
            position="bottom-center"
            hideProgressBar
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    lothianBreakfast: state.lothianBreakfast,
    lothianLunch: state.lothianLunch,
    lothianDinner: state.lothianDinner,
    aiBreakfast: state.aiBreakfast,
    aiLunch: state.aiLunch,
    aiDinner: state.aiDinner
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAllergies: allergies => { dispatch(setAllergies(allergies)) },
    setCalories: calories => { dispatch(setCalories(calories)) },
    setGoalWeight: goalWeight => { dispatch(setGoalWeight(goalWeight)) },
    setFats: fats => { dispatch(setFats(fats)) },
    setProteins: proteins => { dispatch(setProteins(proteins)) },
    setCarbohydrates: carbohydrates => { dispatch(setCarbohydrates(carbohydrates)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Results)
