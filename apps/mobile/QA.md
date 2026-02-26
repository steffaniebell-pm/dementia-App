# Mobile QA Checklist

Use this checklist for quick regression validation after UI or flow updates.

## Quick Start

- Run app: `npx expo start --web --port 8090 --clear`
- Open: `http://localhost:8090`
- Validate both roles: Patient and Caregiver

---

## Patient QA (5 minutes)

### 1) Home
- **Pass**: `Next Action`, weather line, greeting panel, feature tiles, and `Today's Summary` cards all render.
- **Pass**: Tile taps navigate to correct screens.
- **Fail**: Blank sections, overlapping cards, or broken tile navigation.

### 2) Calendar
- **Pass**: Date card, `Next up`, and `Today's schedule` cards display.
- **Pass**: Empty-state card appears when no events exist.
- **Fail**: Missing time/type labels or broken scrolling.

### 3) Medicines (List)
- **Pass**: Overview card shows active count and next dose.
- **Pass**: Each medicine card shows icon, name, dose/time, status chip.
- **Fail**: Missing medicine data or malformed status labels.

### 4) Medicine Now
- **Pass**: Due state shows medicine details + actions (`Taken`, `Snooze`, `Skip`).
- **Pass**: No-due state shows friendly informational card.
- **Pass**: Action press shows toast feedback.
- **Fail**: Buttons do nothing or no toast appears.

### 5) Games + Play
- **Pass**: Games overview and game-type cards render.
- **Pass**: `Play Today` and `Start` open session screen.
- **Pass**: `Finish Session` updates reward text and shows toast.
- **Fail**: Reward/status does not update after finishing.

### 6) Wellness + Session
- **Pass**: Wellness session cards render and open player.
- **Pass**: Player status updates across `Start`/`Pause`/`Stop`.
- **Pass**: `Stop` shows completion toast.
- **Fail**: Status text does not change with controls.

### 7) Nutrition + Recipe
- **Pass**: Nutrition overview, tip, and recipe cards render.
- **Pass**: `Open recipe` navigates correctly.
- **Pass**: Ingredients and steps lists render with proper formatting.
- **Fail**: Recipe screen missing list content or navigation breaks.

---

## Caregiver QA (5 minutes)

### 1) Dashboard
- **Pass**: Overview cards show missed reminders, adherence, next appointment.
- **Pass**: Action tiles navigate to Medicines, Calendar, Reports, Settings.
- **Fail**: Card values missing or navigation fails.

### 2) Manage Medicines
- **Pass**: Add medication works and list updates.
- **Pass**: Remove medication prompts confirmation and supports Undo.
- **Pass**: Clear all prompts confirmation and supports Undo.
- **Fail**: No confirmation, no undo, or stale list state.

### 3) Manage Calendar
- **Pass**: Add event works and list updates.
- **Pass**: Remove and clear all support confirm + Undo.
- **Fail**: Event list not refreshing or undo not restoring.

### 4) Reports
- **Pass**: Summary cards render and summary text exists.
- **Pass**: `Copy Summary` copies text and shows toast.
- **Fail**: Missing summary text or copy action fails.

### 5) Settings
- **Pass**: PIN set/update/remove works.
- **Pass**: Quiet hours and reminder tone update with feedback.
- **Pass**: Emergency contact saves successfully.
- **Pass**: Pairing and Emergency Info routes open.
- **Pass**: `Lock App` returns to auth gate.
- **Fail**: Any setting action does not persist or feedback missing.

### 6) Pairing
- **Pass**: Generate code updates current code display.
- **Pass**: Accept current code updates status message.
- **Pass**: Dignity access toggle updates state.
- **Fail**: Code/state text never changes.

### 7) Emergency Info
- **Pass**: Screen loads with overview content.
- **Fail**: Blank render or crash.

---

## Release Gate (Minimum)

- `npx tsc --noEmit` returns `tsc_exit=0`
- No blank screens
- All primary role navigation paths work
- No blocking runtime errors in terminal
