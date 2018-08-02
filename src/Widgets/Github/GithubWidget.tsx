import * as React from "react";
import "src/App.css";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import "src/Widgets/Github/GithubWidget.css";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { WidgetHeader } from "src/Widgets/WidgetHeader";
import { GithubClient } from "src/Clients/GithubClient";
import { GithubConstants } from "src/Shared/Constants";
import { GithubFeedPivot } from "./GithubFeedPivot";
import { Pivot, PivotItem } from "office-ui-fabric-react/lib/Pivot";
import { GithubDiscoverPivot } from "src/Widgets/Github/GithubDiscoverPivot";
// import { ResizeSensor } from 'src/ext/css-element-queries-1.0.0';

export interface IGithubWidgetProps {
  dragWidget: (element: any) => void;
}

export interface IGithubWidgetState {
  isLoggingIn: boolean;
  isLoggedIn: boolean;
}

export class GithubWidget extends React.Component<
  IGithubWidgetProps,
  IGithubWidgetState
> {
  private github: GithubClient;
  private elementTopPosKey: string = "chrome-agg-drag-and-drop-top-";
  private elementLeftPosKey: string = "chrome-agg-drag-and-drop-left-";
  private elementHeightKey: string = "chrome-agg-resize-height-";
  private elementWidthKey: string = "chrome-agg-resize-width-";
  private loginPopup: Window = null;

  constructor(props: IGithubWidgetProps) {
    super(props);
    this.github = new GithubClient();
    this.checkIfLoggedIn();
    // const githubFeed = localStorage[this.chromeGithubFeedKey];
    this.state = {
      isLoggingIn: true,
      isLoggedIn: false
    };
  }

  public componentDidMount() {
    const id = GithubConstants.WidgetId;
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
    if (this.state.isLoggingIn) {
      content = this.renderSpinner();
    } else if (!this.state.isLoggedIn) {
      content = this.renderSignInButton();
    }

    return (
      <div className="widget" id={GithubConstants.WidgetId}>
        <WidgetHeader
          id={GithubConstants.WidgetId}
          backgroundColor={"#000000"}
          href={GithubConstants.Home}
          icon={<i className="fa fa-github fa-3x" aria-hidden="true" />}
        />
        {content}
        {this.renderFeedsContent()}
      </div>
    );
  }

  private renderFeedsContent = (): JSX.Element => {
    return (
      <div>
        <Pivot>
          <PivotItem headerText={GithubConstants.DiscoverPivotTitle} >
            <GithubDiscoverPivot github={this.github} />
          </PivotItem>
          <PivotItem headerText={GithubConstants.FeedPivotTitle} >
            <GithubFeedPivot github={this.github} />
          </PivotItem>
        </Pivot>
      </div>
    );
  };

  private signOut = () => {
    this.setState({
      isLoggedIn: false,
      isLoggingIn: false
    });
  };

  private renderSpinner(): JSX.Element {
    return <Spinner size={SpinnerSize.medium} />;
  }

  private renderSignInButton = (): JSX.Element => {
    return (
      <PrimaryButton
        text={GithubConstants.LoginButtonText}
        onClick={this.signIn}
      />
    );
  };

  private signIn = () => {
    this.setState({
      isLoggingIn: true,
      isLoggedIn: false
    });
    const w = 800;
    const h = 600;
    const top = screen.height - h / 2;
    const left = screen.width - w / 2;
    this.loginPopup = window.open(
      GithubConstants.Login,
      "",
      "location=0,status=0,width=" +
        w +
        ",height=" +
        h +
        "600,top=" +
        top +
        ",left=" +
        left
    );
    this.checkIfLoggedIn();
  };

  private checkIfLoggedIn = () => {
    this.github.isLoggedIn((xhr: XMLHttpRequest) => {
      if (xhr.responseURL.indexOf("login") > -1) {
        this.notLoggedIn();
      } else {
        this.loginPopup && this.loginPopup.close();
        this.setState({
          isLoggedIn: true,
          isLoggingIn: false
        });
      }
    }, this.notLoggedIn);
  };

  private notLoggedIn = (xhr?: XMLHttpRequest) => {
    if (this.loginPopup && !this.loginPopup.closed) {
      var that = this;
      setTimeout(function() {
        that.checkIfLoggedIn();
      }, 100);
    } else {
      this.setState({
        isLoggingIn: false,
        isLoggedIn: false
      });
    }
  };
}
