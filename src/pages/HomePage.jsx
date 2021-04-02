import React, { Component } from 'react'
import PublicGameListing from '../components/PublicGameListing'
import { hostGame } from '../services/client'

import '../styles/homepage.css'
import HiddenPanel from './HiddenPanel'

export default class HomePage extends Component {
  constructor () {
    super()

    this.state = {
      showPublicGames: false,
      showPrivateGame: false
    }

    this.handleShowPublicGames = this.handleShowPublicGames.bind(this)
    this.handleShowPrivateGame = this.handleShowPrivateGame.bind(this)
    this.handleHostGame = this.handleHostGame.bind(this)
  }

  handleShowPublicGames () {
    this.setState({ showPublicGames: !this.state.showPublicGames })
  }

  handleShowPrivateGame () {
    this.setState({ showPrivateGame: !this.state.showPrivateGame })
  }

  handleHostGame () {
    hostGame()
      .then(() => {
        console.log('done')
      })
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
            <input className='u-full-width input-view' type='text' placeholder='Code...' />
          </HiddenPanel>
        </div>
      </div>
    )
  }
}
