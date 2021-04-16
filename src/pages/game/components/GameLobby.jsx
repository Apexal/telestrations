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

  const playerTags = Object.keys(players).map(key => (
    <PlayerTag key={key} isHost={hostPlayerClientId === key} displayName={players[key].displayName} />
  ))

  const hostButton = playerCount < 3
    ? <button className='button' disabled>Need More Players</button>
    : <button className='button' onClick={onStartGame}>Start Game</button>

  const lobbyLink = window.location.protocol + '//' + window.location.host + window.location.pathname
  const lobbyLinkDisplay = window.location.host + window.location.pathname

  return (
    <div className='game-lobby'>
      <h5 className='center'>Join at <a href={lobbyLink}>{lobbyLinkDisplay}</a></h5>
      <h1 className='title'>Code: {roomId}</h1>
      <h5>{playerCount} / {maxPlayers} players</h5>

      <ul>
        {playerTags}
      </ul>

      {isHost && hostButton}
      <button className='button' onClick={onChangeName}>Change Name</button>
    </div>
  )
}
