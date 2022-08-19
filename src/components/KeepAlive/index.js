import React, { Component, createContext } from 'react';

const { Provider, Consumer } = createContext();
const withScope = WrappedComponent => props => {
  return <Consumer>{keep => <WrappedComponent {...props} keep={keep} />}</Consumer>;
};


export class AliveScope extends Component {
  nodes = {};
  state = {};

  keep = (id, children) =>
    new Promise(resolve => {
      this.setState(
        {
          [id]: { id, children },
        },
        () => {
          resolve(this.nodes[id]);
        },
      );
    });

  render() {
    return (
      <Provider value={this.keep}>
        {this.props.children}
        {Object.values(this.state).map(({ id, children }) => (
          <div
            style={{ height: '100%' }}
            key={id}
            ref={node => {
              this.nodes[id] = node;
            }}
          >
            {children}
          </div>
        ))}
      </Provider>
    );
  }
}

@withScope
class KeepAlive extends Component {
  constructor(props) {
    super(props);
    this.init(props);
  }

  init = async ({ id, children, keep, contentId }) => {
    const realContent = await keep(id, children);
    this.placeholder.appendChild(realContent);

    const content = document.getElementById(contentId);
    const scrollTop = realContent.children[0].style.scrollMarginTop;
    if (content) {
      content.scrollTop = Number(scrollTop.replace('px', ''));
    }
  };

  render() {
    return (
      <div
        style={{ height: '100%' }}
        ref={node => {
          this.placeholder = node;
        }}
      />
    );
  }
}

export default KeepAlive;
