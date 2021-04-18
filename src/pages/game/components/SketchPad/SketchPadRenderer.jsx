import { Component, createRef } from 'react'
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
      width: 5,
      color: 'black',
      strokes: [],
      context: null
    }

    this.canvasRef = createRef()

    this.clear = this.clear.bind(this)
    this.redraw = this.redraw.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleUndo = this.handleUndo.bind(this)
    this.handleReplay = this.handleReplay.bind(this)
    this.onDownload = this.onDownload.bind(this)
    this.drawStroke = this.drawStroke.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseClick = this.onMouseClick.bind(this)
    this.onMouseReleased = this.onMouseReleased.bind(this)
  }

  componentDidMount () {
    this.setState({
      context: this.canvasRef.current.getContext('2d')
    })

    this.canvasRef.current.addEventListener('mousedown', this.onMouseClick)
    this.canvasRef.current.addEventListener('mouseup', this.onMouseReleased)
    this.canvasRef.current.addEventListener('mousemove', this.onMouseMove)
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
    ctx.clearRect(0, 0, this.canvasRef.current.clientWidth, this.canvasRef.current.clientHeight)
  }

  redraw () {
    this.clear()

    for (const stroke of this.props.drawingStrokes) {
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
    const rect = this.canvasRef.current.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left) / (rect.right - rect.left) * this.canvasRef.current.width,
      y: (event.clientY - rect.top) / (rect.bottom - rect.top) * this.canvasRef.current.height
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

    const strokes = this.props.drawingStrokes.concat(stroke)
    this.optimizeStrokes(strokes)
    this.props.onDrawingStrokesUpdate(strokes)

    this.drawStroke(stroke)
    this.setCurrentPosition(to.x, to.y)
  }

  onMouseReleased () {
    this.redraw()
  }

  handleClear () {
    this.clear()
    this.props.onDrawingStrokesUpdate([])
  }

  handleUndo () {
    if (this.props.drawingStrokes.length === 0) { return }

    const strokes = this.props.drawingStrokes
    for (let i = 0; i < 5; i++) {
      strokes.pop()
    }

    this.optimizeStrokes(strokes)
    this.props.onDrawingStrokesUpdate(strokes, this.redraw)
  }

  handleReplay () {
    this.clear()
    const replayTimeouts = []

    for (let i = 0; i < this.props.drawingStrokes.length; i++) {
      replayTimeouts.push(setTimeout(() => this.drawStroke(this.props.drawingStrokes[i]), 10 * i))
    }
  }

  onDownload () {
    const image = this.state.context.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    window.location.href = image
  }

  render () {
    return (
      <div>
        <canvas id='canvas' ref={this.canvasRef} width='400' height='400'>
          Sorry, your browser does not support canvas.
        </canvas>
        <SketchControlBar
          onClear={this.handleClear}
          onUndo={this.handleUndo}
          onSubmit={() => this.props.handleSubmit()}
          // onReplay={this.handleReplay}
          // onDownload={this.onDownload}
        />
      </div>
    )
  }
}
