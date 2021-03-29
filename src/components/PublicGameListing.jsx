// lobby.onMessage("rooms", rooms => {
//   allRooms = rooms

//   console.log("Received lobby rooms: ", rooms);
// })

// lobby.onMessage("+", ([roomId, room]) => {
//   const roomIndex = allRooms.findIndex((room) => room.roomId === roomId);
//   if (roomIndex !== -1) {
//     allRooms[roomIndex] = room;
//   } else {
//     allRooms.push(room);
//   }

//   console.log("updated room", room);
// });

// lobby.onMessage("-", (roomId) => {
//   allRooms = allRooms.filter((room) => room.roomId !== roomId);
//   console.log("removed room", roomId);
// });

import React, { Component } from 'react'
import { joinLobby } from '../services/client'

export default class PublicGameListing extends Component {
  constructor () {
    super()

    this.state = {
      lobby: null,
      rooms: []
    }
  }

  async componentDidMount () {
    const lobby = await joinLobby()

    this.setState({ lobby })

    console.log(lobby)

    lobby.onMessage('rooms', rooms => {
      this.setState({ rooms })

      console.log('Received lobby rooms: ', rooms)
    })

    lobby.onMessage('+', ([roomId, room]) => {
      const roomIndex = this.state.rooms.findIndex((room) => room.roomId === roomId)

      if (roomIndex !== -1) {
        this.setState((state, props) => ({
          rooms: state.rooms.map((r, index) => (roomIndex === index) ? { ...r, room } : r)
        }))
      } else {
        this.setState((state, props) => ({
          rooms: [room, ...state.rooms]
        }))
      }

      console.log('added/updated room', room)
    })
  }

  componentWillUnmount () {
    this.state.lobby.removeAllListeners()
  }

  render () {
    return (
      <div className='panel'>
        {this.state.rooms.map((room, roomIndex) => (
          <div className='row' key={room.roomId}>
            <button className='button u-full-width'>
              Game {roomIndex + 1} <span className='u-pull-right'>({room.clients} / {room.maxClients})</span>
            </button>
          </div>
        ))}
      </div>
    )
  }
}
