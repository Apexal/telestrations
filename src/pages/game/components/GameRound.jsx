import { Component } from 'react'
import SketchPadRenderer from './SketchPad/SketchPadRenderer'

export default class GameRound extends Component {
  constructor (props) {
    super(props)

    this.state = {
      previousDrawingGuess: '',
      drawingStrokes: []
    }
  }

  render () {
    if (this.props.roundIndex === 1) {
      return (
        <div className='center'>
          <h4>Your word to draw is...</h4>
          <h1>{this.props.secretWord}</h1>
          <p>{this.props.drawingSecondsRemaining} seconds left</p>
          <SketchPadRenderer />
        </div>
      )
    }

    return (
      <div>
        todo
      </div>
    )
  }
}
