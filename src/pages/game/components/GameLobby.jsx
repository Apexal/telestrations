import PlayerTag from './PlayerTag'

export default function GameLobby ({
  roomId,
  sessionId,
  hostPlayerClientId,
  players,
  maxPlayers,
  onChangeName,
  onStartGame
}) {
  const isHost = hostPlayerClientId === sessionId

  const playerCount = Object.keys(players).length

  const playerTags = Object.keys(players).map(playerSessionId => (
    <PlayerTag
      key={playerSessionId}
      isPlayer={playerSessionId === sessionId}
      isHost={hostPlayerClientId === playerSessionId}
      displayName={players[playerSessionId].displayName}
    />
  ))

  const hostButton = playerCount < 3
    ? <button className='button' disabled>Need More Players</button>
    : <button className='button' onClick={onStartGame}>Start Game</button>

  return (
    <div className='game-lobby'>
      <div className="supertext center">your room code is...</div>
      <h1 className='title room-code-anim'>{roomId}</h1>

      <h5>{playerCount} / {maxPlayers} players</h5>

      <ul>
        {playerTags}
      </ul>

      {isHost && hostButton}
      {players[sessionId] &&
        <button className='button u-pull-right' onClick={onChangeName}>Change Name</button>}
    </div>
  )
}
