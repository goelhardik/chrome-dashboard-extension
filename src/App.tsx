import * as React from 'react';
import './App.css';
// const OAuth = require('./OAuth');
// import { Feed } from './Clients/IClient';
import { GithubWidget } from './GithubWidget';
// import * as OAuth from './OAuth.js';
import './GithubWidget.css';

class App extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    const widget = document.getElementById("github-widget");
    this.dragElement(widget);
  }

  public render() {
    return (
      <div className="app-container">
        <div className="App">
          <header className="App-header">
            <img src="https://facebook.github.io/react/img/logo.svg" className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        </div>
        <div className="widget-container">
          <GithubWidget />
        </div>
      </div>
    );
  }

  private dragElement(elmnt: any) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e: any) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

export default App;
