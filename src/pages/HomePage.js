import React, { Component } from 'react'

import "../styles/homepage.css";
import HiddenPanel from './HiddenPanel';

export default class HomePage extends Component {

  constructor() {
    super();

    this.state = {
      showPublicGames: false,
      showPrivateGame: false
    };

    this.onShowPublicGames = this.onShowPublicGames.bind(this);
    this.onShowPrivateGame = this.onShowPrivateGame.bind(this);

    let cc = this.getColorCombo();

	  document.body.style.backgroundColor = this.getColor(cc);
  }

  onShowPublicGames() {
    this.setState({ showPublicGames: !this.state.showPublicGames });
  }

  onShowPrivateGame() {
    this.setState({ showPrivateGame: !this.state.showPrivateGame });
  }

  getColorCombo() {
    return [360 * Math.random(), 50 + 50 * Math.random(), 80 + 15 * Math.random()];
  }

  getColor(cc) { 
    return "hsl(" + cc[0] + ',' +
		cc[1] + '%,' + 
		cc[2] + '%)';
  }

  render() {
    return (
      <div>
        <h1 className="title">Telestrations</h1>

          <div className="row">
            <button className="button u-full-width">
              Host Game
            </button>

          </div>
        
          <div className="row">
            <button className="button u-full-width" onClick={this.onShowPublicGames} >
              Join Public Game
            </button>
          
            <HiddenPanel visible={this.state.showPublicGames}>
              <div className="panel">
                <div className="row">
                  <button className="button u-full-width">
                    Game 1 <span className="u-pull-right">(2 / 5)</span>
                  </button> 
                </div>

                <div className="row">
                  <button className="button u-full-width">
                    Game 2 <span className="u-pull-right">(2 / 5)</span>
                  </button>
                </div>
              </div>
            </HiddenPanel>
          </div>

          <div className="row">
            <button className="button u-full-width" onClick={this.onShowPrivateGame} >
              Join Private Game
            </button>

            <HiddenPanel visible={this.state.showPrivateGame}>
              <input className="u-full-width input-view" type="text" placeholder="Code..." />
            </HiddenPanel>
          </div>
      </div>
    )
  }
}
