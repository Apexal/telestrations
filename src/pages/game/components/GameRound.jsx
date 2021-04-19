import { Component } from 'react'
import SketchPadRenderer from './SketchPad/SketchPadRenderer'

export default class GameRound extends Component {
  constructor (props) {
    super(props)

    this.handlePreviousDrawingGuessFormSubmit = this.handlePreviousDrawingGuessFormSubmit.bind(this)
  }

  handlePreviousDrawingGuessFormSubmit (event) {
    event.preventDefault()
    this.props.onPreviousDrawingGuessUpdate(event.currentTarget.guess.value)
  }

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
    } else if (this.props.isDrawingStage) {
      return (
        <div>
          <h1>Draw</h1>
          You guessed <strong>{this.props.previousDrawingGuess}</strong>
          Now draw your own sketch of it!

          <p>{this.props.roundTimerSecondsRemaining}s remaining</p>
          {sketchPad}
        </div>
      )
    } else {
      return (
        <div>
          <h1>Guess</h1>
          <p>{this.props.roundTimerSecondsRemaining}s remaining</p>
          <div>
            drawing will go here
          </div>
          <form onSubmit={this.handlePreviousDrawingGuessFormSubmit}>
            <input type='text' placeholder='What is this a drawing of?' name='guess' required />
          </form>
        </div>
      )
    }
  }
}
