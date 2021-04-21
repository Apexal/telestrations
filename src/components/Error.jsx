import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Error extends Component {
  render () {
    return (
      <div className=''>
        <h1>{this.props.title}</h1>
        {this.props.children}
        <Link className='button' to='/'>Home</Link>
        <a href='https://github.com/Apexal/telestrations/issues/new' target='_blank' rel="noreferrer" className='button'>Report Bug</a>
      </div>
    )
  }
}
