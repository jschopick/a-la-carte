import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import PersonalInfo from './components/PersonalInfo'
import NutritionalInfo from './components/NutritionalInfo'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={ Home }/>
            <Route path="/personal-info" component={ PersonalInfo }/>
            <Route path="/nutritional-info" component={ NutritionalInfo }/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
