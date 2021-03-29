import React, { Component } from 'react'

export default class HiddenPanel extends Component {
  render () {
    if (!this.props.visible) return <></>

    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
