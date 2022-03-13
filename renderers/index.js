let DefaultRender;

(async () => {
  DefaultRender = await import(
    chrome.runtime.getURL("renderers/DefaultRender.js")
  );
})();

export default function createRenderer() {}
