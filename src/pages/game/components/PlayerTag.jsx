import React from 'react'
import '../../../styles/player-tag.css'

/*
  PlayerTag is the item that represents each player when they join a game. For instance, it will show their name
  and maybe a little information about them.
*/
export default function PlayerTag ({ key, isHost, displayName }) {
  return (
    <div>
      <li key={key}>
        <div className='player-tag'>
          {isHost ? '👑' : ''} {displayName}
        </div>
      </li>
    </div>
  )
}
