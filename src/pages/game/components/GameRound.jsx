import { Component } from 'react'
import SketchPadRenderer from './SketchPad/SketchPadRenderer'

export default class GameRound extends Component {
  render () {
    const sketchPad = (
      <SketchPadRenderer
        drawingStrokes={this.props.drawingStrokes}
        onDrawingStrokesUpdate={this.props.onDrawingStrokesUpdate}
        onSubmit={this.props.onSubmit}
      />
    )

    if (this.props.roundIndex === 1) {
      return (
        <div className='center'>
          <h4>Your word to draw is...</h4>
          <h1>{this.props.secretWord}</h1>
          <p>{this.props.roundTimerSecondsRemaining}s left</p>
          {sketchPad}
        </div>
      )
    } else if (this.props.stage === 'guess') {
      return (
        <div>
          <div>
            drawing will go here
          </div>
          <form>
            <input type='text' required />
          </form>
        </div>
      )
    } else if (this.props.stage === 'draw') {
      return (
        <div>
          You guessed <strong>{this.state.previousDrawingGuess}</strong>
          Now draw your own sketch of it!

          <p>{this.props.roundTimerSecondsRemaining}s remaining</p>
          {sketchPad}
        </div>
      )
    }
  }
}
