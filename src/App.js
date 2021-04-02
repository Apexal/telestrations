// import logo from './logo.svg'
import {
  BrowserRouter as Router,
  Switch,
  Route
  // Link
} from 'react-router-dom'

import './App.css'
import SketchPad from './components/SketchPad/SketchPad'
import HomePage from './pages/HomePage'

function App () {
  return (
    <div className='App container'>
      <Router>
        <Switch>
          <Route path='/' exact>
            <HomePage />
          </Route>
          <Router path='/sketch'>
            <SketchPad secretWord='sandpaper' />
          </Router>
        </Switch>
      </Router>
    </div>
  )
}

// <SketchPad secretWord='sandpaper' />

export default App
