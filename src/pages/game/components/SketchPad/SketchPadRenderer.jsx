import React, { Component } from 'react'
import SketchControlBar from './SketchControlBar'

/**
 * Manages the drawing / exporting operations on top of the canvas object.
 */

export default class SketchPadRenderer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentX: -1,
      currentY: -1,
      width: 2,
      color: 'black',
      strokes: [],
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
  }

  componentDidMount () {
    this.setState({
      context: this.canvas.current.getContext('2d')
    })

    this.canvas.current.addEventListener('mousedown', this.onMouseClick)
    this.canvas.current.addEventListener('mouseup', this.onMouseReleased)
    this.canvas.current.addEventListener('mousemove', this.onMouseMove)
  }

  drawStroke (stroke) {
    const ctx = this.state.context

    ctx.beginPath()
    ctx.moveTo(stroke.from.x, stroke.from.y)
    ctx.lineTo(stroke.to.x, stroke.to.y)
    ctx.lineWidth = stroke.options.width
    ctx.strokeStyle = stroke.options.color
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.closePath()
  }

  clear () {
    const ctx = this.state.context
    ctx.clearRect(0, 0, this.canvas.current.clientWidth, this.canvas.current.clientHeight)
  }

  redraw () {
    this.clear()

    for (const stroke of this.state.strokes) {
      this.drawStroke(stroke)
    }
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

  getMousePos (event) {
    const rect = this.canvas.current.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left) / (rect.right - rect.left) * this.canvas.current.width,
      y: (event.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.current.height
    }
  }

  setCurrentPosition (x, y) {
    this.setState({ currentX: x, currentY: y })
  }

  onMouseClick (event) {
    const pos = this.getMousePos(event)
    this.setCurrentPosition(pos.x, pos.y)
  }

  onMouseMove (event) {
    if (event.buttons !== 1) return

    const to = this.getMousePos(event)

    const stroke = {
      from: { x: this.state.currentX, y: this.state.currentY },
      to,
      options: {
        width: this.state.width,
        color: this.state.color
      }
    }

    const strokes = this.state.strokes.concat(stroke)
    this.optimizeStrokes(strokes)
    this.setState({ strokes })

    this.drawStroke(stroke)
    this.setCurrentPosition(to.x, to.y)
  }

  onMouseReleased () {
    this.redraw()
  }

  handleClear () {
    this.clear()
    this.setState({ strokes: [] })
  }

  handleUndo () {
    if (this.state.strokes.length === 0) { return }

    const strokes = this.state.strokes
    for (let i = 0; i < 5; i++) {
      strokes.pop()
    }

    this.optimizeStrokes(strokes)
    this.setState({ strokes }, this.redraw)
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
        <canvas id='canvas' ref={this.canvas} width='400' height='400'>
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
