import React, { Component } from 'react';
import './App.css';
import Map from './Components/Map.js'
import Input from './Components/Input.js'
import Stations from './Components/Stations';

class App extends Component{
  //define the state
  constructor(props) {
    super(props);
    this.state = {
      start: "",
      dest: "",
      fuelType: "PDL",
      stations: [],
      prices: [],
      mapStart: null,
      mapDest: null,
      accessToken: null,
      apiKey: null,
      transaction: 0,
      nearbyStations: null
    }
  }

  //retrieve station and price data
  async componentDidMount() {
    //GET request for API credentials using fetch
    await fetch("https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials", {
      "async": true,
      "crossDomain": true,
      "method": "GET",
      "headers": {
        "authorization": process.env.REACT_APP_FUEL_AUTH
      }
    })
      //format request into JS object
      .then(response => response.json())
      //update state
      .then(json => this.setState({
        accessToken: json.access_token,
        apiKey: json.client_id,
        transaction: this.state.transaction + 1
      }))
      
    // GET request for station information using fetch
    await fetch("https://api.onegov.nsw.gov.au/FuelPriceCheck/v1/fuel/prices", {
      "async": true,
      "crossDomain": true,
      "method": "GET",
      "headers": {
        "authorization": "Bearer " + this.state.accessToken,
        "apikey": this.state.apiKey,
        "transactionid": 1,
        "requesttimestamp": new Date().toLocaleString()
      }
    })
      //format request into JS object
      .then(response => response.json())
      //update state
      .then(json => this.setState({
        stations: json.stations,
        prices: json.prices
      }))
      .then(() => console.log(this.state.stations[0], this.state.prices[0]))
  }

  //handle input (start, destination, fuel type) change
  inputChangedHandler = (event) => {
    let {name, value} = event.target;
    this.setState({
      [name]: value,
    });
  }

  //handle submit button pressed
  submitHandler = (event) => {
    //update map state
    this.setState({
      mapStart: this.state.start,
      mapDest: this.state.dest
    });
  }

  //handle station marker clicked or station collapsible selected
  stationSelectedHandler = (stat) => {
    this.setState({
      selected: [{
        location: {
          lat: stat.info.location.latitude,
          lng: stat.info.location.longitude
        }
      }]
    })
  }

  //handle nearby stations update
  nearbyStationsHandler = (nearby) => {
    this.setState({nearbyStations: nearby});
  }

  //render components onto the screen, passing in corresponding state values and event handlers
  render(){
    return (
      <div className="App">
        <h1 className="title">Petrol Watch</h1>
        <Input 
          inputChangedHandler = {this.inputChangedHandler}
          submitHandler = {this.submitHandler}
          start={this.state.start}
          dest={this.state.dest}
          fuelType={this.state.fuelType}
          fuelLeft={this.state.fuelLeft}  
        />

        <Map 
          mapStart={this.state.mapStart}
          mapDest={this.state.mapDest}
          stations={this.state.stations}
          prices={this.state.prices}
          fuelType={this.state.fuelType}
          accesstoken={this.state.accesstoken}
          apikey={this.state.apikey}
          stationSelectedHandler={this.stationSelectedHandler}
          selected = {this.state.selected}
          nearbyStationsHandler={this.nearbyStationsHandler}
          nearbyStations = {this.state.nearbyStations}
        />

        <Stations 
          inputChangedHandler={this.inputChangedHandler}
          submitHandler={this.submitHandler}
          stationSelectedHandler={this.stationSelectedHandler}
          start={this.state.start}
          dest={this.state.dest}
          fuelType={this.state.fuelType}
          selected = {this.state.selected}
          nearbyStations={this.state.nearbyStations}
        />
      </div>
    );
  }
}

export default App;