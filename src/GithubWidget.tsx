import * as React from 'react';
import './App.css';
// import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { List } from 'office-ui-fabric-react/lib/List';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
// import { GithubClient } from './Clients/GithubClient';
// import { Feed } from './Clients/IClient';

export interface IGithubWidgetProps {
  items: any;
}

export class GithubWidget extends React.Component<IGithubWidgetProps, any> {

  constructor(props: IGithubWidgetProps) {
    super(props);

    this.onRenderCell = this.onRenderCell.bind(this);
  }

  public render() {
    return (
      <List 
        items={this.props.items} 
        onRenderCell={this.onRenderCell} />
    );
  }

  private onRenderCell(item: any, index: number | undefined): JSX.Element {
    return (
      <div className="ms-ListBasicExample-itemCell" data-is-focusable={true}>
        <Image
          className="ms-ListBasicExample-itemImage"
          src={item.thumbnail}
          width={50}
          height={50}
          imageFit={ImageFit.cover}
        />
        <div className="ms-ListBasicExample-itemContent">
          <div className="ms-ListBasicExample-itemName">{item.name}</div>
          <div className="ms-ListBasicExample-itemIndex">{`Item ${index}`}</div>
          <div className="ms-ListBasicExample-itemDesc">{item.description}</div>
        </div>
      </div>
    );
  }
}
