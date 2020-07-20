import React from 'react';
import './Input.css';

export default function Input(props) {
  return (
    <div className="Input">
      <input className="start" type="text" placeholder="Choose a starting location..." name="start" value={props.start} onChange={props.inputChangedHandler}/>
      <input className="dest" type="text" placeholder="Choose a destination..." name="dest" value={props.dest} onChange={props.inputChangedHandler}/>
      <p>Fuel Type: 
      <select className="fuelType" name="fuelType" defaultValue={props.fuelType} onChange={props.inputChangedHandler}>
        <option value="PDL">Diesel</option>
        <option value="U91">Unleaded 91</option>
        <option value="P98">Petroleum 98</option>
        <option value="E10">Ethanol</option>
      </select>
      <button className="submit" onClick={props.submitHandler}>Submit</button>
      </p>
    </div>
  )
}