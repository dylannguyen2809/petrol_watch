//Code adapted from react-google-maps repository from NPM
//https://www.npmjs.com/package/@react-google-maps/api

import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker, InfoWindow } from '@react-google-maps/api';
import './Map.css';
//import useTheme from "@material-ui/core/styles/useTheme";

const Directions = props => {
  //const theme = useTheme();
  const { origin, destination, waypoints } = props;
  const count = useRef(0);

  useEffect(() => {
    count.current = 0;
  }, [origin, destination, waypoints]);

  const directionsService = new window.google.maps.DirectionsService()
  directionsService.route({
          origin,
          destination,
          travelMode: 'DRIVING',
          waypoints,
        }, function (result, status) {
          if (status === window.google.maps.DirectionsStatus.OK && count.current === 0) {
              count.current += 1;
              props.setDir(result)
          }
        });

  return (
    <>
      {props.directions && (
        <DirectionsRenderer directions={props.directions} />
      )}
    </>
  );
};

export default function Map(props) {
  const [directions, setDirections] = useState();
  const [avgLatLng, setAvgLatLng] = useState();
  const [duration, setDuration] = useState();
  const [distance, setDistance] = useState();

  function directionsChangedHandler(dirs) {
    setDirections(dirs);

    setAvgLatLng({
      lat: (dirs.routes[0].bounds.Za["j"] + 0.01), 
      lng: (dirs.routes[0].bounds.Ua["i"])
    });

    //check stations within bounds
    let tmpStations = [];
    for (var i = 0; i < props.stations.length; i++){
      if (dirs.routes[0].bounds.Ua["i"] <= props.stations[i.toString()].location.longitude && props.stations[i.toString()].location.longitude <= dirs.routes[0].bounds.Ua["j"]
        && dirs.routes[0].bounds.Za["i"] <= props.stations[i.toString()].location.latitude && props.stations[i.toString()].location.latitude <= dirs.routes[0].bounds.Za["j"]){
        for (var j = 0; j < props.prices.length; j++){
          if (props.prices[j.toString()].stationcode == props.stations[i.toString()].code && props.prices[j.toString()].fueltype == props.fuelType){
            //calculate journey duration + distance
            var totalDuration = 0;
            var totalDistance = 0;
            //get total distance and duration in metres and seconds, respectively
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
    //sort by price
    tmpStations.sort(function(a, b){
      return a.price-b.price
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