import * as React from "react";
import { GithubClient } from "src/Clients/GithubClient";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import "src/Widgets/Github/GithubDiscoverPivot.css";

export interface IGithubDiscoverPivotProps {
  github: GithubClient;
}

export interface IGithubDiscoverPivotState {
  feed: string;
  isLoadingFeed: boolean;
}

export class GithubDiscoverPivot extends React.Component<
  IGithubDiscoverPivotProps,
  IGithubDiscoverPivotState
> {
  private chromeGithubFeedKey: string = "chrome-agg-github-feed";

  constructor(props: IGithubDiscoverPivotProps) {
    super(props);

    this.state = {
      isLoadingFeed: true,
      feed: null
    };
    this.discoverRepositories();
  }

  public render() {
    let content;
    if (this.state.isLoadingFeed) {
      content = this.renderSpinner();
    } else {
      content = (
        <div>
          <div dangerouslySetInnerHTML={{ __html: this.state.feed }} />
          {/* {this.state.feed} */}
        </div>
      );
    }
    return content;
  }

  private discoverRepositories = () => {
    this.props.github.discoverRepositories(
      (xhr: XMLHttpRequest) => {
        this.onFeedGot(xhr.responseText);
      },
      (xhr: XMLHttpRequest) => {
        this.setState({
          isLoadingFeed: true
        });
        var that = this;
        setTimeout(function() {
          that.discoverRepositories();
        }, 100);
      }
    );
  };

  private renderSpinner(): JSX.Element {
    return <Spinner size={SpinnerSize.medium} />;
  }

  private onFeedGot = (response: string) => {
    const manipulatedResponse = this.manipulateDom(response);
    // this.setLocalFeed(response);
    this.setState({
      feed: manipulatedResponse,
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

    // add target blank to all links
    const links = doc.getElementsByTagName("a");
    for (let link of Array.from(links)) {
      link.setAttribute("target", "_blank");
    }

    // take only the main portion; remove header and footer
    const mainData = doc.getElementsByClassName("application-main").item(0);

    return mainData.innerHTML;
  };
}
