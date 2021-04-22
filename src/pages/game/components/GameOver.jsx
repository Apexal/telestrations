import { Link } from 'react-router-dom'
import CanvasDisplay from './CanvasDisplay'

export default function GameOver (props) {
  const renderPlayerDrawingChain = (sessionId, player) => {
    const divs = []
    const playerIndex = props.playerKeys.findIndex(p => p === sessionId)
    console.log(playerIndex, props.playerKeys)
    for (let roundIndex = 1; roundIndex <= props.playerKeys.length + (props.playerKeys.length % 2); roundIndex++) {
      const player = props.players[props.playerKeys[(playerIndex + roundIndex) % props.playerKeys.length]]
      const submission = player.submissions.find(sub => sub.roundIndex === roundIndex)
      divs.push(
        <div key={playerIndex + '-' + roundIndex}>
          <p>{player.displayName} guessed {submission.previousDrawingGuess}</p>
          <p>{player.displayName} drew:</p>
          <CanvasDisplay
            drawingStrokes={submission.drawingStrokes}
          />
        </div>
      )
    }
    return <div>{divs}</div>
  }

  return (
    <div className='game-lobby'>
      <h1 className='title room-code-anim'>Game Over</h1>
      <h3 className='fancy center'>Check out the crazy drawing chains!</h3>

      {Object.entries(props.players).map(([key, player]) => (
        <div key={key}>
          <details>
            <summary><strong>{player.displayName}</strong>: <span className='fancy'>{player.secretWord}</span></summary>
            {renderPlayerDrawingChain(key, player)}
          </details>
        </div>
      ))}

      <Link className='button' to='/'>Home</Link>
    </div>
  )
}
