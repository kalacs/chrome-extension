const DELAY = 0;

chrome.runtime.onMessage.addListener(function ({ type }) {
  console.log("Catch event");
  if (type === "LOAD_NOTE") {
    const video = document.querySelector("video");
    const noteUrl = chrome.runtime.getURL("notes/Friends.S01E01.json");
    // remove all existing tracks
    if (video) {
      for (let track of video.textTracks) {
        track.mode = "disabled";
      }
      // inject note as metadata track
      const track = video.addTextTrack("metadata", "VideoNotes");
      track.mode = "showing";
      track.addEventListener("cuechange", () => {
        const cue = track.activeCues[0];
        // render notes
      });
      fetch(noteUrl)
        .then((response) => response.json())
        .then((notes) => {
          // Read all captions into an array
          for (let index = 0; index < notes.length; index++) {
            const {
              startTime,
              endTime,
              payload: { content },
            } = notes[index];
            track.addCue(
              new VTTCue(startTime + DELAY, endTime + DELAY, content)
            );
          }
        });
    }
  }
});
