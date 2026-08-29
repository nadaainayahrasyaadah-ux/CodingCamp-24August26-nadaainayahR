# Requirements — Life Task Dashboard

## Goal
Build a simple client-side dashboard that helps users organize their day.

## Functional Requirements

### Greeting
- Display current time.
- Display current date.
- Display greeting based on local time.
- Allow a custom name in the greeting.

### Focus Timer
- Default duration is 25 minutes.
- Start timer.
- Stop/pause timer.
- Reset timer.
- Allow the user to change duration from 1–120 minutes.
- Persist the selected duration locally.

### Tasks
- Add a task.
- Edit a task.
- Mark a task completed.
- Delete a task.
- Persist tasks with LocalStorage.
- Prevent exact duplicate task names.
- Allow sorting by newest, active, or completed.

### Quick Links
- Add a named website link.
- Open links in a new tab.
- Delete links.
- Persist links with LocalStorage.

### Theme
- Toggle light/dark mode.
- Persist selected theme with LocalStorage.

## Technical Constraints
- HTML for structure.
- CSS for styling.
- Vanilla JavaScript only.
- No frontend framework.
- No backend.
- Browser LocalStorage API.
- Modern browser compatibility.
- Exactly one CSS file in `css/`.
- Exactly one JavaScript file in `js/`.
