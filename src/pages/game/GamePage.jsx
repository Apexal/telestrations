import { Component } from 'react'
import { withRouter } from 'react-router'
import GameLobby from './components/GameLobby'
import GameRound from './components/GameRound'
import GameOver from './components/GameOver'

import { getGameRoom, joinGameRoom, leaveGameRoom } from '../../services/client'

import '../../styles/game.css'
import Error from '../../components/Error'

/**
 * Wrapper component class for entire game.
 */
class GamePage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      sessionId: '',
      roomId: '',
      isJoiningGame: true,
      isInGame: false,
      isStateLoaded: false,
      hostPlayerSessionId: '',
      errorMessage: null,
      maxPlayers: 1,
      players: {},
      playerKeys: [],
      roundIndex: 0,
      roundTimerSecondsRemaining: 0,
      previousDrawingGuess: '',
      drawingStrokes: [],
      isDrawingStage: false,
      isGameOver: false
    }

    this.getGameRoomId = this.getGameRoomId.bind(this)
    this.setupGameRoomEventListeners = this.setupGameRoomEventListeners.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleStartGame = this.handleStartGame.bind(this)
    this.handleDrawingStrokesUpdate = this.handleDrawingStrokesUpdate.bind(this)
    this.handlePreviousDrawingGuessUpdate = this.handlePreviousDrawingGuessUpdate.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  getGameRoomId () {
    return this.props.match.params.roomCode
  }

  getPlayer () {
    return this.state.players[this.state.sessionId]
  }

  isSubmitted () {
    return !!this.getPlayer().submissions.find(sub => sub.roundIndex === this.state.roundIndex)
  }

  setupGameRoomEventListeners () {
    const room = getGameRoom()

    room.onMessage('error', window.alert)

    room.onMessage('send-submissions', this.handleSubmit)

    room.onMessage('round-end', () => {
      this.setState({
        drawingStrokes: [],
        previousDrawingGuess: '',
        isDrawingStage: false
      })
    })

    room.onStateChange.once((state) => {
      this.setState({
        isStateLoaded: true
      })
    })

    room.state.onChange = (changes) => {
      changes.forEach(change => {
        if (['hostPlayerSessionId', 'maxPlayers', 'roundIndex', 'isGameOver', 'roundTimerSecondsRemaining'].includes(change.field)) {
          this.setState({ [change.field]: change.value })
        }
      })
    }

    room.state.players.onAdd = (player, key) => {
      this.setState((state) => ({
        players: { ...state.players, [key]: player },
        playerKeys: [...state.playerKeys, key]
      }))

      player.onChange = (changes) => {
        this.setState((state) => ({
          players: { ...state.players, [key]: player }
        }))
      }
    }

    room.state.players.onRemove = (player, key) => {
      const newPlayers = Object.assign({}, this.state.players)
      delete newPlayers[key]
      this.setState({
        players: newPlayers,
        playerKeys: this.state.playerKeys.filter(k => k !== key)
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

  handleDrawingStrokesUpdate (drawingStrokes, callback) {
    if (this.isSubmitted()) return

    this.setState({ drawingStrokes }, callback)
  }

  handlePreviousDrawingGuessUpdate (newPreviousDrawingGuess) {
    this.setState({
      previousDrawingGuess: newPreviousDrawingGuess,
      isDrawingStage: true
    })
  }

  handleSubmit () {
    const room = getGameRoom()
    room.send('player_submit_submission', {
      roundIndex: this.state.roundIndex,
      previousDrawingGuess: this.state.previousDrawingGuess,
      drawingStrokes: this.state.drawingStrokes
    })
  }

  async componentDidMount () {
    const roomId = this.getGameRoomId()

    this.setState({ roomId })

    // There are two possibilities at this point
    // 1. The player clicked host game and has already created and joined a game room
    //    - game room already is already joined
    // 2. The player clicked on a game link, typed in the code, or click a link to the game room
    //    - game room must be joined at this point

    if (this.props.location.state && (this.props.location.state.isHost || this.props.location.state.isReconnecting)) {
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
          isInGame: true,
          isJoiningGame: false,
          isHost: room.sessionId === room.state.hostPlayerSessionId,
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
            hostPlayerSessionId={this.state.hostPlayerSessionId}
            players={this.state.players}
            maxPlayers={this.state.maxPlayers}
            onDrawingStrokesUpdate={this.handleDrawingStrokesUpdate}
            onChangeName={this.handleChangeName}
            onStartGame={this.handleStartGame}
          />
        )
      } else if (this.state.isGameOver) {
        return (
          <GameOver
            playerKeys={this.state.playerKeys}
            players={this.state.players}
          />
        )
      } else if (this.state.roundIndex > 0) {
        return (
          <GameRound
            isSubmitted={this.isSubmitted()}
            secretWord={this.getPlayer().secretWord}
            onSubmit={this.handleSubmit}
            onDrawingStrokesUpdate={this.handleDrawingStrokesUpdate}
            onPreviousDrawingGuessUpdate={this.handlePreviousDrawingGuessUpdate}
            {...this.state}
          />
        )
      }
    }
  }

  render () {
    return (
      <div>
        {this.state.isJoiningGame && (
          <div>
            Joining game room...
          </div>
        )}
        {this.state.isInGame && this.state.isStateLoaded && this.renderGameComponent()}
        {this.state.errorMessage &&
          <Error title='An Error Occurred'>
            <p>{this.state.errorMessage}</p>
          </Error>}
      </div>
    )
  }
}

export default withRouter(GamePage)
