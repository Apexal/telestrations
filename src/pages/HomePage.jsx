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

    let cc = this.getColorCombo()
	  document.body.style.backgroundColor = this.getColor(cc)
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

  getColorCombo() {
    return [360 * Math.random(), 50 + 50 * Math.random(), 80 + 15 * Math.random()]
  }

  getColor(cc) { 
    return "hsl(" + cc[0] + ',' +
		cc[1] + '%,' + 
		cc[2] + '%)'
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
