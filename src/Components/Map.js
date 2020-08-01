//Code adapted from react-google-maps repository from NPM
//https://www.npmjs.com/package/@react-google-maps/api

import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Directions from './Directions.js'
import './Map.css';

export default function Map(props) {
  const [directions, setDirections] = useState();
  const [avgLatLng, setAvgLatLng] = useState();
  const [duration, setDuration] = useState();
  const [distance, setDistance] = useState();

  function directionsChangedHandler(dirs) {
    console.log(dirs);
    setDirections(dirs);

    setAvgLatLng({
      lat: (dirs.routes[0].bounds.Za["j"] + 0.01), 
      lng: (dirs.routes[0].bounds.Va["i"])
    });

    //check stations within bounds
    let tmpStations = [];
    for (var i = 0; i < props.stations.length; i++){
      //check if latitude and longitude of a station are within bounds
      if (dirs.routes[0].bounds.Va["i"] <= props.stations[i.toString()].location.longitude && 
        props.stations[i.toString()].location.longitude <= dirs.routes[0].bounds.Va["j"] && 
        dirs.routes[0].bounds.Za["i"] <= props.stations[i.toString()].location.latitude && 
        props.stations[i.toString()].location.latitude <= dirs.routes[0].bounds.Za["j"]){
        //find corresponding prices for each station by matching station code and fuel type
        for (var j = 0; j < props.prices.length; j++){
          if (props.prices[j.toString()].stationcode === props.stations[i.toString()].code && 
          props.prices[j.toString()].fueltype === props.fuelType){
            //calculate journey duration + distance
            var totalDuration = 0;
            var totalDistance = 0;
            //get total distance and duration in metres and seconds, respectively,
            //by adding the distance and duration for each leg of the journey
            for (var k = 0; k < dirs.routes[0].legs.length; k++){
              totalDuration += dirs.routes[0].legs[k].duration.value;
              totalDistance += dirs.routes[0].legs[k].distance.value;
            }
            //set duration and distance in minutes and kilometres, and round numbers accordingly
            setDuration((totalDuration/60).toFixed(0));
            setDistance((totalDistance/1000).toFixed(1));

            tmpStations.push({
              "info": props.stations[i.toString()], 
              "price": props.prices[j.toString()].price, 
              "lastupdated":props.prices[j.toString()].lastupdated
            }); 
          }
        }
      }
    }
    //sort by price using a callback funciton
    tmpStations.sort(function(a, b){
      //returning 1 indicates that b is smaller than a
      if (a.price > b.price) return 1;
      //returning -1 indicates that a is smaller than b
      else return -1;
    })
    props.nearbyStationsHandler(tmpStations);
  }

  return (
    <LoadScript
      googleMapsApiKey = {process.env.REACT_APP_GOOGLEMAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={{width: '100vw', height: '60vh'}}
        zoom={15}
        center={{lat: -34.123, lng: 150.342}}
      >
        { props.nearbyStations != null && props.nearbyStations.map((stat) => 
          <Marker 
            position={{lat: stat.info.location.latitude, lng: stat.info.location.longitude}}
            label={stat.price.toString()}
            onClick={() => props.stationSelectedHandler(stat)}
          />
        )}

        { props.mapStart !== null && props.mapDest !== null && (
          <Directions
            origin = {props.mapStart}
            destination = {props.mapDest}
            directions = {directions}
            setDir = {directionsChangedHandler}
            waypoints = {props.selected}
          />
        )}

        {props.selected && (
           <InfoWindow position={avgLatLng}>
            <div className="InfoWindow">
              <p>Distance: {distance}km</p>
              <p>Duration: {duration} minutes</p>
            </div>
         </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}