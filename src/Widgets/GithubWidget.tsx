import * as React from 'react';
import 'src/App.css';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import 'src/Widgets/GithubWidget.css';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { WidgetHeader } from 'src/Widgets/WidgetHeader';
import { GithubClient } from 'src/Clients/GithubClient';
import { AccessTokenRetriever, AuthorizationConstants } from 'src/AccessTokenRetriever';
// import { ResizeSensor } from 'src/ext/css-element-queries-1.0.0';

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
  private chromeGithubFeedKey: string = "chrome-agg-github-feed";
  private elementTopPosKey: string = "chrome-agg-drag-and-drop-top-";
  private elementLeftPosKey: string = "chrome-agg-drag-and-drop-left-";
  private elementHeightKey: string = "chrome-agg-resize-height-";
  private elementWidthKey: string = "chrome-agg-resize-width-";

  constructor(props: IGithubWidgetProps) {
    super(props);
    this.github = new GithubClient();
    this.tokenRetriever = new AccessTokenRetriever(this.setAccessToken);
    const githubFeed = localStorage[this.chromeGithubFeedKey];
    this.state = {
      feed: githubFeed,
      isLoadingFeed: githubFeed === null ? true : false,
      accessToken: null // check if this correct or not
    };
    this.checkAndSetToken();
  }

  public componentDidMount() {
    const id = "github-widget";
    const widget = document.getElementById(id);
    this.props.dragWidget(widget);
    if (localStorage[this.elementTopPosKey + id]) {
      widget.style.top = localStorage[this.elementTopPosKey + id];
      widget.style.left = localStorage[this.elementLeftPosKey + id];
    }
    if (localStorage[this.elementHeightKey + id]) {
      widget.style.height = localStorage[this.elementHeightKey + id];
      widget.style.width = localStorage[this.elementWidthKey + id];
    }
    // new ResizeSensor(widget, () => {
    //   localStorage[this.elementHeightKey + id] = widget.clientHeight + "px";
    //   localStorage[this.elementWidthKey + id] = widget.clientWidth + "px";
    // });
  }

  public render() {
    let content: JSX.Element;
    if (!this.state.accessToken) {
      content = this.renderSignInButton();
    } else if (this.state.isLoadingFeed) {
      content = this.renderSpinner();
    } else {
      content = this.renderFeedsContent();
    }

    return (
      <div className="widget" id="github-widget">
        {/* <div className="parent" id="github-widget-header"> */}
        <WidgetHeader
          id="github-widget"
          backgroundColor={"#000000"}
          href={"https://github.com/"}
          icon={<i className="fa fa-github fa-3x" aria-hidden="true"></i>} />
        {content}
        {/* </div> */}
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
      accessToken: accessToken
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
    this.setLocalFeed(null);
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
    this.setLocalFeed(response);
    this.setState({
      feed: response,
      isLoadingFeed: false
    });
  }

  private setLocalFeed(feed: any) {
    localStorage[this.chromeGithubFeedKey] = feed;
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

    // add target blank to all links
    const links = doc.getElementsByTagName("a");
    for (let link of Array.from(links)) {
      link.setAttribute("target", "_blank");
    }

    return doc.innerHTML;
  }
}
