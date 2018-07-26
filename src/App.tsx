import * as React from 'react';
import 'src/App.css';
import { GithubWidget } from 'src/Widgets/GithubWidget';
import { HackerNewsWidget } from 'src/Widgets/HackerNewsWidget';
import { VstsWidget } from 'src/Widgets/VstsWidget';
import 'src/Widgets/GithubWidget.css';
import { CustomizingPanel } from 'src/Customizer/CustomizingPanel';
import { Choice } from 'src/Customizer/WidgetGroup';

interface IAppState {
  widgetChoices: { [key: string]: Choice }
}

class App extends React.Component<any, IAppState> {
  private widgetChoicesKey: string = "chrome-agg-widget-choices-";
  private isCalloutVisibleKey: string = "chrome-agg-callout";

  constructor(props: any) {
    super(props);

    let choices: { [key: string]: Choice } = {};
    choices["github"] = {
      "name": "Github",
      "key": "github",
      "img": "GitHub-Mark-32px.png",
      "selected": localStorage[this.widgetChoicesKey + "github"] === "true" ? true : false
    };
    choices["hackernews"] = {
      "name": "HackerNews",
      "key": "hackernews",
      "img": "hacker-news-brands.svg",
      "selected": localStorage[this.widgetChoicesKey + "hackernews"] === "true" ? true : false
    };
    choices["vsts"] = {
      "name": "VSTS",
      "key": "vsts",
      "img": "vsts-icon.png",
      "selected": localStorage[this.widgetChoicesKey + "vsts"] === "true" ? true : false
    };

    this.updateCalloutVisible(choices);
    this.state = {
      widgetChoices: choices
    };
  }

  public render() {

    return (
      <div className="app-container">
        <div className="App">
          {/* <header className="App-header"> */}
          {/* <h1 className="App-title">Dashboard</h1> */}
          {/* </header> */}
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
          {this.state.widgetChoices["vsts"].selected &&
            <VstsWidget
              dragWidget={this.dragElement} />}
        </div>
      </div>
    );
  }

  private updateCalloutVisible = (choices: any) => {
    localStorage[this.isCalloutVisibleKey] = true;
    for (var key in choices) {
      if (choices[key].selected) {
        localStorage[this.isCalloutVisibleKey] = false;
        break;
      }
    }
  }

  private updateChoices = (choices: { [key: string]: Choice }) => {
    for (var key in choices) {
      localStorage[this.widgetChoicesKey + key] = choices[key].selected;
    }
    this.updateCalloutVisible(choices);
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
      localStorage["chrome-agg-drag-and-drop-top-" + elmnt.id] = elmnt.style.top;
      localStorage["chrome-agg-drag-and-drop-left-" + elmnt.id] = elmnt.style.left;
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

export default App;
