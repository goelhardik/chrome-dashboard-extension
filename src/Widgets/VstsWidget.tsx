import * as React from 'react';
import 'src/App.css';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import 'src/Widgets/VstsWidget.css';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { WidgetHeader } from 'src/Widgets/WidgetHeader';
import { GithubClient } from 'src/Clients/GithubClient';
import { AccessTokenRetriever, AuthorizationConstants } from 'src/AccessTokenRetriever';

export interface IVstsWidgetProps {
  dragWidget: (element: any) => void
}

export interface IVstsWidgetState {
  feed: any;
  isLoadingFeed: boolean;
  accessToken: string;

}

export class VstsWidget extends React.Component<IVstsWidgetProps, IVstsWidgetState> {
  private github: GithubClient;
  private tokenRetriever: AccessTokenRetriever;
  private elementTopPosKey: string = "chrome-agg-drag-and-drop-top-";
  private elementLeftPosKey: string = "chrome-agg-drag-and-drop-left-";

  constructor(props: IVstsWidgetProps) {
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
    const id = "vsts-widget";
    const widget = document.getElementById(id);
    this.props.dragWidget(widget);
    if (localStorage[this.elementTopPosKey + id]) {
      widget.style.top = localStorage[this.elementTopPosKey + id];
      widget.style.left = localStorage[this.elementLeftPosKey + id];
    }
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
      <div className="widget" id="vsts-widget">
        {/* <div className="parent" id="github-widget-header"> */}
        <WidgetHeader
          id="vsts-widget"
          backgroundColor={"#226db5"}
          href={"https://mseng.visualstudio.com/"}
          icon={<img src="vsts-icon.png" height="42" width="36" />} />
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

    // add target blank to all links
    const links = doc.getElementsByTagName("a");
    for (let link of Array.from(links)) {
      link.setAttribute("target", "_blank");
    }

    return doc.innerHTML;
  }
}
