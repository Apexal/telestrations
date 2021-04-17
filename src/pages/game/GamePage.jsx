import { Component } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import GameLobby from './components/GameLobby'
import GameRound from './components/GameRound'

import { getGameRoom, joinGameRoom, leaveGameRoom } from '../../services/client'

import '../../styles/game.css'

/**
 * Wrapper component class for entire game. This allows us
 */
class GamePage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      sessionId: '',
      roomId: '',
      isJoiningGame: true,
      isInGame: false,
      hostPlayerClientId: '',
      errorMessage: null,
      maxPlayers: 1,
      players: {},
      roundIndex: 0,
      guessingSecondsRemaining: 0,
      drawingSecondsRemaining: 0
    }

    this.getGameRoomId = this.getGameRoomId.bind(this)
    this.setupGameRoomEventListeners = this.setupGameRoomEventListeners.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleStartGame = this.handleStartGame.bind(this)
  }

  getGameRoomId () {
    return this.props.match.params.roomCode
  }

  getPlayer () {
    return this.state.players[this.state.sessionId]
  }

  setupGameRoomEventListeners () {
    const room = getGameRoom()
    room.state.onChange = (changes) => {
      changes.forEach(change => {
        if (change.field === 'hostPlayerClientId') {
          this.setState({ hostPlayerClientId: change.value })
        } else if (change.field === 'maxPlayers') {
          this.setState({ maxPlayers: change.value })
        } else if (change.field === 'roundIndex') {
          this.setState({ roundIndex: change.value })
        } else if (change.field === 'drawingSecondsRemaining') {
          this.setState({ drawingSecondsRemaining: change.value })
        } else if (change.field === 'guessingSecondsRemaining') {
          this.setState({ guessingSecondsRemaining: change.value })
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
      leaveGameRoom()
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

  handleStartGame () {
    const room = getGameRoom()
    room.send('start_game')
  }

  async componentDidMount () {
    const roomId = this.getGameRoomId()

    this.setState({ roomId })

    // There are two possibilities at this point
    // 1. The player clicked host game and has already created and joined a game room
    //    - game room already is already joined
    // 2. The player clicked on a game link, typed in the code, or click a link to the game room
    //    - game room must be joined at this point

    if (this.props.location.state && this.props.location.state.isHost) {
      const room = getGameRoom()
      if (room === null) {
        // Refreshed page! game is dead
        this.setState({
          sessionId: '',
          isJoiningGame: false,
          isInGame: false,
          errorMessage: 'Failed to find or join game room!'
        })
      } else {
        this.setState({
          sessionId: room.sessionId,
          isJoiningGame: false,
          isInGame: true,
          isHost: true,
          errorMessage: null
        }, this.setupGameRoomEventListeners)
      }
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
    leaveGameRoom()
  }

  renderGameComponent () {
    if (this.state.isInGame) {
      if (this.state.roundIndex === 0) {
        return (
          <GameLobby
            roomId={this.state.roomId}
            sessionId={this.state.sessionId}
            hostPlayerClientId={this.state.hostPlayerClientId}
            players={this.state.players}
            maxPlayers={this.state.maxPlayers}
            onChangeName={this.handleChangeName}
            onStartGame={this.handleStartGame}
          />
        )
      } else if (this.state.roundIndex > 0) {
        return (
          <GameRound
            secretWord={this.state.players[this.state.sessionId].secretWord}
            {...this.state}
          />
        )
        // if (player) {
        //   return (
        //     <SketchPad secretWord={player.secretWord} />
        //   )
        // } else {
        //   return (
        //     <p>Loading...</p>
        //   )
        // }
      }
    }
  }

  render () {
    const gameComponent = this.renderGameComponent()

    return (
      <div>
        {this.state.isJoiningGame && (
          <div>
            Joining game room...
          </div>
        )}
        {this.state.isInGame && gameComponent}
        {this.state.errorMessage &&
          <div>
            <h1>An Error Occurred</h1>
            <p>{this.state.errorMessage}</p>
            <Link className='button' to='/'>Home</Link>
          </div>}
      </div>
    )
  }
}

export default withRouter(GamePage)
