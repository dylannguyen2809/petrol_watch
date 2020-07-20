import React from 'react';
import Collapsible from 'react-collapsible';
import './Stations.css';

export default function Stations(props) {
  let stations = null;

  if(props.nearbyStations === null){
      stations = <p>No nearby stations for the specified route.</p>
  } else {
    stations = props.nearbyStations.map((station, index) =>
      <Collapsible 
        trigger={station.info.name + ": $" + station.price}
        onOpening={() => props.stationSelectedHandler(station)}
      >
        <p><b>Address:</b> {station.info.address}</p>
        <p><em>Last updated {station.lastupdated}</em></p>
      </Collapsible>
    )}

  return (
    <div className="Stations">
      <h1>Nearby Stations</h1>
      {stations}
    </div>
  )
}