import * as React from 'react';
import './App.css';
// const OAuth = require('./OAuth');
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { GithubClient } from './Clients/GithubClient';
// import { Feed } from './Clients/IClient';
import { GithubWidget } from './GithubWidget';
// import * as OAuth from './OAuth.js';
import { AccessTokenRetriever, AuthorizationConstants } from './AccessTokenRetriever';

class App extends React.Component<any, any> {
  private github: any;
  private tokenRetriever: AccessTokenRetriever;

  constructor(props: any) {
    super(props);
    this.state = {
      local: window.localStorage,
      githubFeed: null
    };
    this.github = new GithubClient();
    this.tokenRetriever = new AccessTokenRetriever();

    this.onButtonClick = this.onButtonClick.bind(this);
    this.onFeedGot = this.onFeedGot.bind(this);
  }

  public render() {
    this.tokenRetriever.retrieveAccessToken();

    return (
      <div>
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
        <div>
          <PrimaryButton
            text="read token"
            onClick={this.onReadTokenClick} />
        </div>s
      </div>
    );
  }

  private onReadTokenClick = () => {
    const tokenKey = AuthorizationConstants.github.storageKey;
    chrome.storage.sync.get([tokenKey], (result) => {
      console.log("Found Value: " + result[tokenKey]);
    });
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
