import React, { Component } from 'react';
import { isValidHour, isValidMinute, calculateRingsBetweenTime } from '../../helpers/TimeHelpers';
import './ClockCounterContainer.css';

class ClockCounterContainer extends Component {
  constructor() {
    super();
    this.state = {
      bellCount: '',
      validSTART: true,
      validEND: true
    };
  }

  // Removes all non-digits character except ':' literal
  sanitizeUserInput = val => val.trim().replace(/[^\d:]/g, '');

  isValid = val => {
    let [result, hour, , minute] =
      this.sanitizeUserInput(val).match(/^(\d{1,2})([:]{1})(\d{2})$/) || []; // https://regex101.com/r/sxzzNg/2/
    return result
      ? isValidHour(hour) && isValidMinute(minute)
      : false;
  };

  updateInputErrorState = (targetName, validity) => this.setState({ [`valid${targetName.toUpperCase()}`]: validity });

  validateUserInput = ({ target } = {}) => {
    return this.updateInputErrorState(target.name, this.isValid(target.value));
  };

  updateDisplay = bellCount => this.setState({ bellCount });

  handleSubmit = e => {
    e.preventDefault();
    if (!(this.state.validSTART && this.state.validEND)) return;

    let startTime = document.querySelector("input[name='start']").value;
    let endTime = document.querySelector("input[name='end']").value;

    let result = calculateRingsBetweenTime(startTime, endTime);
    this.updateDisplay(result);
  };

  render() {
    return (
      <div className="clock-container p-20">
        <form onSubmit={this.handleSubmit}>
          <div className="time-containers p-20">
            <div className="start-time-container p-20">
              <label htmlFor="start">Start Time:</label>
              <input
                name="start"
                type="text"
                placeholder="HH:MM"
                required
                onBlur={this.validateUserInput}
              />
              {!this.state.validSTART && (
                <p className="error">Invalid Start Time.</p>
              )}
            </div>
            <div className="end-time-container p-20">
              <label htmlFor="end">End Time:</label>
              <input
                name="end"
                type="text"
                placeholder="HH:MM"
                required
                onBlur={this.validateUserInput}
              />
              {!this.state.validEND && (
                <p className="error">Invalid End Time.</p>
              )}
            </div>
          </div>
          <input type="submit" className="button"/>
        </form>
        <p>{this.state.bellCount}</p>
      </div>
    );
  }
}

export default ClockCounterContainer;
