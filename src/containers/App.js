import React, { Component } from 'react';
import ClockCounterContainer from "./ClockCounterContainer/ClockCounterContainer";
import logo from '../assets/svgs/bell.svg';
import './App.css';
// import { DingDongCounter } from './DingDongCounter/DingDongCounter';

class App extends Component {
  render() {
    return <div className="app">
        <header className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <h1 className="app-title">Clock Bell Counter</h1>
        </header>
        <section className="content p-20">
          <ClockCounterContainer />
        </section>
      </div>;
  }
}

export default App;
