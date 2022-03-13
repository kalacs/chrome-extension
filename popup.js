document
  .querySelector("#loadButton")
  .addEventListener("click", function handleClick() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "LOAD_NOTE" });
    });
  });
