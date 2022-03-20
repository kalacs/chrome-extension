const VIDEO_NOTE_ROOT_ID = "videoNote-root";

export class DefaultRender {
  constructor(options) {}
  renderNote({ content }) {
    const videoNoteRoot = document.getElementById(VIDEO_NOTE_ROOT_ID);
    const note = document.createElement("h1");
    note.textContent = content;
    note.style.color = "white";
    note.style.position = "absolute";
    note.style.top = "50%";
    note.style.left = "50%";
    note.style.fontSize = "50px";
    note.style.transform = "translate(-50%,-50%)";
    note.style.fontFamily = "sans-serif";
    videoNoteRoot.childNodes.forEach((_, index) => {
      videoNoteRoot.childNodes[index].remove();
    });
    videoNoteRoot.appendChild(note);
  }
}
