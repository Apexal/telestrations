import { Component, createRef } from 'react'

/**
 * Manages the drawing / exporting operations on top of the canvas object.
 */

export default class CanvasDisplay extends Component {
  constructor (props) {
    super(props)

    this.state = {
      context: null
    }
    this.canvasRef = createRef()

    this.drawStroke = this.drawStroke.bind(this)
    this.draw = this.draw.bind(this)
  }

  drawStroke (stroke) {
    if (!stroke) return

    const ctx = this.state.context

    ctx.beginPath()
    ctx.moveTo(stroke.fromX, stroke.fromY)
    ctx.lineTo(stroke.toX, stroke.toY)
    ctx.lineWidth = stroke.width
    ctx.strokeStyle = stroke.color
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.closePath()
  }

  draw () {
    const ctx = this.state.context
    ctx.clearRect(0, 0, this.canvasRef.current.clientWidth, this.canvasRef.current.clientHeight)
    for (let i = 0; i < this.props.drawingStrokes.length; i++) {
      window.setTimeout(() => (() => this.drawStroke(this.props.drawingStrokes[i]))(), 10 * i)
    }
  }

  componentDidMount () {
    this.setState({
      context: this.canvasRef.current.getContext('2d')
    }, this.draw)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.drawingStrokes.length !== this.props.drawingStrokes.length) {
      this.draw()
    }
  }

  render () {
    return (
      <canvas id='canvas' ref={this.canvasRef} width='400' height='400'>
        Sorry, your browser does not support canvas.
      </canvas>
    )
  }
}
