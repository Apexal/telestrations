import { Component, createRef } from 'react'
import config from '../../../../config'
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
      colorIndex: 0,
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
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.handleToggleWidth = this.handleToggleWidth.bind(this)
    this.handleCycleColor = this.handleCycleColor.bind(this)
  }

  componentDidMount () {
    this.setState({
      context: this.canvasRef.current.getContext('2d')
    })

    this.canvasRef.current.addEventListener('mousedown', this.onMouseClick)
    this.canvasRef.current.addEventListener('mouseup', this.onMouseReleased)
    this.canvasRef.current.addEventListener('mousemove', this.onMouseMove)
    this.canvasRef.current.addEventListener('touchmove', this.onTouchMove)
    this.canvasRef.current.addEventListener('touchstart', this.onTouchStart)
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

  distance (posAX, posAY, posBX, posBY) {
    return Math.sqrt(Math.pow(posAX - posBX, 2) + Math.pow(posAY - posBY, 2))
  }

  samePos (posAX, posAY, posBX, posBY) {
    return posAX === posBX && posAY === posBY
  }

  optimizeStrokes (anyStrokes) {
    for (let i = 2; i < anyStrokes.length; i++) {
      const stroke = anyStrokes[i]
      const prevStroke = anyStrokes[i - 1]
      const prevPrevStroke = anyStrokes[i - 2]

      if (this.distance(prevStroke.fromX, prevStroke.fromY, stroke.fromX, stroke.fromY) <= 2 && this.samePos(prevPrevStroke.toX, prevPrevStroke.toY, prevStroke.fromX, prevStroke.fromY)) {
        anyStrokes.splice(i - 1, 1)
        prevPrevStroke.toX = stroke.fromX
        prevPrevStroke.toY = stroke.fromY
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
    event.preventDefault()
    event.stopPropagation()
    if (event.buttons !== 1 || this.props.isSubmitted) return

    const to = this.getMousePos(event)

    const stroke = {
      fromX: this.state.currentX,
      fromY: this.state.currentY,
      toX: to.x,
      toY: to.y,
      width: this.state.width,
      color: config.colors[this.state.colorIndex]
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

  onTouchMove (event) {
    event.preventDefault()

    const touch = event.touches[0]
    const mouseEvent = new window.MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY,
      buttons: 1
    })
    this.canvasRef.current.dispatchEvent(mouseEvent)
  }

  onTouchStart (event) {
    event.preventDefault()

    const pos = this.getMousePos(event.touches[0])
    this.setCurrentPosition(pos.x, pos.y)
  }

  handleToggleWidth () {
    if (this.state.width === config.thinWidth) {
      this.setState({
        width: config.thickWidth
      })
    } else {
      this.setState({
        width: config.thinWidth
      })
    }
  }

  handleCycleColor () {
    this.setState({
      colorIndex: (this.state.colorIndex + 1) % config.colors.length
    })
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
    const colorButtonStyle = {
      width: this.state.width * 2,
      height: this.state.width * 2,
      backgroundColor: config.colors[this.state.colorIndex]
    }

    return (
      <div>
        <div>
          <button className='button' onClick={this.handleToggleWidth}>{this.state.width === config.thickWidth ? <strong className='thick-stroke'>Thick</strong> : 'Thin'} Stroke</button>
          <button className='button' onClick={this.handleCycleColor}><div className='color-preview' style={colorButtonStyle} /></button>
        </div>
        <canvas id='canvas' ref={this.canvasRef} width='400' height='400'>
          Sorry, your browser does not support canvas.
        </canvas>
        <SketchControlBar
          isSubmitted={this.props.isSubmitted}
          onClear={this.handleClear}
          onUndo={this.handleUndo}
          onSubmit={this.props.onSubmit}
          // onReplay={this.handleReplay}
          // onDownload={this.onDownload}
        />
      </div>
    )
  }
}
