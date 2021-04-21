export default function SketchControlBar ({ isSubmitted, onClear, onUndo, onSubmit }) {
  return (
    <div>
      <button className='button button-bar' onClick={onClear} id='clear'>Clear</button>
      <button className='button button-bar' id='undo' onClick={onUndo}>Undo</button>
      {isSubmitted
        ? <button className='button button-bar' id='submit' disabled>Waiting for Other Players</button>
        : <button className='button button-bar' id='submit' onClick={onSubmit}>Submit</button>}
      {/* <button id='replay' onClick={props.onReplay}>Replay</button>
      <button id='download' onClick={props.onDownload}>Download</button> */}
    </div>
  )
}
