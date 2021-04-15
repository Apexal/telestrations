// import logo from './logo.svg'
import {
  BrowserRouter as Router,
  Switch,
  Route
  // Link
} from 'react-router-dom'

import './App.css'
import SketchPad from './components/SketchPad/SketchPad'
import Homepage from './pages/Homepage'
import Game from './pages/Game'

function App () {
  return (
    <div className='App container'>
      <Router>
        <Switch>
          <Route path='/' exact>
            <Homepage />
          </Route>
          <Router path='/sketch'>
            <SketchPad secretWord='sandpaper' />
          </Router>
          <Route path='/:roomCode'>
            <Game />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

// <SketchPad secretWord='sandpaper' />

export default App
