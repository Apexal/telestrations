import { Component } from 'react'
import { withRouter } from 'react-router'

/**
 * Wrapper component class for entire game. This allows us
 */
class Game extends Component {
  constructor (props) {
    super(props)

    console.log(this.props)

    this.state = {
      inGame: false
    }
  }

  render () {
    const { match, location, history } = this.props

    return (
      <div>
        room code: {match.params.roomCode}
      </div>
    )
  }
}

export default withRouter(Game)
