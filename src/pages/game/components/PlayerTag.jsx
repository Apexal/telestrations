import React from 'react'
import '../../../styles/player-tag.css'

/*
  PlayerTag is the item that represents each player when they join a game. For instance, it will show their name
  and maybe a little information about them.
*/
export default function PlayerTag ({ sessionId, isPlayer, isHost, displayName }) {
  return (
    <li key={sessionId}>
      <div className="player-tag player-tag-add-anim">
        <span>
          {isHost ? '👑' : ''} {displayName}
        </span>
        {isPlayer && <strong style={{marginLeft: 5}}>(You)</strong>}
      </div>
    </li>
  )
}
