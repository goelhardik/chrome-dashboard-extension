import * as React from 'react';
import './App.css';
import { GithubWidget } from './GithubWidget';
import { HackerNewsWidget } from './HackerNewsWidget';
// import * as OAuth from './OAuth.js';
import './GithubWidget.css';
import { CustomizingPanel } from './Customizer/CustomizingPanel';
import { Choice } from './Customizer/WidgetGroup';

interface IAppState {
  widgetChoices: { [key: string]: Choice }
}

class App extends React.Component<any, IAppState> {

  constructor(props: any) {
    super(props);

    let choices: { [key: string]: Choice } = {};
    choices["github"] = {
      "name": "Github",
      "key": "github",
      "img": "GitHub-Mark-32px.png",
      "selected": true
    };
    choices["hackernews"] = {
      "name": "HackerNews",
      "key": "hackernews",
      "img": "GitHub-Mark-32px.png",
      "selected": false
    };
    choices["vsts"] = {
      "name": "VSTS",
      "key": "vsts",
      "img": "visual-studio-team-services.jpg",
      "selected": false
    };

    this.state = {
      widgetChoices: choices
    };
  }

  public render() {

    return (
      <div className="app-container">
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Dashboard</h1>
          </header>
          <CustomizingPanel 
            choices={this.state.widgetChoices}
            onDismissPanel={this.updateChoices} />
        </div>
        <div className="widget-container">
          {this.state.widgetChoices["github"].selected && 
            <GithubWidget 
              dragWidget={this.dragElement} />}
          {this.state.widgetChoices["hackernews"].selected && 
            <HackerNewsWidget 
              dragWidget={this.dragElement} />}
        </div>
      </div>
    );
  }

  private updateChoices = (choices : { [key: string]: Choice }) => {
    this.setState({
      widgetChoices: choices
    });
  }

  private dragElement = (elmnt: any) => {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("drag-and-drop-" + elmnt.id)) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById("drag-and-drop-" + elmnt.id).onmousedown = dragMouseDown;
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
