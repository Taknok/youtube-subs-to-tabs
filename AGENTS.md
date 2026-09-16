# Agent guide

## Repository purpose

This repository contains a Firefox WebExtension that reads the YouTube
subscriptions channel feed and opens each discovered channel in a discarded
background tab.

## Layout

- `app/`: extension source and manifest
- `app/scripts/`: popup, content, and background logic
- `app/_locales/`: localized extension strings
- `docs/`: implementation notes and future decisions

Keep browser-specific behavior in the appropriate extension context:
DOM parsing belongs in the content script, while tab creation belongs in the
background script.

## Validation

Run `npm run lint` for the available static checks. Load the `app/` directory
as a temporary add-on in Firefox for browser-level verification.
