import React from 'react'

export default function SketchControlBar(props) {
    return (
        <div>
            <button onClick={props.onClear} id="clear">Clear</button>
            <button id="undo" onClick={props.onUndo} >Undo</button>
            <button id="submit">Submit</button>
            <button id="replay" onClick={props.onReplay} >Replay</button>
            <button id="download">Download</button>
        </div>
    )
}
