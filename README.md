# YouTube Subs to Tabs

A Firefox extension that reads the channels shown on
[`youtube.com/feed/channels`](https://www.youtube.com/feed/channels) and opens
each channel page in a new discarded tab. Discarded tabs are not loaded until
the user activates them.

## Development

Install dependencies and run the extension lint:

```text
npm install
npm run lint
```

## Releases

Releases use Conventional Commits and semantic-release. Pushing to `main`
creates a release when the commit history warrants one, updates the extension
manifest version, builds a ZIP, and attaches it to the GitHub release. The
Firefox publishing workflow signs and submits the add-on using the
`FIREFOX_API_KEY` and `FIREFOX_API_SECRET` repository secrets. A successful
release also fast-forwards `dev` from `main`.

For manual testing in Firefox:

1. Open `about:debugging`.
2. Select **This Firefox**.
3. Choose **Load Temporary Add-on...**.
4. Select [`app/manifest.json`](app/manifest.json).
5. Open the YouTube channel feed, then click the extension button.

The extension only starts when its popup button is pressed. It reports the
number of discovered and opened channels in the popup.

Enable **Enable debug logging** in the popup when troubleshooting. Logs are
prefixed with `youtube-subs-to-tab:`:

- Popup logs are available from the popup's **Inspect** context menu.
- Content-script logs are available in the YouTube page console.
- Background logs are available from the extension's background page in
  `about:debugging`.

## Project structure

- `app/manifest.json`: Firefox Manifest V2 declaration
- `app/scripts/content.js`: extracts channel links from the feed DOM
- `app/scripts/background.js`: creates discarded tabs
- `app/scripts/popup.js`: action popup UI
- `docs/architecture.md`: short implementation notes
