# Design — Life Task Dashboard

## Visual direction
A clean, friendly dashboard inspired by the provided reference: rounded white cards over a soft purple background, strong visual hierarchy, large digital clock, and compact action controls.

## Layout
- Full-width hero card at the top.
- Two-column desktop grid.
- Focus Timer and Settings on the left.
- Tasks card on the right.
- Quick Links below the focus area.
- Single-column layout on smaller screens.

## Accessibility
- Semantic sections and headings.
- Labels for form inputs.
- Buttons use clear text.
- Live regions announce clock/task updates.
- Sufficient focus styling.

## Data model
Task:
- id
- title
- completed
- createdAt

Quick Link:
- id
- name
- url

LocalStorage keys:
- lifeDashboard.tasks
- lifeDashboard.links
- lifeDashboard.name
- lifeDashboard.theme
- lifeDashboard.duration
