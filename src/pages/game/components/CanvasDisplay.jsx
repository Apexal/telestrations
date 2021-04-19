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
    for (const stroke of this.props.drawingStrokes) {
      this.drawStroke(stroke)
    }
  }

  componentDidMount () {
    this.setState({
      context: this.canvasRef.current.getContext('2d')
    }, this.draw)
  }

  render () {
    return (
      <canvas id='canvas' ref={this.canvasRef} width='400' height='400'>
        Sorry, your browser does not support canvas.
      </canvas>
    )
  }
}
