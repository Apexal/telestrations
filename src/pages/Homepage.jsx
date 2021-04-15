import { Component } from 'react'
import PublicGameListing from '../components/PublicGameListing'
import { hostGame } from '../services/client'
import { withRouter } from 'react-router'

import '../styles/homepage.css'
import HiddenPanel from '../components/HiddenPanel'

class Homepage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showPublicGames: false,
      showPrivateGame: false
    }

    this.handleShowPublicGames = this.handleShowPublicGames.bind(this)
    this.handleShowPrivateGame = this.handleShowPrivateGame.bind(this)
    this.handleHostGame = this.handleHostGame.bind(this)
    this.handleJoinPrivateGame = this.handleJoinPrivateGame.bind(this)
  }

  handleShowPublicGames () {
    this.setState({ showPublicGames: !this.state.showPublicGames })
  }

  handleShowPrivateGame () {
    this.setState({ showPrivateGame: !this.state.showPrivateGame })
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

  render () {
    return (
      <div>
        <h1 className='title'>Telestrations</h1>

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
            <PublicGameListing />
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
        </div>
      </div>
    )
  }
}

export default withRouter(Homepage)
