# Daily Tasks Time Improvements - TODO

## Approved Plan Steps (Breakdown) - Steps 6-10:

### 1. ✅ Create this TODO.md file (Current)

### 2. ✅ Add UI elements for validation
### 3. ✅ Add helper functions in JS
### 4. ✅ Update task object structure
### 5. ✅ Modify addTask() and handlers

### 6. ⬜ Update renderTasks()
- Migrate existing tasks (if task.time → internalTime + compute displayTime)
- Display task.displayTime instead of task.time in task-time div

### 7. ⬜ Update sortTasks() and checkTaskReminders()
- sortTasks(): Use task.internalTime for time comparisons
- checkTaskReminders(): Use task.internalTime === currentTime

### 8. ✅ Add real-time validation
- Event listeners: input/blur on #taskTimeInput, #editTaskTime, #quickTaskTime
- Toggle .valid/.invalid classes + call showError/clearError on blur

### 9. ✅ Update modals (edit/quick add)
- Ensure real-time validation styling applies on modal open

### 10. ⬜ Test & attempt_completion
- Test: add/edit without time → blocks + red border/error "Please select a time for the task."
- Test: 12h display (e.g., 1:30 م without leading zero), sorting, reminders (Egypt GMT+2)
- Mobile/desktop smoothness
- Update TODO.md all ✅, progress 10/10

**Progress: 5/10 → Target 10/10**
