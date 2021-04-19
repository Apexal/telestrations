import { Component } from 'react'
import CanvasDisplay from './CanvasDisplay'
import SketchPadRenderer from './SketchPad/SketchPadRenderer'

export default class GameRound extends Component {
  constructor (props) {
    super(props)

    this.handlePreviousDrawingGuessFormSubmit = this.handlePreviousDrawingGuessFormSubmit.bind(this)
  }

  handlePreviousDrawingGuessFormSubmit (event) {
    event.preventDefault()
    this.props.onPreviousDrawingGuessUpdate(event.currentTarget.guess.value.trim())
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
        <div className='center'>
          <h1>Draw - Round {this.props.roundIndex}</h1>
          <span>
            You guessed <strong className='fancy'>{this.props.previousDrawingGuess}</strong>. 
            Now draw your own sketch of it!
          </span>

          <p>{this.props.roundTimerSecondsRemaining}s remaining</p>
          {sketchPad}
        </div>
      )
    } else {
      const currentPlayerIndex = this.props.playerKeys.findIndex(key => key === this.props.sessionId)
      const previousPlayerIndex = (currentPlayerIndex + 1) % this.props.playerKeys.length
      const previousPlayerKey = this.props.playerKeys[previousPlayerIndex]
      const previousPlayer = this.props.players[previousPlayerKey]
      const previousDrawingStrokes = this.props.players[previousPlayerKey].submissions.find(sub => sub.roundIndex === this.props.roundIndex - 1).drawingStrokes

      return (
        <div className='center'>
          <h1>Guess - Round {this.props.roundIndex}</h1>
          <p>{this.props.roundTimerSecondsRemaining}s remaining</p>
          <div>
            <b>{previousPlayer.displayName} just drew this... masterpiece.</b>
            <br />
            <CanvasDisplay drawingStrokes={previousDrawingStrokes} />
          </div>
          <form onSubmit={this.handlePreviousDrawingGuessFormSubmit}>
            <span>Guess what it is below!</span>
            <div>
              <input className='center' type='text' placeholder='What is this a drawing of?' name='guess' required />
            </div>
          </form>
        </div>
      )
    }
  }
}
