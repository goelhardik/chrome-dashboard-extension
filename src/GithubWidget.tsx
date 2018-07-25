import * as React from 'react';
import { Feed, Item } from './Clients/IClient';
import './App.css';
// import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { List } from 'office-ui-fabric-react/lib/List';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
// import { GithubClient } from './Clients/GithubClient';
import './GithubWidget.css';
import { GithubClient } from './Clients/GithubClient';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { AuthorizationConstants, AccessTokenRetriever } from './AccessTokenRetriever';

export interface IGithubWidgetProps {
  items: Item[];
}

export interface IGithubWidgetState {
  feed: Item[];
  isLoadingFeed: boolean;
  accessToken: string;

}

export class GithubWidget extends React.Component<any, IGithubWidgetState> {
  private github: GithubClient;
  private tokenRetriever: AccessTokenRetriever;

  constructor(props: any) {
    super(props);
    this.github = new GithubClient();
    this.tokenRetriever = new AccessTokenRetriever(this.setAccessToken);
    this.state = {
      feed: new Array<Item>(),
      isLoadingFeed: true,
      accessToken: null // check if this correct or not
    };
    this.checkAndSetToken();
  }

  public render() {
    let content: JSX.Element;
    if (this.state.accessToken && !this.state.isLoadingFeed) {
      content =this.renderFeedsContent();
    } else if (this.state.isLoadingFeed) {
      content = this.renderSpinner();
    } else {
      content = this.renderSignInButton();
    }

    return (
      <div className="widget">
        {content}
      </div>
    );
  }

  private renderFeedsContent = (): JSX.Element => {
    return <div> <List
      items={this.state.feed}
      onRenderCell={this.onRenderCell} />
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

  private onFeedGot = (response: Feed) => {
    console.log(response);
    this.setState({
      feed: response.items,
      isLoadingFeed: false
    });
  }

  private onRenderCell = (item: Item, index: number | undefined): JSX.Element => {
    return (
      <div className="item-cell" data-is-focusable={true}>
        <Image
          className="item-image"
          src={item.thumbnail}
          width={50}
          height={50}
          imageFit={ImageFit.cover}
        />
        <div className="ms-ListBasicExample-itemContent">
          <div className="ms-ListBasicExample-itemName">{item.title}</div>
          <div className="ms-ListBasicExample-itemIndex">{`Item ${index}`}</div>
          <div className="ms-ListBasicExample-itemDesc">{item.description}</div>
        </div>
      </div>
    );
  }
}
