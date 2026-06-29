# FED WATCH

FED WATCH is a single-page React app that displays a live feed of mock federal economic data in a dark, professional terminal-style interface.

## What it does

- Normalizes mixed economic feed data before rendering
- Supports case-insensitive, partial source filtering
- Highlights inflation spikes when values jump by more than 5% compared with the previous inflation entry
- Refreshes the feed every 2 seconds with live updates
- Uses a memoized row component to reduce unnecessary re-renders

## Tech stack

- React
- Vite
- CSS

## Run locally

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the development server
   ```bash
   npm run dev
   ```
3. Open the local Vite URL in your browser

## Notes

The project uses mock data and is designed as a UI prototype for monitoring economic signals in a fast-moving feed.
