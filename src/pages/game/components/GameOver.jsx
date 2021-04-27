import { Link } from 'react-router-dom'
import CanvasDisplay from './CanvasDisplay'

export default function GameOver (props) {
  const renderPlayerDrawingChain = (sessionId, player) => {
    const divs = []
    const playerIndex = props.playerKeys.findIndex(p => p === sessionId)
    for (let roundIndex = 1; roundIndex <= props.playerKeys.length + (props.playerKeys.length % 2); roundIndex++) {
      let i = playerIndex - roundIndex + 1
      if (i < 0) {
        i = props.playerKeys.length - Math.abs(i)
      }

      const player = props.players[props.playerKeys[i]]
      const submission = player.submissions.find(sub => sub.roundIndex === roundIndex)
      divs.push(
        <div className='submission' key={playerIndex + '-' + roundIndex}>
          {roundIndex === 1
            ? <p>And they first drew...</p>
            : <p>Then, <strong>{player.displayName}</strong> guessed and drew...</p>}
          <CanvasDisplay
            drawingStrokes={submission.drawingStrokes}
          />
          <h2 className='title label'>{submission.previousDrawingGuess}</h2>
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
        <div className='drawing-chain' key={key}>
          <details>
            <summary><strong>{player.displayName}</strong>'s secret word was <span className='title'>{player.secretWord}</span></summary>
            {renderPlayerDrawingChain(key, player)}
          </details>
        </div>
      ))}

      <Link className='button' to='/'>Home</Link>
    </div>
  )
}
