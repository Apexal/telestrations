import React, { Component } from 'react'
import SketchPadRenderer from './SketchPadRenderer'

/**
 * Base class for the SketchPad object. Encompasses the view, controls, secret word, etc.
 */

export default class SketchPad extends Component {
  render () {
    const { secretWord } = this.props

    return (
      <div className='center'>
        <h4>Your secret word is...</h4>
        <h1>{secretWord}</h1>
        <SketchPadRenderer />
      </div>
    )
  }
}
