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

export interface IGithubWidgetProps {
  items: Item[];
}

export interface IGithubWidgetState {
  feed: Item[];
  isLoadingFeed: boolean;
}

export class GithubWidget extends React.Component<any, IGithubWidgetState> {
  private github: GithubClient;

  constructor(props: any) {
    super(props);
    this.github = new GithubClient();
    this.state = {
      feed: new Array<Item>(),
      isLoadingFeed: false
    };

    this.renderSignInButton = this.renderSignInButton.bind(this);
    this.onRenderCell = this.onRenderCell.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onFeedGot = this.onFeedGot.bind(this);
  }

  public render() {
    let content: JSX.Element;
    if (this.state.feed.length == 0 && !this.state.isLoadingFeed) {
      content = this.renderSignInButton();
    } else if (this.state.isLoadingFeed) {
      content = this.renderSpinner();
    } else {
      content = <List
            items={this.state.feed}
            onRenderCell={this.onRenderCell} />;
    }
    return (
        <div className="widget">
          {content}
        </div>
    );
  }

  private renderSpinner(): JSX.Element {
    return (
      <Spinner
        size={SpinnerSize.medium} />
    )
  }

  private renderSignInButton(): JSX.Element {
    return (
      <PrimaryButton
        text="test"
        onClick={this.onButtonClick} />
    );
  }

  private onButtonClick() {
    this.setState({
      isLoadingFeed: true 
    });
    this.github.getFeed(this.onFeedGot);
  }

  private onFeedGot(response: Feed) {
    console.log(response);
    this.setState({
      feed: response.items,
      isLoadingFeed: false
    });
  }

  private onRenderCell(item: Item, index: number | undefined): JSX.Element {
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
