/**
 * Reference:
 * https://github.com/frontend-collective/react-sortable-tree/blob/master/stories/external-node.js
 */
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";
import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { selectedCities } from "./cities";

export const externalNodeType = "ExternalNode";
export const availableNodes = {};

selectedCities.forEach((race) => {
  availableNodes[race] = {
    dropped: false,
    editable: false,
    leaf: true,
    expanded: true,
  };
});

const externalNodeSpec = {
  beginDrag: (props, monitor, component) => ({ node: { ...props.node } }),
  canDrag: (props, monitor) => {
    const { node } = props;

    return !availableNodes[node.title].dropped;
  },
  endDrag: (props, monitor, component) => {
    if (!monitor.didDrop()) return;

    const { node } = props;

    availableNodes[node.title].dropped = true;
  },
};
const externalNodeCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  didDrop: monitor.didDrop(),
});

class externalNodeBaseComponent extends Component {
  render() {
    const { connectDragSource, isDragging, node } = this.props;

    const isDisabled =
      (availableNodes[node.title] && availableNodes[node.title].dropped) ||
      isDragging;

    return connectDragSource(
      <span>
        <Button disabled={isDisabled} primary={!isDisabled}>
          {node.title}
        </Button>
      </span>,

      { dropEffect: "copy" }
    );
  }
}

externalNodeBaseComponent.propTypes = {
  node: PropTypes.shape({ title: PropTypes.string }).isRequired,
  connectDragSource: PropTypes.func.isRequired,
};

const ExternalNode = DragSource(
  externalNodeType,
  externalNodeSpec,
  externalNodeCollect
)(externalNodeBaseComponent);

export class ExternalNodeContainer extends Component {
  render() {
    return (
      <div style={{ lineHeight: 3 }}>
        {Object.keys(availableNodes).map((node) => (
          <ExternalNode node={{ title: node, ...availableNodes[node] }} />
        ))}
      </div>
    );
  }
}
