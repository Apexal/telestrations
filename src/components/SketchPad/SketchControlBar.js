import React from 'react'

export default function SketchControlBar(props) {
    return (
        <div>
            <button onClick={props.onClear} id="clear">Clear</button>
            <button id="undo">Undo</button>
            <button id="submit">Submit</button>
            <button id="replay">Replay</button>
            <button id="download">Download</button>
        </div>
    )
}
