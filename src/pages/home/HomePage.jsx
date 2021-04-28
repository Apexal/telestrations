import { Component } from 'react'
import { hostGame, reconnectToGameRoom } from '../../services/client'
import { withRouter } from 'react-router'

import '../../styles/homepage.css'
import HiddenPanel from '../../components/HiddenPanel'
import PublicGameListing from './components/PublicGameListing'

class HomePage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showPublicGames: false,
      showPrivateGame: false,
      publicRooms: [],
      canReconnect: window.localStorage.getItem('lastRoomId') !== null
    }

    this.handleShowPublicGames = this.handleShowPublicGames.bind(this)
    this.handleHostGame = this.handleHostGame.bind(this)
    this.handleSetPublicRooms = this.handleSetPublicRooms.bind(this)
    this.handleJoinPrivateGame = this.handleJoinPrivateGame.bind(this)
    this.handleReconnect = this.handleReconnect.bind(this)
  }

  handleShowPublicGames () {
    this.setState({ showPublicGames: !this.state.showPublicGames })
  }

  handleSetPublicRooms (publicRooms) {
    this.setState({
      publicRooms
    })
  }

  handleShowPrivateGame () {
    this.setState({ showPrivateGame: !this.state.showPrivateGame })
  }

  handleSetPrivateRooms (privateRooms) {
    this.setState({
      privateRooms
    })
  }

  handleHostGame () {
    hostGame()
      .then((room) => {
        this.props.history.push('/' + room.id, { isHost: true })
      })
  }

  // Simply navigate to game code url
  handleJoinPrivateGame (event) {
    event.preventDefault()

    const roomId = event.target.roomId.value
    this.props.history.push('/' + roomId)

    event.target.roomId.value = ''
  }

  handleReconnect () {
    reconnectToGameRoom()
      .then((room) => {
        this.props.history.push('/' + room.id, { isReconnecting: true })
      })
      .catch((err) => {
        window.alert(err)
        window.localStorage.removeItem('lastRoomId')
        window.localStorage.removeItem('lastSessionId')

        this.setState({
          canReconnect: false
        })
      })
  }

  render () {
    return (
      <div>
        <h1 className='title title-anim'>Telestrations</h1>

        <div className='row'>
          <button className='button u-full-width' onClick={this.handleHostGame}>
            Host Game
          </button>
        </div>

        <div className='row'>
          <button className='button u-full-width' onClick={this.handleShowPublicGames}>
            Join Public Game
          </button>

          <HiddenPanel visible={this.state.showPublicGames}>
            <PublicGameListing publicRooms={this.state.publicRooms} onSetPublicRooms={this.handleSetPublicRooms} />
          </HiddenPanel>
        </div>

        <div className='row'>
          <button className='button u-full-width' onClick={this.handleShowPrivateGame}>
            Join Private Game
          </button>

          <HiddenPanel visible={this.state.showPrivateGame}>
            <form onSubmit={this.handleJoinPrivateGame}>
              <input className='u-full-width input-view' name='roomId' type='text' placeholder='Code...' />
            </form>
          </HiddenPanel>

          {this.state.canReconnect &&
            <div className='row'>
              <button className='button u-full-width' onClick={this.handleReconnect}>Reconnect</button>
            </div>}
        </div>
      </div>
    )
  }
}

export default withRouter(HomePage)
