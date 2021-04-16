import { Component } from 'react'
import { joinLobby } from '../../../services/client'
import { Link } from 'react-router-dom'

export default class PublicGameListing extends Component {
  constructor (props) {
    super(props)

    this.state = {
      lobby: null,
      rooms: []
    }
  }

  async componentDidMount () {
    const lobby = await joinLobby()

    this.setState({ lobby })

    console.log(lobby)

    // The rooms event is from the built-in Colyseus lobby room
    lobby.onMessage('rooms', rooms => {
      this.setState({ rooms })

      console.log('Received lobby rooms: ', rooms)
    })

    // The + event is from the built-in Colyseus lobby room
    lobby.onMessage('+', ([roomId, room]) => {
      const roomIndex = this.state.rooms.findIndex((room) => room.roomId === roomId)

      if (roomIndex !== -1) {
        // Update existing room
        this.setState((state, props) => ({
          rooms: state.rooms.map((r, index) => (roomIndex === index) ? room : r)
        }))
      } else {
        // Add new room
        this.setState((state, props) => ({
          rooms: [room, ...state.rooms]
        }))
      }

      console.log('added/updated room', room)
    })

    // The - event is from the built-in Colyseus lobby room
    lobby.onMessage('-', (roomId) => {
      this.setState((state, props) => ({
        rooms: state.rooms.filter(room => room.roomId !== roomId)
      }))
    })
  }

  componentWillUnmount () {
    // the lobby doesn't exist, so don't try removing the event listeners
    if (!this.state.lobby) { return }

    this.state.lobby.removeAllListeners()
  }

  renderPublicGames () {
    if (this.state.rooms.length <= 0) { return <i>There are no active public rooms!</i> }

    return this.state.rooms.map((room, roomIndex) => (
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
