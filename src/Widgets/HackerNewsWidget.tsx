import * as React from 'react';
import 'src/App.css';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { List } from 'office-ui-fabric-react/lib/List';
import 'src/Widgets/HackerNewsWidget.css';
import { WidgetHeader } from 'src/Widgets/WidgetHeader';
import { Item, Feed } from 'src/Clients/IClient';
import { HackernewsClient } from 'src/Clients/HackernewsClient';

export interface IHackerNewsWidgetProps {
    dragWidget: (element: any) => void
}

export interface IHackerNewsWidgetState {
    feed: Item[];
    isLoadingFeed: boolean;
}


export class HackerNewsWidget extends React.Component<IHackerNewsWidgetProps, IHackerNewsWidgetState> {
    private hackerNews: HackernewsClient;
    private elementTopPosKey: string = "chrome-agg-drag-and-drop-top-";
    private elementLeftPosKey: string = "chrome-agg-drag-and-drop-left-";

    constructor(props: IHackerNewsWidgetProps) {
        super(props);
        this.hackerNews = new HackernewsClient();
        this.state = {
            feed: new Array<Item>(),
            isLoadingFeed: true
        };
    }

    public componentDidMount() {
        const id = "hackernews-widget";
        const widget = document.getElementById(id);
        this.props.dragWidget(widget);
        if (localStorage[this.elementTopPosKey + id]) {
            widget.style.top = localStorage[this.elementTopPosKey + id];
            widget.style.left = localStorage[this.elementLeftPosKey + id];
        }
    }

    public render() {
        let content: JSX.Element;

        if (this.state.isLoadingFeed) {
            this.getHackerNews();
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

    // private renderShowHackerNewsButton = (): JSX.Element => {
    //     return (
    //         <PrimaryButton
    //             text="test"
    //             onClick={this.getHackerNews} />

    //     );
    // }

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
        this.hackerNews.getFeed(this.loadFeed);
    }

    private loadFeed = (response: Feed) => {
        this.setState({
            feed: response.items,
            isLoadingFeed: false
        });
        console.log(response);
        console.log(this.state.isLoadingFeed);
    }
}
