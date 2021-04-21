import { Component } from 'react'
import { joinLobby, leaveLobby } from '../../../services/client'
import { Link } from 'react-router-dom'

export default class PublicGameListing extends Component {
  async componentDidMount () {
    const lobby = await joinLobby()

    console.log('did mount', lobby)

    // The rooms event is from the built-in Colyseus lobby room
    lobby.onMessage('rooms', rooms => {
      this.props.onSetPublicRooms(rooms)

      console.log('Received lobby rooms: ', rooms)
    })

    // The + event is from the built-in Colyseus lobby room
    lobby.onMessage('+', ([roomId, room]) => {
      const roomIndex = this.props.publicRooms.findIndex((room) => room.roomId === roomId)

      if (roomIndex !== -1) {
        // Update existing room
        this.props.onSetPublicRooms(this.props.publicRooms.map((r, index) => (roomIndex === index) ? room : r))
      } else {
        // Add new room
        this.props.onSetPublicRooms([room, ...this.props.publicRooms])
      }

      console.log('added/updated room', room)
    })

    // The - event is from the built-in Colyseus lobby room
    lobby.onMessage('-', (roomId) => {
      this.props.onSetPublicRooms(this.props.publicRooms.filter(room => room.roomId !== roomId))
    })
  }

  componentWillUnmount () {
    console.log('leave lobby')
    leaveLobby()
  }

  renderPublicGames () {
    if (this.props.publicRooms.length <= 0) { return <div className='center'><i>There are no open public rooms!</i></div> }

    return this.props.publicRooms.map((room, roomIndex) => (
      <div className='row' key={room.roomId}>
        <Link to={'/' + room.roomId} className='button u-full-width'>
          Game {roomIndex + 1} <span className='u-pull-right'>({room.clients} / {room.maxClients})</span>
        </Link>
      </div>
    ))
  }

  render () {
    return (
      <div className='panel'>
        {this.renderPublicGames()}
      </div>
    )
  }
}
