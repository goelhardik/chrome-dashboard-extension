import * as React from "react";
import { GithubClient } from "src/Clients/GithubClient";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

export interface IGithubFeedPivotProps {
  github: GithubClient;
}

export interface IGithubFeedPivotState {
  feed: string;
  isLoadingFeed: boolean;
}

export class GithubFeedPivot extends React.Component<
  IGithubFeedPivotProps,
  IGithubFeedPivotState
> {
  private chromeGithubFeedKey: string = "chrome-agg-github-feed";

  constructor(props: IGithubFeedPivotProps) {
    super(props);

    this.state = {
      isLoadingFeed: true,
      feed: ""
    };
    this.fetchFeed();
  }

  public render() {
    let content;
    if (this.state.isLoadingFeed) {
      content = this.renderSpinner();
    } else {
      content = (
        <div>
          <div dangerouslySetInnerHTML={{ __html: this.state.feed }} />
        </div>
      );
    }
    return content;
  }

  private fetchFeed = () => {
    this.props.github.getFeed(
      (xhr: XMLHttpRequest) => {
        this.onFeedGot(xhr.responseText);
      },
      (xhr: XMLHttpRequest) => {
        this.setState({
          isLoadingFeed: true
        });
        var that = this;
        setTimeout(function() {
          that.fetchFeed();
        }, 100);
      }
    );
  };

  private renderSpinner(): JSX.Element {
    return <Spinner size={SpinnerSize.medium} />;
  }

  private onFeedGot = (response: string) => {
    response = this.manipulateDom(response);
    this.setLocalFeed(response);
    this.setState({
      feed: response,
      isLoadingFeed: false
    });
  };

  private setLocalFeed(feed: any) {
    localStorage[this.chromeGithubFeedKey] = feed;
  }

  private manipulateDom = (dom: string): string => {
    let re = /href="/gi;
    dom = dom.replace(re, 'href="https://github.com');

    let doc = document.createElement("html");
    doc.innerHTML = dom;
    // remove forms (star and unstar actions) // TODO add later and call github apis
    const forms = doc.getElementsByTagName("form");
    for (let form of Array.from(forms)) {
      form.remove();
    }

    // remove expand-collapse buttons
    const buttons = doc.getElementsByTagName("button");
    for (let button of Array.from(buttons)) {
      button.remove();
    }

    // add target blank to all links
    const links = doc.getElementsByTagName("a");
    for (let link of Array.from(links)) {
      link.setAttribute("target", "_blank");
    }

    return doc.innerHTML;
  };
}
