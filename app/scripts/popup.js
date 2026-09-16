const openButton = document.querySelector("#open-channels");
const debugCheckbox = document.querySelector("#debug");
const status = document.querySelector("#status");

function setStatus(message) {
  status.textContent = message;
}

function getMessageWithValue(messageName, placeholder, value) {
  return browser.i18n
    .getMessage(messageName)
    .replace(`$${placeholder}$`, String(value));
}

async function initialize() {
  await loadDebugSetting();
  debugCheckbox.checked = debugEnabled;
  log("Popup initialized");
}

debugCheckbox.addEventListener("change", async () => {
  debugEnabled = debugCheckbox.checked;
  await browser.storage.local.set({ debug: debugEnabled });
  log("Debug logging changed", debugEnabled);
});

openButton.addEventListener("click", async () => {
  log("Open channel tabs clicked");
  openButton.disabled = true;
  setStatus(browser.i18n.getMessage("working"));

  try {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true
    });
    log("Active tab", tab);
    const response = await browser.tabs.sendMessage(tab.id, {
      type: "collect-channels"
    });
    log("Collected channels", response);
    const result = await browser.runtime.sendMessage({
      type: "open-channel-tabs",
      urls: response.urls
    });
    log("Background response", result);

    setStatus(getMessageWithValue("opened", "count", result.opened));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Unable to read or open channels:", error);
    setStatus(getMessageWithValue("error", "message", message));
  } finally {
    openButton.disabled = false;
  }
});

initialize().catch((error) => {
  console.error("Unable to initialize popup:", error);
});
