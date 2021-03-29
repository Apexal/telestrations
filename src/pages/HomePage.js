import React, { Component } from 'react'
import { joinLobby } from '../services/client'

import '../styles/homepage.css'
import HiddenPanel from './HiddenPanel'

export default class HomePage extends Component {
  constructor () {
    super()

    this.state = {
      showPublicGames: false,
      showPrivateGame: false
    }

    this.onShowPublicGames = this.onShowPublicGames.bind(this)
    this.onShowPrivateGame = this.onShowPrivateGame.bind(this)
  }

  onShowPublicGames () {
    this.setState({ showPublicGames: !this.state.showPublicGames })
    console.log('clicked');
    joinLobby()
      .then(() => {
        console.log('joined lobby');
      })
  }

  onShowPrivateGame () {
    this.setState({ showPrivateGame: !this.state.showPrivateGame })
  }

  render () {
    return (
      <div>
        <h1 className='title'>Telestrations</h1>

        <div className='row'>
          <button className='button u-full-width'>
            Host Game
          </button>

        </div>

        <div className='row'>
          <button className='button u-full-width' onClick={this.onShowPublicGames}>
            Join Public Game
          </button>

          <HiddenPanel visible={this.state.showPublicGames}>
            <div className='panel'>
              <div className='row'>
                <button className='button u-full-width'>
                  Game 1 <span className='u-pull-right'>(2 / 5)</span>
                </button>
              </div>

              <div className='row'>
                <button className='button u-full-width'>
                  Game 2 <span className='u-pull-right'>(2 / 5)</span>
                </button>
              </div>
            </div>
          </HiddenPanel>
        </div>

        <div className='row'>
          <button className='button u-full-width' onClick={this.onShowPrivateGame}>
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
