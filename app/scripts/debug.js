let debugEnabled = false;

function log(...args) {
  if (debugEnabled) {
    console.log("youtube-subs-to-tabs:", ...args);
  }
}

async function loadDebugSetting() {
  const settings = await browser.storage.local.get("debug");
  debugEnabled = settings.debug === true;
  log("Debug logging enabled");
}
