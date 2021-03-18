import React, { Component } from 'react'

export default class HiddenPanel extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if(!this.props.visible) return <></>;
    
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
