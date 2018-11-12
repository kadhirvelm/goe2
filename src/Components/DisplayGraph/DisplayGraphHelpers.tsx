import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button } from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { RemoveAllHighlights } from "../../State/WebsiteActions";
import { IUser } from "../../Types/Users";
import { Autocomplete } from "../Common/Autocomplete";
import { zoomByScale } from "./DisplayGraphUtils";

import { GraphIcon } from "../../icons/graphIcon";
import "./DisplayGraphHelpers.scss";

export interface IDisplayGraphHelpersProps {
  zoomToNode(node: IUser): void;
}

export interface IDisplayGraphHelpersDispatchProps {
  removeAllHighlights(): void;
}

export interface IDisplayGraphHelpersStoreProps {
  graphLabel: string;
  userMap: Map<string, IUser> | undefined;
}

class PureDisplayGraphHelpers extends React.PureComponent<
  IDisplayGraphHelpersProps &
    IDisplayGraphHelpersDispatchProps &
    IDisplayGraphHelpersStoreProps
> {
  public render() {
    return (
      <div className="graph-helpers">
        <Autocomplete
          className="find-user-autocomplete"
          dataSource={this.props.userMap}
          displayKey="name"
          placeholderText="Search for user…"
          onSelection={this.props.zoomToNode}
        />
        <div className="graph-helpers-bottom-container">
          <div
            className={classNames("graph-label", "show-change")}
            key={this.props.graphLabel}
          >
            <GraphIcon
              attributes={{
                height: 15,
                style: {
                  fill: "white",
                  marginRight: "5px",
                  minHeight: 15,
                  minWidth: 15,
                  stroke: "white"
                },
                width: 15
              }}
            />
            {this.props.graphLabel}
          </div>
          <div className="graph-assistant-buttons">
            <Button
              title="Zoom in"
              icon="zoom-in"
              onClick={this.handleZoomIn}
            />
            <Button
              title="Zoom out"
              icon="zoom-out"
              onClick={this.handleZoomOut}
            />
            <Button
              title="Remove highlights"
              icon="delete"
              onClick={this.removeAllHighlights}
            />
          </div>
        </div>
      </div>
    );
  }

  private handleZoomIn = () => zoomByScale(1.25);
  private handleZoomOut = () => zoomByScale(0.75);

  private removeAllHighlights = () => this.props.removeAllHighlights();
}

function mapStoreToProps(state: IStoreState): IDisplayGraphHelpersStoreProps {
  return {
    graphLabel: state.WebsiteReducer.graphType.id,
    userMap: state.DatabaseReducer.userData
  };
}

function mapDispatchToProps(
  dispatch: Dispatch
): IDisplayGraphHelpersDispatchProps {
  return bindActionCreators(
    {
      removeAllHighlights: RemoveAllHighlights.create
    },
    dispatch
  );
}

export const DisplayGraphHelpers = connect(
  mapStoreToProps,
  mapDispatchToProps
)(PureDisplayGraphHelpers);
