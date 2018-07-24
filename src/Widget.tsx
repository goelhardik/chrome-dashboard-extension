import * as React from 'react';
import './App.css';

import logo from './logo.svg';

export class Widget extends React.Component {
  public render() {
    let test = 1;
    test += 1;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to widget</h1>
          <p>{test}</p>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/Widget.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}
