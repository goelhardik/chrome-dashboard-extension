import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { WidgetGroup, Choice } from './WidgetGroup';
import "./CustomizingPanel.css"
import { Callout } from 'office-ui-fabric-react/lib/Callout';

export interface ICustomizingPanelProps {
    choices: { [key: string]: Choice };
    onDismissPanel: (choices: { [key: string]: Choice }) => void;
}

export interface ICustomizingPanelState {
    showPanel: boolean;
    choices: { [key: string]: Choice };
    isCalloutVisible: boolean;
    reRender: boolean;
}

export class CustomizingPanel extends React.Component<ICustomizingPanelProps, ICustomizingPanelState> {

    private configureButtonElement: HTMLElement;
    private isCalloutVisibleKey: string = "chrome-agg-callout";

    constructor(props: ICustomizingPanelProps) {
        super(props);
        this.state = {
            showPanel: false,
            choices: props.choices,
            isCalloutVisible: localStorage[this.isCalloutVisibleKey] === "true" ? true : false,
            reRender: true
        };
    }

    public componentDidMount() {
        if (this.state.reRender) {
            this.setState({
                reRender: false
            });
        }
    }

    public componentDidUpdate() {
        // update class list
        var configureButton = document.getElementById("header-right");
        var body = document.getElementsByTagName("body")[0];
        if (localStorage[this.isCalloutVisibleKey] === "true") {
            (configureButton as HTMLElement).classList.add("highlight-button");
            (body as HTMLElement).classList.add("fade-body");
        } else {
            (configureButton as HTMLElement).classList.remove("highlight-button");
            (body as HTMLElement).classList.remove("fade-body");
        }
    }

    public render(): JSX.Element {
        const isCalloutVisible = localStorage[this.isCalloutVisibleKey] === "true" ? true : false;
        return (
            <div className="header-parent">
                <p className="header-title">Dashboard</p>
                <div className="header-right" id="header-right">
                    <div ref={menuButton => (this.configureButtonElement = menuButton!)}><PrimaryButton text="Configure" onClick={this._showPanel} id="configure-button" /></div>
                    <Callout
                        className="ms-Callout-callout"
                        role={'alertdialog'}
                        gapSpace={0}
                        target={this.configureButtonElement}
                        onDismiss={this.onCalloutDismiss}
                        setInitialFocus={true}
                        hidden={!isCalloutVisible}
                    >
                        <p className="ms-CalloutExample-subText" id={'callout-description-1'}>
                            Use this button to configure some widgets.
                        </p>
                    </Callout>

                    <Panel
                        type={PanelType.custom}
                        isOpen={this.state.showPanel}
                        isLightDismiss={true}
                        headerText="Select widgets for your dashboard"
                        onDismiss={this._hidePanel}
                        customWidth={"40%"}
                    >
                        <WidgetGroup
                            choices={this.state.choices}
                            onChoicesChanged={this.onChoicesChanged} />
                    </Panel>
                </div>
            </div>
        );
    }

    private onCalloutDismiss = () => {
        localStorage[this.isCalloutVisibleKey] = false;
        this.setState({
            isCalloutVisible: false
        });
    }

    private onChoicesChanged = (choices: { [key: string]: Choice }) => {
        this.setState({
            choices: choices
        });
    }

    private _showPanel = (): void => {
        this.setState({ showPanel: true });
    };

    private _hidePanel = (): void => {
        this.setState({ showPanel: false });
        this.props.onDismissPanel(this.state.choices);
    };
}