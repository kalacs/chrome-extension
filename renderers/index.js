let DefaultRender;

(async () => {
  const module = await import(
    chrome.runtime.getURL("renderers/DefaultRender.js")
  );
  DefaultRender = module.DefaultRender;
})();

export function createNoteRenderer({ type }) {
  let renderer;
  switch (type) {
    case "default":
    default:
      renderer = new DefaultRender();
      break;
  }
  return renderer;
}
