# Notes App Screens

React Native (Expo + TypeScript) project for a notes app UI flow.

## Preview Video

<video src="./assets/preview/preview.webm" controls width="360"></video>

If your Markdown viewer does not render embedded video, open it directly:
[Watch preview video](./assets/preview/preview.webm)

## Preview Images

<img src="assets/preview/preview-1.jpg" width="360">
<img src="assets/preview/preview-2.jpg" width="360">
<img src="assets/preview/preview-3.jpg" width="360">
<img src="assets/preview/preview-4.jpg" width="360">

## Features

- Notes list screen
- Add note screen
- Note details screen
- Expo Router file-based navigation
- Theme support setup

## Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router

## Project Structure

```text
src/
   app/
      _layout.tsx
      index.tsx
      add-notes.tsx
      [noteId].tsx
   constants/
      notes.ts
```

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npx expo start
```

3. Open in Expo Go / Android Emulator / iOS Simulator.
