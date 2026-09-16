# Architecture

The extension deliberately keeps DOM access and tab management separate:

1. The popup asks the active tab to collect channel URLs.
2. The content script validates that the active page is YouTube's
   `/feed/channels` route and returns unique canonical channel URLs.
3. The non-persistent background script receives those URLs and calls
   `browser.tabs.create` with `active: false` and `discarded: true`.
4. The popup displays the result or an actionable error.

YouTube is a client-rendered application, so the parser reads the current DOM
at the moment the user presses the button. Scrolling or re-running the action
after more content has loaded is intentionally supported.
