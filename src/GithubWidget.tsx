import * as React from 'react';
// import { Feed, Item } from './Clients/IClient';
import './App.css';
// import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
// import { List } from 'office-ui-fabric-react/lib/List';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
// import { GithubClient } from './Clients/GithubClient';
import './GithubWidget.css';
import { GithubClient } from './Clients/GithubClient';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { AuthorizationConstants, AccessTokenRetriever } from './AccessTokenRetriever';
import { WidgetHeader } from './WidgetHeader';

export interface IGithubWidgetProps {
  dragWidget: (element: any) => void
}

export interface IGithubWidgetState {
  feed: any;
  isLoadingFeed: boolean;
  accessToken: string;

}

export class GithubWidget extends React.Component<IGithubWidgetProps, IGithubWidgetState> {
  private github: GithubClient;
  private tokenRetriever: AccessTokenRetriever;

  constructor(props: IGithubWidgetProps) {
    super(props);
    this.github = new GithubClient();
    this.tokenRetriever = new AccessTokenRetriever(this.setAccessToken);
    this.state = {
      feed: null,
      isLoadingFeed: false,
      accessToken: null // check if this correct or not
    };
    this.checkAndSetToken();
  }

  public componentDidMount() {
    const widget = document.getElementById("github-widget");
    this.props.dragWidget(widget);
  }

  public render() {
    let content: JSX.Element;
    if (this.state.accessToken && !this.state.isLoadingFeed) {
      content = this.renderFeedsContent();
    } else if (this.state.isLoadingFeed) {
      content = this.renderSpinner();
    } else {
      content = this.renderSignInButton();
    }

    return (
      <div className="widget" id="github-widget">
        <div className="parent" id="github-widget-header">
          <WidgetHeader
            backgroundColor={"#000000"}
            href={"https://github.com/"}
            icon={<i className="fa fa-github fa-3x" aria-hidden="true"></i>} />
          {content}
        </div>
      </div>
    );
  }

  private renderFeedsContent = (): JSX.Element => {
    return <div>
      <div dangerouslySetInnerHTML={{ __html: this.state.feed }} />
      <PrimaryButton
        text="Sign Out of GitHub"
        onClick={this.invalidateAccessToken} />
    </div>
  }

  private checkAndSetToken = () => {
    chrome.storage.sync.get([AuthorizationConstants.github.storageKey], (result) => {
      const accessToken = result[AuthorizationConstants.github.storageKey];
      if (accessToken === null || accessToken === undefined) {
        console.log("Failed to read accessToken from storage");
      }
      this.setAccessToken(accessToken);
    })
  }

  private setAccessToken = (accessToken: string) => {
    this.setState({
      accessToken: accessToken,
      isLoadingFeed: true
    });
    this.github.getFeed(this.onFeedGot, accessToken, this.invalidateAccessToken);
  }

  private invalidateAccessToken = () => {
    chrome.storage.sync.remove([AuthorizationConstants.github.storageKey], () => {
      this.setState({
        accessToken: null,
        isLoadingFeed: false
      });
    })
  }

  private renderSpinner(): JSX.Element {
    return (
      <Spinner
        size={SpinnerSize.medium} />
    )
  }

  private renderSignInButton = (): JSX.Element => {
    return (
      <PrimaryButton
        text="Log in to view your github feed"
        onClick={this.onSignOnClicked} />
    );
  }

  private onSignOnClicked = () => {
    this.setState({
      isLoadingFeed: true
    });
    this.tokenRetriever.retrieveAccessToken();
  }

  private onFeedGot = (response: string) => {
    response = this.manipulateDom(response);
    console.log(response);
    this.setState({
      feed: response,
      isLoadingFeed: false
    });
  }

  private manipulateDom = (dom: string): string => {
    let re = /href="/gi;
    dom = dom.replace(re, "href=\"https://github.com");

    let doc = document.createElement('html');
    doc.innerHTML = dom;
    // remove forms (star and unstar actions) // TODO add later and call github apis
    const forms = doc.getElementsByTagName("form");
    for (let form of Array.from(forms)) {
      form.remove();
    }

    return doc.innerHTML;
  }
}
