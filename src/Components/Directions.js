//Code adapted from react-google-maps repository from NPM
//https://www.npmjs.com/package/@react-google-maps/api

import React, { useEffect, useRef } from 'react';
import { DirectionsRenderer } from '@react-google-maps/api';

const Directions = props => {
  //define route variables and count
  const { origin, destination, waypoints } = props;
  const count = useRef(0);

  //reset the count to 0 after every component re-render
  useEffect(() => {
    count.current = 0;
  }, [origin, destination, waypoints]);

  //make a call to Google Maps API using DirectionsService to get a route
  const directionsService = new window.google.maps.DirectionsService()
  directionsService.route({
    origin,
    destination,
    travelMode: 'DRIVING',
    waypoints,
  }, function (result, status) {
    if (status === window.google.maps.DirectionsStatus.OK && count.current === 0) {
      //Directions will only be updated after the first render of the component
      count.current += 1;
      props.setDir(result);
    } else {
      console.log('Directions request failed due to ' + status);
    }
  });

  //return directions object to DirectionsRenderer to display on Map
  return (
    <>
      {props.directions && (
        <DirectionsRenderer directions={props.directions} />
      )}
    </>
  );
}

export default Directions;