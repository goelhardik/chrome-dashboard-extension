import * as React from 'react';
import 'src/Widgets/WidgetHeader.css';

export interface IWidgetHeaderProps {
    backgroundColor?: string;
    icon?: JSX.Element;
    title?: string;
    href: string;
    id?: string;
}

export class WidgetHeader extends React.Component<IWidgetHeaderProps, {}> {
    constructor(props: IWidgetHeaderProps) {
        super(props);
    }

    public render(){
        return(
            <div id={"drag-and-drop-" + this.props.id} className="header" style={{ backgroundColor: `${this.props.backgroundColor}`}} >
                <a className="icon" href={this.props.href} target="_blank">{this.props.icon && this.props.icon} </a>
            </div>
        );
    }


}
