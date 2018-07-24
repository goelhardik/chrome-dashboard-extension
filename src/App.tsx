import * as React from 'react';
import './App.css';
// const OAuth = require('./OAuth');
// import { Feed } from './Clients/IClient';
import { GithubWidget } from './GithubWidget';
import { AccessTokenRetriever } from './AccessTokenRetriever';
// import * as OAuth from './OAuth.js';
import './GithubWidget.css';

class App extends React.Component<any, any> {
  private tokenRetriever: AccessTokenRetriever;

  constructor(props: any) {
    super(props);
    this.tokenRetriever = new AccessTokenRetriever();
  }

  public render() {
    this.tokenRetriever.retrieveAccessToken();

    // Also append the current URL to the params
    // const oauth = OAuth.OAuth;
    // if (!this.state.githubFeed) {
    //   oauth.authorize((storage: any) => {
    //     this.setState({
    //       local: storage
    //     });
    //   });
    // }
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
        </div>
        <div className="widget-container">
          <GithubWidget />
        </div>
      </div>
    );
  }
}

export default App;
