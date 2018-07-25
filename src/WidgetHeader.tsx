import * as React from 'react';
import './WidgetHeader.css';

export interface IWidgetHeaderProps {
    backgroundColor?: string;
    icon?: JSX.Element;
    title?: string;
    href: string;
}

export class WidgetHeader extends React.Component<IWidgetHeaderProps, {}> {
    constructor(props: IWidgetHeaderProps) {
        super(props);
    }

    public render(){
        return(
            <div className="header" style={{ backgroundColor: `${this.props.backgroundColor}`}} >
                <a className="icon" href={this.props.href} target="_blank">{this.props.icon && this.props.icon} </a>
            </div>
        );
    }


}
