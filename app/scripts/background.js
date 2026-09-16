loadDebugSetting().catch((error) => console.error("Unable to load debug setting:", error));

browser.runtime.onMessage.addListener(async (message) => {
  log("Received message", message);
  if (message?.type !== "open-channel-tabs" || !Array.isArray(message.urls)) {
    return undefined;
  }

  log("Opening channel tabs", message.urls);
  try {
    const results = await Promise.all(
      message.urls.map((url) =>
        browser.tabs.create({
          url,
          active: false,
          discarded: true
        })
      )
    );

    log("Opened channel tabs", results);
    return { opened: results.length };
  } catch (error) {
    console.error("Unable to open channel tabs:", error);
    throw error;
  }
});
