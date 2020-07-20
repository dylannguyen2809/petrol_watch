import React, { Component, useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, DirectionsService, Marker } from '@react-google-maps/api';

const Markers = ( props ) => {
  let markers = null;
  if(props.stations.length > 0){
      markers = props.stations.map((station, index) =>
        <Marker 
          position={{lat: station.location.latitude, lng: station.location.longitude}}
          //icon={"pin.png"}
          label={props.prices[index].price}
          onClick = {props.onMarkerClick}
        />
      );
  }
  return (
    {markers}
  )
};

export default Markers;