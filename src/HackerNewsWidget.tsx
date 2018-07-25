import * as React from 'react';
import { Feed, Item } from './Clients/IClient';
import './App.css';
import { HackernewsClient } from './Clients/HackernewsClient';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { List } from 'office-ui-fabric-react/lib/List';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import './HackerNewsWidget.css';
import { WidgetHeader } from './WidgetHeader';
//import "@{fa_path}/icons.less";
//import "node_modules/font-awesome/less/font-awesome.less"

export interface IHackerNewsWidgetProps {
    dragWidget: (element: any) => void
}

export interface IHackerNewsWidgetState {
    feed: Item[];
    isLoadingFeed: boolean;
}


export class HackerNewsWidget extends React.Component<IHackerNewsWidgetProps, IHackerNewsWidgetState> {
    private hackerNews: HackernewsClient;

    constructor(props: IHackerNewsWidgetProps) {
        super(props);
        this.hackerNews = new HackernewsClient();
        this.state = {
            feed: new Array<Item>(),
            isLoadingFeed: false
        };
    }

    public componentDidMount() {
        const widget = document.getElementById("hackernews-widget");
        this.props.dragWidget(widget);
    }

    public render() {
        let content: JSX.Element;

        if (this.state.feed.length == 0 && !this.state.isLoadingFeed) {
            content = this.renderShowHackerNewsButton();
        } else if (this.state.isLoadingFeed) {
            content = this.renderSpinner();
        } else {
            content =
                <List
                    className="hackerHeadline"
                    items={this.state.feed}
                    onRenderCell={this.onRenderCell} />
        }

        return (
            <div className="widget" id="hackernews-widget">
                {/* <div className="parent" id="hackernews-widget-header"> */}
                    <WidgetHeader
                        id="hackernews-widget"
                        backgroundColor={"#F46523"}
                        href={"https://news.ycombinator.com/"}
                        icon={<i className="fa fa-hacker-news fa-3x" aria-hidden="true"></i>} />
                    {content}
                {/* </div> */}
            </div>
        );
    }

    private renderShowHackerNewsButton = (): JSX.Element => {
        return (
            <PrimaryButton
                text="test"
                onClick={this.getHackerNews} />

        );
    }

    private renderSpinner = (): JSX.Element => {
        return (
            <Spinner
                size={SpinnerSize.medium} />
        )
    }

    private onRenderCell = (item: Item, index: number | undefined): JSX.Element => {
        return (
            <div className="item-cell" data-is-focusable={true}>
                <a href={item.url} target="_blank">
                    <p>{item.title}</p>
                </a>
            </div>
        );
    }

    private getHackerNews = () => {
        this.setState({
            isLoadingFeed: true
        });
        this.hackerNews.getFeed(this.loadFeed);
    }

    private loadFeed = (response: Feed) => {
        this.setState({
            feed: response.items,
            isLoadingFeed: false
        });
        //console.log(response);
    }
}
