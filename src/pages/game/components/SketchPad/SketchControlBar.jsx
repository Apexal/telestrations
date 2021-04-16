export default function SketchControlBar ({ onClear, onUndo, onSubmit }) {
  return (
    <div>
      <button onClick={onClear} id='clear'>Clear</button>
      <button id='undo' onClick={onUndo}>Undo</button>
      <button id='submit' onClick={onSubmit}>Submit</button>
      {/* <button id='replay' onClick={props.onReplay}>Replay</button>
      <button id='download' onClick={props.onDownload}>Download</button> */}
    </div>
  )
}
