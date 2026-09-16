const FEED_PATH = "/feed/channels";
const YOUTUBE_ORIGINS = new Set([
  "https://youtube.com",
  "https://www.youtube.com"
]);

function getChannelUrls() {
  log("Collecting channel URLs", {
    href: location.href,
    pathname: location.pathname
  });
  if (location.pathname !== FEED_PATH || !YOUTUBE_ORIGINS.has(location.origin)) {
    throw new Error(browser.i18n.getMessage("notOnFeed"));
  }

  const urls = new Set();
  for (const anchor of document.querySelectorAll("a[href]")) {
    const link = new URL(anchor.href, location.href);
    if (
      YOUTUBE_ORIGINS.has(link.origin) &&
      (link.pathname.startsWith("/channel/") || link.pathname.startsWith("/@"))
    ) {
      link.search = "";
      link.hash = "";
      urls.add(link.href);
    }
  }

  const channelUrls = [...urls];
  log("Collected channel URLs", channelUrls);
  return channelUrls;
}

browser.runtime.onMessage.addListener(async (message) => {
  if (message?.type !== "collect-channels") {
    return undefined;
  }

  await loadDebugSetting();
  log("Received collect request");
  try {
    return { urls: getChannelUrls() };
  } catch (error) {
    console.error("Unable to collect channel URLs:", error);
    throw error;
  }
});
