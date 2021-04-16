import { Component } from 'react'
import { withRouter } from 'react-router'
import PlayerTag from '../components/PlayerTag'
import { getGameRoom, joinGameRoom } from '../services/client'

/**
 * Wrapper component class for entire game. This allows us
 */
class Game extends Component {
  constructor (props) {
    super(props)

    console.log(this.props)

    this.state = {
      sessionId: '',
      roomId: '',
      isJoiningGame: true,
      isInGame: false,
      hostPlayerClientId: '',
      errorMessage: null,
      players: {}
    }

    this.getGameRoomId = this.getGameRoomId.bind(this)
    this.setupGameRoomEventListeners = this.setupGameRoomEventListeners.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
  }

  getGameRoomId () {
    return this.props.match.params.roomCode
  }

  setupGameRoomEventListeners () {
    const room = getGameRoom()
    console.log(room.state)
    room.state.onChange = (changes) => {
      changes.forEach(change => {
        if (change.field === 'hostPlayerClientId') {
          this.setState({ hostPlayerClientId: change.value })
        }
      })
    }

    room.state.players.onAdd = (player, key) => {
      console.log(player, 'has been added at', key)
      this.setState((state) => ({
        players: { ...state.players, [key]: player }
      }))

      player.onChange = (changes) => {
        this.setState((state) => ({
          players: { ...state.players, [key]: player }
        }))
      }
    }

    room.state.players.onRemove = (player, key) => {
      console.log(player, 'has been removed at', key)
      const newPlayers = Object.assign({}, this.state.players)
      delete newPlayers[key]
      this.setState({
        players: newPlayers
      })
    }

    room.onLeave((code) => {
      window.alert('Lost connection to the game room...')
      this.props.history.push('/')
    })

    room.onError((code, message) => {
      console.log(code, message)
      window.alert(code, message)
    })
  }

  handleChangeName () {
    const newDisplayName = window.prompt('New name?')

    const room = getGameRoom()
    room.send('player_set_displayName', { displayName: newDisplayName })
  }

  async componentDidMount () {
    const roomId = this.getGameRoomId()

    this.setState({ roomId });

    // There are two possibilities at this point
    // 1. The player clicked host game and has already created and joined a game room
    //    - game room already is already joined
    // 2. The player clicked on a game link, typed in the code, or click a link to the game room
    //    - game room must be joined at this point

    if (this.props.location.state && this.props.location.state.isHost) {
      const room = getGameRoom()
      this.setState({
        sessionId: room.sessionId,
        isJoiningGame: false,
        isInGame: true,
        isHost: true,
        errorMessage: null
      }, this.setupGameRoomEventListeners)
    } else {
      try {
        const room = await joinGameRoom(roomId)
        this.setState({
          sessionId: room.sessionId,
          isJoiningGame: false,
          isInGame: true,
          isHost: false,
          errorMessage: null
        }, this.setupGameRoomEventListeners)
      } catch (e) {
        console.error(e)
        this.setState({
          sessionId: '',
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

  renderPlayers() {
    return Object.keys(this.state.players).map(key => (
      <PlayerTag key={key} isHost={this.state.hostPlayerClientId === key} displayName={this.state.players[key].displayName}></PlayerTag>
    ));
  }

  render () {
    const isHost = this.state.hostPlayerClientId === this.state.sessionId

    const playerCount = Object.keys(this.state.players).length
    const playerListItems = this.renderPlayers();
    return (
      <div>
        {this.state.isJoiningGame && (
          <div>
            Joining game room...
          </div>
        )}
        {this.state.isInGame &&
          <div>
            <h1>{this.state.roomId}</h1>
            <h5>{playerCount} / 12 players</h5>
  
            <ul>
              {playerListItems}
            </ul>

            {isHost && <button className='button' disabled={playerCount < 2}>Start Game</button>}
            <button className='button' onClick={this.handleChangeName}>Change Name</button>
          </div>}
        {this.state.errorMessage &&
          <div>{this.state.errorMessage}</div>}
      </div>
    )
  }
}

export default withRouter(Game)
