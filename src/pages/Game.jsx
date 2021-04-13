import { Component } from 'react'
import { withRouter } from 'react-router'
import { getGameRoom, joinGameRoom } from '../services/client'

/**
 * Wrapper component class for entire game. This allows us
 */
class Game extends Component {
  constructor (props) {
    super(props)

    console.log(this.props)

    this.state = {
      isJoiningGame: true,
      isInGame: false,
      isHost: false,
      room: null,
      errorMessage: null
    }

    this.getGameRoomId = this.getGameRoomId.bind(this)
  }

  getGameRoomId () {
    return this.props.match.params.roomCode
  }

  async componentDidMount () {
    const roomId = this.getGameRoomId()

    // There are two possibilities at this point
    // 1. The player clicked host game and has already created and joined a game room
    //    - game room already is already joined
    // 2. The player clicked on a game link, typed in the code, or click a link to the game room
    //    - game room must be joined at this point

    if (this.props.location.state && this.props.location.state.isHost) {
      const room = getGameRoom()
      this.setState({
        room,
        isJoiningGame: false,
        isInGame: true,
        isHost: true,
        errorMessage: null
      })
    } else {
      try {
        const room = await joinGameRoom(roomId)
        this.setState({
          room,
          isJoiningGame: false,
          isInGame: true,
          isHost: false,
          errorMessage: null
        })
      } catch (e) {
        console.error(e)
        this.setState({
          room: null,
          isJoiningGame: false,
          isInGame: false,
          errorMessage: 'Failed to find or join game room!'
        })
      }
    }
  }

  componentWillUnmount () {
    this.state.room.removeAllListeners()
    this.state.room.leave()
  }

  render () {
    return (
      <div>
        {this.state.isJoiningGame && (
          <div>
            Joining game room...
          </div>
        )}
        {this.state.room &&
          <div>Joined game!</div>}
        {this.state.errorMessage &&
          <div>{this.state.errorMessage}</div>}
      </div>
    )
  }
}

export default withRouter(Game)
