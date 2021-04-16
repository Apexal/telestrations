import React, { Component } from 'react'
import SketchControlBar from './SketchControlBar'

/**
 * Manages the drawing / exporting operations on top of the canvas object.
 */

export default class SketchPadRenderer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentPosition: { x: -1, y: -1 },
      width: 2,
      color: 'black',
      strokes: [],
      offset: { x: 0, y: 0 },

      context: null
    }

    this.canvas = React.createRef()

    this.clear = this.clear.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleUndo = this.handleUndo.bind(this)
    this.handleReplay = this.handleReplay.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.drawStroke = this.drawStroke.bind(this)

    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseClick = this.onMouseClick.bind(this)
    this.onMouseReleased = this.onMouseReleased.bind(this)
    this.onCanvasResized = this.onCanvasResized.bind(this)
  }

  componentDidMount () {
    this.setState({
      offset: { x: this.canvas.current.offsetLeft || 0, y: this.canvas.current.offsetTop || 0 },
      context: this.canvas.current.getContext('2d')
    })

    window.addEventListener('mousedown', this.onMouseClick)
    window.addEventListener('mouseup', this.onMouseReleased)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('resize', this.onCanvasResized)
  }

  drawStroke (stroke) {
    const ctx = this.state.context

    ctx.beginPath()
    ctx.moveTo(stroke.from.x - this.state.offset.x, stroke.from.y - this.state.offset.y)
    ctx.lineTo(stroke.to.x - this.state.offset.x, stroke.to.y - this.state.offset.y)
    ctx.lineWidth = stroke.options.width
    ctx.strokeStyle = stroke.options.color
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.closePath()

    this.setState({ context: ctx })
  }

  clear () {
    const ctx = this.state.context
    ctx.clearRect(0, 0, this.canvas.current.clientWidth, this.canvas.current.clientHeight)
    this.setState({ context: ctx })
  }

  distance (posA, posB) {
    return Math.sqrt(Math.pow(posA.x - posB.x, 2) + Math.pow(posA.y - posB.y, 2))
  }

  samePos (posA, posB) {
    return posA.x === posB.x && posA.y === posB.y
  }

  optimizeStrokes (anyStrokes) {
    for (let i = 2; i < anyStrokes.length; i++) {
      const stroke = anyStrokes[i]
      const prevStroke = anyStrokes[i - 1]
      const prevPrevStroke = anyStrokes[i - 2]

      if (this.distance(prevStroke.from, stroke.from) <= 2 && this.samePos(prevPrevStroke.to, prevStroke.from)) {
        anyStrokes.splice(i - 1, 1)
        prevPrevStroke.to = stroke.from
      }
    }
  }

  setCurrentPosition (x, y) {
    this.setState({ currentPosition: { x, y } })
  }

  onMouseClick ({ clientX, clientY }) {
    this.setCurrentPosition(clientX, clientY)
  }

  onMouseMove ({ buttons, clientX, clientY }) {
    if (buttons !== 1) return

    const stroke = {
      from: { ...this.state.currentPosition },
      to: { x: clientX, y: clientY },
      options: { width: this.state.width, color: this.state.color }
    }

    const strokes = this.state.strokes.concat(stroke)
    this.optimizeStrokes(strokes)
    this.setState({ strokes })

    this.drawStroke(stroke)
    this.setCurrentPosition(clientX, clientY)
  }

  onMouseReleased () {
    this.clear()

    for (const stroke of this.state.strokes) {
      this.drawStroke(stroke)
    }
  }

  onCanvasResized () {
    const dx = this.canvas.current.offsetLeft
    const dy = this.canvas.current.offsetTop

    this.setState({ offset: { x: dx, y: dy } })
  }

  handleClear () {
    this.clear()
    this.setState({ strokes: [] })
  }

  handleUndo () {
    if (this.state.strokes.length <= 0) { return }

    const strokes = this.state.strokes
    strokes.pop()

    this.optimizeStrokes(strokes)
    this.setState({ strokes })
  }

  handleReplay () {
    this.clear()
    const replayTimeouts = []

    for (let i = 0; i < this.state.strokes.length; i++) {
      replayTimeouts.push(setTimeout(() => this.drawStroke(this.state.strokes[i]), 10 * i))
    }
  }

  handleSubmit () {

  }

  handleDownload () {
    const image = this.state.context.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    window.location.href = image
  }

  render () {
    return (
      <div>
        <canvas ref={this.canvas} width='400' height='400'>
          Sorry, your browser does not support canvas.
        </canvas>
        <SketchControlBar
          onClear={this.handleClear}
          onUndo={this.handleUndo}
          onReplay={this.handleReplay}
          onSubmit={this.handleSubmit}
          onDownload={this.handleDownload} 
        />
      </div>
    )
  }
}
