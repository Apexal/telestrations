import React, { Component } from 'react'
import SketchControlBar from './SketchControlBar'

/**
 * Manages the drawing / exporting operations on top of the canvas object.
 */

export default class SketchPadRenderer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPosition: { x: -1, y: -1 },
            width: 2,
            color: 'black',
            strokes: [],
            offset: { x: 0, y: 0 },

            context: null
        };

        this.canvas = React.createRef();
    
        this.clear = this.clear.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onUndo = this.onUndo.bind(this);
        this.onReplay = this.onReplay.bind(this);
        this.onDownload = this.onDownload.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.drawStroke = this.drawStroke.bind(this);
        
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        this.onMouseReleased = this.onMouseReleased.bind(this);
        this.onCanvasResized = this.onCanvasResized.bind(this);
    }

    componentDidMount() {
        this.setState({ 
            offset: { x: this.canvas.current.offsetLeft || 0, y: this.canvas.current.offsetTop || 0 },
            context: this.canvas.current.getContext('2d')
        });
        
        window.addEventListener("mousedown", this.onMouseClick);
        window.addEventListener("mouseup", this.onMouseReleased);
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("resize", this.onCanvasResized);
    }

    drawStroke(stroke) {
        let ctx = this.state.context;

        ctx.beginPath();
        ctx.moveTo(stroke.from.x - this.state.offset.x, stroke.from.y - this.state.offset.y);
        ctx.lineTo(stroke.to.x - this.state.offset.x, stroke.to.y - this.state.offset.y);
        ctx.lineWidth = stroke.options.width;
        ctx.strokeStyle = stroke.options.color;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.closePath();

        this.setState({ context: ctx });
    }

    clear() {
        let ctx = this.state.context;
        ctx.clearRect(0, 0, this.canvas.current.clientWidth, this.canvas.current.clientHeight);
        this.setState({ context: ctx });
    }

    setCurrentPosition(x, y) {
        this.setState({ currentPosition: { x, y } });
    }

    onMouseClick({ clientX, clientY }) {
        this.setCurrentPosition(clientX, clientY);
    }

    onMouseMove({ buttons, clientX, clientY }) {
        if(buttons !== 1) return;

        const stroke = {
            from: { ...this.state.currentPosition },
            to: { x: clientX, y: clientY },
            options: { width: this.state.width, color: this.state.color }
        };

        const strokes = this.state.strokes.concat(stroke);
        this.setState({ strokes });

        this.drawStroke(stroke);
        this.setCurrentPosition(clientX, clientY);
    }

    onMouseReleased() {
        this.clear();
        
        for(const stroke of this.state.strokes) {
            this.drawStroke(stroke);
        }
    }

    onCanvasResized() {
        const dx = this.canvas.current.offsetLeft;
        const dy = this.canvas.current.offsetTop;

        this.setState({ offset: { x: dx, y: dy } });
    }

    onClear() {
        this.clear();
        this.setState({ strokes: [] });
    }

    onUndo() {
        if(this.state.strokes.length <= 0)
            return;
        
        let strokes = this.state.strokes;
        strokes.pop();
        this.setState({ strokes });
    }

    onReplay() {
        this.clear();
        let replayTimeouts = [];
        
        for (let i = 0; i < this.state.strokes.length; i++) {
            replayTimeouts.push(setTimeout(() => this.drawStroke(this.state.strokes[i]), 10 * i));
        }
    }

    onSubmit() {

    }

    onDownload() {
        const image = this.state.context.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        window.location.href = image;
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvas} width="400" height="400">
                    Sorry, your browser does not support canvas.
                </canvas>
                <SketchControlBar onClear={this.onClear} onUndo={this.onUndo} onReplay={this.onReplay} onSubmit={this.onSubmit} onDownload={this.onDownload} />
            </div>
        )
    }
}
