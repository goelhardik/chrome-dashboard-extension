import * as React from 'react';
// import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import './WidgetGroup.css';

/**
 * Interface for ChoiceGroupImageExample state.
 */
export interface IWidgetGroupProps {
  choices: { [key: string]: Choice }
  onChoicesChanged: (choices: {[key: string] : Choice}) => void
}

export interface IWidgetGroupState {
  choiceKeys: string[],
  choices: { [key: string]: Choice }
}

export class Choice {
  name: string;
  key: string;
  img: string;
  selected: boolean;
}

export class WidgetGroup extends React.Component<IWidgetGroupProps, IWidgetGroupState> {
  constructor(props: IWidgetGroupProps) {
    super(props);

    const choiceKeys = ["github", "hackernews", "vsts"];
    this.state = {
      choiceKeys: choiceKeys,
      choices: props.choices
    }
  }

  public render(): JSX.Element {

    return (
      <div className="choice-group">
        {this.renderChoices()}
      </div>
    );
  }

  private renderChoices = (): JSX.Element[] => {
    let elements = new Array();
    this.state.choiceKeys.forEach((choiceKey: string) => {
      const choiceDetail = this.state.choices[choiceKey];
      let classes = "choice-box";
      if (choiceDetail.selected) {
        classes += " choice-box-selected";
      }
      elements.push(
        <div id={"choice-box-wrap-" + choiceDetail.key}>
          <div className={classes} onClick={this.onChoiceClick} id={choiceDetail.key}>
            {/* <div className="checkbox" id={choiceDetail.key} >
            <Checkbox checked={choiceDetail.selected} onChange={this.onChoiceClick} id={choiceDetail.key} />
          </div> */}
            <div className="choice-box-content" id={choiceDetail.key} >
              <img src={choiceDetail.img} height="32" width="32" id={choiceDetail.key} />
            </div>
            <span className="choice-box-content" id={choiceDetail.key}>{choiceDetail.name}</span>
          </div>
        </div>
      );
    });
    return elements;
  }

  private onChoiceClick = (e: any) => {
    var element = document.getElementById("choice-box-wrap-" + e.target.id);
    (element.firstChild as HTMLElement).classList.toggle("choice-box-selected");

    let choices = this.state.choices;
    choices[e.target.id].selected = !choices[e.target.id].selected;
    this.setState({
      choices: choices
    });
    this.props.onChoicesChanged(choices);
  }
}