import { Link } from 'react-router-dom'
import config from '../../../config'

import PlayerTag from './PlayerTag'

export default function GameLobby ({
  roomId,
  sessionId,
  hostPlayerSessionId,
  players,
  maxPlayers,
  onChangeName,
  onStartGame
}) {
  const isHost = hostPlayerSessionId === sessionId

  const playerCount = Object.keys(players).length

  const playerTags = Object.keys(players).map((playerSessionId) => (
    <PlayerTag
      key={playerSessionId}
      isPlayer={playerSessionId === sessionId}
      isHost={hostPlayerSessionId === playerSessionId}
      displayName={players[playerSessionId].displayName}
    />
  ))

  const hostButton = playerCount < config.minPlayers
    ? <button className='button' disabled>Waiting For Players</button>
    : <button className='button' onClick={onStartGame}>Start Game</button>

  return (
    <div className='game-lobby'>
      <div className='supertext center'>your room code is...</div>
      <h1 className='title room-code-anim'>{roomId}</h1>

      <h5>{playerCount} / {maxPlayers} players</h5>

      <ul>
        {playerTags}
      </ul>

      {isHost ? hostButton : <Link className='button' to='/'>Leave</Link>}
      {players[sessionId] &&
        <button className='button u-pull-right' onClick={onChangeName}>Change Name</button>}
    </div>
  )
}
