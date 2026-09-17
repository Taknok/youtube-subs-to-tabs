const openButton = document.querySelector("#open-channels");
const debugCheckbox = document.querySelector("#debug");
const openVideosCheckbox = document.querySelector("#open-videos");
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
  const settings = await browser.storage.local.get("openVideos");
  openVideosCheckbox.checked = settings.openVideos === true;
  log("Popup initialized");
}

debugCheckbox.addEventListener("change", async () => {
  debugEnabled = debugCheckbox.checked;
  await browser.storage.local.set({ debug: debugEnabled });
  log("Debug logging changed", debugEnabled);
});

openVideosCheckbox.addEventListener("change", async () => {
  await browser.storage.local.set({ openVideos: openVideosCheckbox.checked });
  log("Open videos setting changed", openVideosCheckbox.checked);
});

function getTargetUrls(urls) {
  if (!openVideosCheckbox.checked) {
    return urls;
  }

  return urls.map((url) => {
    const channelUrl = new URL(url);
    channelUrl.pathname = `${channelUrl.pathname.replace(/\/$/, "")}/videos`;
    return channelUrl.href;
  });
}

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
    const targetUrls = getTargetUrls(response.urls);
    log("Target channel URLs", targetUrls);
    const result = await browser.runtime.sendMessage({
      type: "open-channel-tabs",
      urls: targetUrls
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
