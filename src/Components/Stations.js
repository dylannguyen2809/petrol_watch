import React from 'react';
import Collapsible from 'react-collapsible';
import './Stations.css';

export default function Stations(props) {
  //define empty stations object
  let stations = null;

  //check for nearby stations
  if(props.nearbyStations === null){
    //display error message
    stations = <p>No nearby stations for the specified route.</p>
  } else {
    //map each nearby station to a Collapsible component for rendering
    stations = props.nearbyStations.map((station) =>
      <Collapsible 
        trigger={station.info.name + ": $" + station.price}
        onOpening={() => props.stationSelectedHandler(station)}
      >
        <p><b>Address:</b> {station.info.address}</p>
        <p><em>Last updated {station.lastupdated}</em></p>
      </Collapsible>
    )}

  //render stations
  return (
    <div className="Stations">
      <h1>Nearby Stations</h1>
      {stations}
    </div>
  )
}