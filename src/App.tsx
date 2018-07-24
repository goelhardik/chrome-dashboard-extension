import * as React from 'react';
import './App.css';
// const OAuth = require('./OAuth');
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { GithubClient } from './Clients/GithubClient';
// import { Feed } from './Clients/IClient';
import { GithubWidget } from './GithubWidget';
// import * as OAuth from './OAuth.js';
import { OAuth } from './OAuth';

class App extends React.Component<any, any> {
  private github: any;
  private oauth: any;

  constructor(props: any) {
    super(props);
    this.state = {
      local: window.localStorage,
      githubFeed: null
    };
    this.github = new GithubClient();
    this.oauth = new OAuth();

    this.onButtonClick = this.onButtonClick.bind(this);
    this.onFeedGot = this.onFeedGot.bind(this);
  }

  public render() {

    // Also append the current URL to the params
    // const oauth = OAuth.OAuth;
    // if (!this.state.githubFeed) {
    //   oauth.authorize((storage: any) => {
    //     this.setState({
    //       local: storage
    //     });
    //   });
    // }
    this.oauth.authorize(() => {});

    return (
      <div className="App">
        <header className="App-header">
          <img src="https://facebook.github.io/react/img/logo.svg" className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <PrimaryButton
          text="test"
          onClick={this.onButtonClick} />;
        {this.state.githubFeed &&
          <GithubWidget
            items={this.state.githubFeed} />
        }
      </div>
    );
  }

  private onButtonClick() {
    this.github.getFeed(this.onFeedGot);
  }

  private onFeedGot(response: any) {
    this.setState({
      githubFeed: response
    });
  }
}

export default App;
