[![Windows Build](https://github.com/xyloblonk/lightweight-browser/actions/workflows/windows-build.yml/badge.svg)](https://github.com/xyloblonk/lightweight-browser/actions/workflows/windows-build.yml)

# Lightweight Browser
A blazing-fast, super-light Chromium-based browser using under 300MB RAM built for low-end PCs.

## Demo Website
There is a demo website but it does not function as a browser. It just simply shows what the app looks like.
https://xyloblonk.github.io/lightweight-browser/
![Windows Task Manager Demo](https://github.com/xyloblonk/lightweight-browser/blob/main/readme/img/image_2025-06-30_234811949.png?raw=true)
![App Demo Image](https://github.com/xyloblonk/lightweight-browser/blob/main/readme/img/image_2025-06-30_235150397.png?raw=true)

## Why I Made This
I got tired of browsers eating up all my resources, especially when gaming on low-end systems. So I built a no-bloat, privacy-minded browser that doesn’t sacrifice developer tools, localhost support, or modern features but still keeps your system snappy and secure.

## Why this browser?
If you’re tired of browsers that:

- Devour your RAM and GPU resources

- Fill your pages with ads, trackers, and bloat

- Fail to run smoothly on integrated or older GPUs

- Don’t respect your privacy or time

This browser is your no-nonsense, fast alternative that puts performance and privacy first with gaming-friendly resource management.

## Features
### Core
- Chromium-based for wide compatibility and modern web standards

- Under 300MB RAM usage even with multiple tabs open

- Tabs supported with smooth switching via Electron BrowserViews

- Dark mode injected into every webpage via custom CSS

- Built-in AdBlocker & SponsorBlock integration using ghostery adblocker and custom SponsorBlock injection for YouTube videos

- DuckDuckGo as default search engine for privacy and reduced tracking

- Smart URL input: navigates directly or searches via DuckDuckGo

- LocalStorage-based form caching to keep you logged in across sessions (implemented on a per-site basis)

- GPU optimizations: disables unnecessary GPU usage to boost FPS on iGPUs and low-end graphics hardware

### Technical
- Electron IPC architecture separating UI (renderer) and main browser logic

- Dynamic tab management: create, switch, and navigate tabs seamlessly

- SponsorBlock API integration skips sponsored segments on YouTube automatically

- CSS injection for dark mode and reduced UI clutter on sites

- Graceful fallback on adblocking failures silently logs errors without breaking pages

## Installation & Usage

You need to download NodeJS from https://nodejs.org/en/download (You should see "Or get a prebuilt Node.js® for Windows running a x64 architecture.", just click download .msi and run it. NodeJS is safe and used by governments, schools, banks, even Google and Microsoft.) Once you've done that do the following:

- Download this repo

- Run in the root directory:
```
npm install
```
Wait until it finishes and run:
```
npm start
```
That’s it. Your lightweight, speedy browser launches ready to roll.

## Planned Features
- Native installer and auto-updater

- Enhanced UI and theming options

- Extended custom blocklists and user script support

- Better localStorage management for session persistence

## Contribution
Contributions and forks are welcome! Feel free to open issues or submit merge requests to improve performance, add features, or polish the UI.

If you don't want to develop leaving a star means a lot 💖

## License
Open source for personal and non-commercial use.
Please contact me if you intend to use this project commercially.
