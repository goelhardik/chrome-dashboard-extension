import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { WidgetGroup, Choice } from './WidgetGroup';
import "./CustomizingPanel.css"

export interface ICustomizingPanelProps {
    choices: { [key: string]: Choice }
    onDismissPanel: (choices: { [key: string]: Choice }) => void
}

export interface ICustomizingPanelState {
    showPanel: boolean;
    choices: { [key: string]: Choice }
}

export class CustomizingPanel extends React.Component<ICustomizingPanelProps, ICustomizingPanelState> {

    constructor(props: ICustomizingPanelProps) {
        super(props);
        this.state = {
            showPanel: false,
            choices: props.choices
        };
    }

    public render(): JSX.Element {
        return (
            <div className="header-parent">
                <p className="header-title">Dashboard</p>
                <div className="header-right">
                    <PrimaryButton text="Configure" onClick={this._showPanel} />
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