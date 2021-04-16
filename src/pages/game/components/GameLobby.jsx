import PlayerTag from './PlayerTag'

export default function GameLobby ({ roomId, sessionId, hostPlayerClientId, players, maxPlayers, onChangeName }) {
  const isHost = hostPlayerClientId === sessionId

  const playerCount = Object.keys(players).length

  const playerTags = Object.keys(players).map(key => (
    <PlayerTag key={key} isHost={hostPlayerClientId === key} displayName={players[key].displayName} />
  ))

  return (
    <div className='game-lobby'>
      <h1 className='title'>{roomId}</h1>
      <h5>{playerCount} / {maxPlayers} players</h5>

      <ul>
        {playerTags}
      </ul>

      {isHost && <button className='button' disabled={playerCount < 2}>Start Game</button>}
      <button className='button' onClick={onChangeName}>Change Name</button>
    </div>
  )
}
