import React, { Component } from 'react';
import './App.css';
import Map from './Components/Map.js'
import Input from './Components/Input.js'
import Stations from './Components/Stations';

class App extends Component{
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
      accesstoken: null,
      apikey: null,
      transaction: 0,
      nearbyStations: null
    }
  }

  //retrieve station price data
  async componentDidMount() {
    await fetch("https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken?grant_type=client_credentials", {
      "async": true,
      "crossDomain": true,
      "method": "GET",
      "headers": {
        "authorization": process.env.REACT_APP_FUEL_AUTH
      }
    })
      .then(response => response.json())
      .then(json => this.setState({
        accesstoken: json.access_token,
        apikey: json.client_id,
        transaction: this.state.transaction + 1
      }))
      
      // Simple POST request with a JSON body using fetch
      fetch("https://api.onegov.nsw.gov.au/FuelPriceCheck/v1/fuel/prices", {
        "async": true,
        "crossDomain": true,
        "method": "GET",
        "headers": {
          "authorization": "Bearer " + this.state.accesstoken,
          "apikey": this.state.apikey,
          "transactionid": 1,
          "requesttimestamp": new Date().toLocaleString()
        }
      })
        .then(response => response.json())
        .then(json => this.setState({
          stations: json.stations,
          prices: json.prices
        }))
  }

  inputChangedHandler = (event) => {
    let {name, value} = event.target;
    this.setState({
      [name]: value,
    });
  }

  submitHandler = (event) => {
    //update map state
    this.setState({
      mapStart: this.state.start,
      mapDest: this.state.dest
    });
  }

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

  nearbyStationsHandler = (nearby) => {
    this.setState({nearbyStations: nearby});
  }

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