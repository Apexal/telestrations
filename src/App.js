// import logo from './logo.svg'
import {
  BrowserRouter as Router,
  Switch,
  Route
  // Link
} from 'react-router-dom'

import './App.css'
import HomePage from './pages/home/HomePage'
import GamePage from './pages/game/GamePage'

function App () {
  return (
    <div className='App container'>
      <Router>
        <Switch>
          <Route path='/' exact>
            <HomePage />
          </Route>
          <Route path='/:roomCode'>
            <GamePage />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

// <SketchPad secretWord='sandpaper' />

export default App
