import React, { Component } from "react";
import ReactJson from "react-json-view";
import SortableTree, {
  changeNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath,
} from "react-sortable-tree";
import { Button, Tab } from "semantic-ui-react";
import { externalNodeType } from "./ExternalNode";

export default class SortTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentNode: {},
      treeData: [
        {
          title: "Root Group",
          editable: false,
          childable: true,
          deletable: false,
          expanded: true,
          children: [
            {
              title: "",
              editable: true,
              childable: true,
              deletable: true,
              expanded: true,
              children: [],
            },
          ],
        },
      ],
    };
  }
  

  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  removeNode = (path) => {
    this.setState((state) => ({
      treeData: removeNodeAtPath({
        treeData: state.treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
      }),
    }));
  };

  selectThis = (node, path) => {
    this.setState({ currentNode: node, path: path });
  };

  insertNewNode = (path) => {
    this.setState((state) => ({
      treeData: addNodeUnderParent({
        treeData: state.treeData,
        parentKey: path[path.length - 1],
        expandParent: true,
        newNode: {
          title: "",
          editable: true,
          childable: true,
          deletable: true,
          children: [],
        },
        getNodeKey: ({ treeIndex }) => treeIndex,
      }).treeData,
    }));
  };

  canDrop = ({ node, nextParent, prevPath, nextPath }) => {
    // Prevent another root node from forming
    if (nextParent === null) return false;

    // Prevent leaf nodes from having leaf parents
    if (nextParent && nextParent.leaf === true) return false;

    return true;
  };

  render() {
    const { treeData } = this.state;
    const getNodeKey = ({ treeIndex }) => treeIndex;

    return (
      <Tab
        panes={[
          {
            menuItem: "Tree View",
            render: () => (
              <Tab.Pane>
                <div style={{ height: "60vh" }}>
                  <SortableTree
                    onChange={this.updateTreeData}
                    expa
                    treeData={treeData}
                    dndType={externalNodeType}
                    canDrop={this.canDrop}
                    onChange={(treeData) => this.setState({ treeData })}
                    generateNodeProps={({ node, path }) => ({
                      title: (
                        <form
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.selectThis(node, path);
                          }}
                        >
                          {node.editable === true ||
                          node.editable === undefined ? (
                            <input
                              style={{ fontSize: "1rem", width: 200 }}
                              value={node.title}
                              onChange={(event) => {
                                const title = event.target.value;
                                this.setState((state) => ({
                                  treeData: changeNodeAtPath({
                                    treeData: state.treeData,
                                    path,
                                    getNodeKey,
                                    newNode: { ...node, title },
                                  }),
                                }));
                              }}
                            />
                          ) : (
                            <span>{node.title}</span>
                          )}
                          &nbsp;&nbsp;&nbsp;
                          {node.childable ? (
                            <span>
                              <Button
                                size="mini"
                                color="blue"
                                circular
                                icon="add"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  this.insertNewNode(path);
                                }}
                              />
                              {node.deletable &&
                              node.children &&
                              !node.children.length ? (
                                <Button
                                  size="mini"
                                  color="blue"
                                  circular
                                  icon="trash"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    this.removeNode(path);
                                  }}
                                />
                              ) : undefined}
                            </span>
                          ) : undefined}
                        </form>
                      ),
                    })}
                  />
                </div>
              </Tab.Pane>
            ),
          },
          {
            menuItem: "JSON",
            render: () => (
              <Tab.Pane>
                <ReactJson src={this.state.treeData} />
              </Tab.Pane>
            ),
          },
        ]}
      />
    );
  }
}
