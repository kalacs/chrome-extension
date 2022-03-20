const DELAY = 0;
const VIDEO_NOTE_ROOT_ID = "videoNote-root";
const buildPage = () => {
  if (document.getElementById(VIDEO_NOTE_ROOT_ID)) {
    return;
  }

  const videoNoteOverlay = document.createElement("div");
  videoNoteOverlay.id = VIDEO_NOTE_ROOT_ID;
  videoNoteOverlay.style.position = "fixed";
  videoNoteOverlay.style.display = "block";
  videoNoteOverlay.style.width = "100%";
  videoNoteOverlay.style.height = "100%";
  videoNoteOverlay.style.top = 0;
  videoNoteOverlay.style.left = 0;
  videoNoteOverlay.style.right = 0;
  videoNoteOverlay.style.bottom = 0;
  videoNoteOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  videoNoteOverlay.style.zIndex = 100000;
  videoNoteOverlay.style.cursor = "pointer";
  document.body.appendChild(videoNoteOverlay);
};
let createNoteRenderer;

(async () => {
  const module = await import(chrome.runtime.getURL("renderers/index.js"));
  createNoteRenderer = module.createNoteRenderer;
})();

chrome.runtime.onMessage.addListener(function ({ type }) {
  if (type === "LOAD_NOTE") {
    // build page
    buildPage();
    const video = document.querySelector("video");
    const noteUrl = chrome.runtime.getURL("notes/Friends.S01E01.json");
    let isInitialized = false;

    // remove all existing tracks
    if (video) {
      for (let track of video.textTracks) {
        if (track.label === "VideoNotes") {
          isInitialized = true;
        } else {
          track.mode = "disabled";
        }
      }

      if (isInitialized) {
        document.getElementById(VIDEO_NOTE_ROOT_ID).style.display === "block"
          ? (document.getElementById(VIDEO_NOTE_ROOT_ID).style.display = "none")
          : (document.getElementById(VIDEO_NOTE_ROOT_ID).style.display =
              "block");
        return;
      }

      // inject note as metadata track
      const track = video.addTextTrack("metadata", "VideoNotes");
      track.id = "VideoNote";
      track.mode = "showing";
      track.addEventListener("cuechange", () => {
        const cue = track.activeCues[0];

        if (!cue) {
          return false;
        }

        const note = JSON.parse(cue.text);
        // render notes
        const rendererOptions = {
          type: note.type,
        };
        const renderer = createNoteRenderer(rendererOptions);
        renderer.renderNote(note);
      });
      fetch(noteUrl)
        .then((response) => response.json())
        .then((notes) => {
          // Read all captions into an array
          for (let index = 0; index < notes.length; index++) {
            const { startTime, endTime, payload } = notes[index];
            track.addCue(
              new VTTCue(
                startTime + DELAY,
                endTime + DELAY,
                JSON.stringify(payload)
              )
            );
          }
        });
    }
  }
});
