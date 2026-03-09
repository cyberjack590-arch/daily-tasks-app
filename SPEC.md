# Arabic Habit Tracker - Specification Document

## 1. Project Overview

**Project Name:**追踪 العادات (Habit Tracker)  
**Project Type:** Single Page Web Application  
**Core Functionality:** A productivity dashboard for tracking daily habits with RTL Arabic interface  
**Target Users:** Arabic-speaking individuals seeking to build and track daily habits

---

## 2. UI/UX Specification

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Logo, Year, Month, Habit Count)                   │
├─────────────────────────────────────────────────────────────┤
│  DAILY ACHIEVEMENT SECTION                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Title: مؤشر الإنجاز اليومي                        │    │
│  │  [████████████████░░░░░░░] 65%                      │    │
│  │  التقدم اليومي | عادات تمت | عادات لم تتم          │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  HABITS TABLE                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  عنوان: عاداتي اليومية                              │    │
│  │  [+ إضافة عادة]                                      │    │
│  │  ┌────┬──────────┬────────┬────────────────────┐   │    │
│  │  │Icon│ Habit    │ Progress│ Actions           │   │    │
│  │  ├────┼──────────┼────────┼────────────────────┤   │    │
│  │  │⏰  │استيقاظ 5:│ 4/7    │ ✏️ 🗑️            │   │    │
│  │  │🚿  │دوش بارد  │ 5/7    │ ✏️ 🗑️            │   │    │
│  │  └────┴──────────┴────────┴────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  WEEKLY GRID                                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  عنوان: الأسبوع                                     │    │
│  │  س   ح   ن   ث   ر   خ   ج  (RTL days)              │    │
│  │  ☐   ☑   ☐   ☑   ☑   ☐   ☑   (Checkboxes per habit)│    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  FOOTER (Statistics, Reset, Dark Mode)                    │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints
- **Desktop:** > 1024px (full layout)
- **Tablet:** 768px - 1024px (stacked sections)
- **Mobile:** < 768px (single column, scrollable grid)

### Visual Design

#### Color Palette

**Light Mode:**
- `--bg-primary: #f8fafc` (main background)
- `--bg-secondary: #ffffff` (cards)
- `--bg-tertiary: #f1f5f9` (table rows)
- `--text-primary: #1e293b` (headings)
- `--text-secondary: #475569` (body text)
- `--text-muted: #94a3b8` (hints)
- `--accent-blue: #3b82f6` (primary accent)
- `--accent-soft: #dbeafe` (soft blue)
- `--success: #22c55e` (completed)
- `--warning: #f59e0b` (pending)
- `--danger: #ef4444` (delete)
- `--border: #e2e8f0`

**Dark Mode:**
- `--bg-primary: #0f172a`
- `--bg-secondary: #1e293b`
- `--bg-tertiary: #334155`
- `--text-primary: #f1f5f9`
- `--text-secondary: #cbd5e1`
- `--text-muted: #64748b`
- `--accent-blue: #60a5fa`
- `--accent-soft: #1e3a5f`
- `--success: #4ade80`
- `--warning: #fbbf24`
- `--danger: #f87171`
- `--border: #334155`

#### Typography
- **Font Family:** 'Cairo', 'Noto Sans Arabic', sans-serif
- **Heading (H1):** 28px, font-weight: 700
- **Heading (H2):** 22px, font-weight: 600
- **Body:** 16px, font-weight: 400
- **Small:** 14px, font-weight: 400
- **Numbers:** 'Cairo', monospace fallback

#### Spacing System
- `--space-xs: 4px`
- `--space-sm: 8px`
- `--space-md: 16px`
- `--space-lg: 24px`
- `--space-xl: 32px`
- `--space-2xl: 48px`

#### Visual Effects
- **Border Radius:** 12px (cards), 8px (buttons), 6px (inputs)
- **Box Shadow (Light):** 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
- **Box Shadow (Elevated):** 0 10px 15px -3px rgba(0,0,0,0.1)
- **Transitions:** all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

### Components

#### Header
- Fixed height: 80px
- Flexbox layout with space-between
- Year: Dynamic (2026)
- Month: Arabic name with dropdown
- Habit count box: Rounded badge with number

#### Daily Achievement Card
- Background: gradient from accent-soft to white
- Progress bar: 12px height, rounded, animated fill
- Stats row: 3 columns with icons

#### Habits Table
- Striped rows (alternating bg-tertiary)
- Editable inline inputs
- Icon + Text + Progress + Actions columns
- Hover effects on rows

#### Weekly Grid
- 7 columns for days (RTL: س-ح-ن-ث-ر-خ-ج)
- Rows for each habit
- Circular checkboxes with check animation
- Current day highlighted

#### Buttons
- Primary: accent-blue bg, white text
- Secondary: transparent, accent-blue text
- Danger: danger color
- Icon buttons: 40x40px, rounded

#### Modal (Add/Edit Habit)
- Centered overlay
- Backdrop blur
- Input fields for icon, name
- Save/Cancel buttons

---

## 3. Functionality Specification

### Core Features

1. **Dynamic Header**
   - Display current Gregorian year (2026)
   - Display current month in Arabic
   - Show habit count with label "عدد العادات"

2. **Daily Achievement Indicator**
   - Calculate: (completed habits / total habits) × 100
   - Animated progress bar
   - Show three stats:
     - التقدم اليومي (Today's Progress)
     - عادات تمت (Completed Habits)
     - عادات لم تتم (Uncompleted Habits)
   - Updates in real-time when checkboxes change

3. **Habits Management**
   - Default habits on first load:
     - ⏰ استيقاظ 5:00
     - 🚿 دوش بارد
     - 🕌 صلاة 5x
     - 📖 قراءة 5 صفحات
   - Add new habit (icon + name)
   - Edit existing habit
   - Delete habit with confirmation
   - Drag to reorder (optional)

4. **Weekly Grid**
   - Display current week (Sun-Sat in RTL order)
   - Day headers: س (الأحد), ح (الاثنين), ن (الثلاثاء), ث (الأربعاء), ر (الخميس), خ (الجمعة), ج (السبت)
   - Checkboxes for each habit × day combination
   - Checkbox states:
     - Unchecked: empty circle
     - Checked: filled circle with checkmark
   - Visual indication for today

5. **Data Persistence (LocalStorage)**
   - Save: habits array, completions object, dark mode preference
   - Auto-save on every change
   - Load on page refresh

6. **Monthly Reset**
   - Button to clear all weekly checkmarks
   - Confirmation dialog
   - Reset to new month

7. **Dark Mode Toggle**
   - Toggle button in footer
   - Persists preference in localStorage
   - Smooth transition between modes

8. **Statistics Section**
   - Total habits count
   - Completed this week
   - Completion percentage
   - Current streak (optional)

### User Interactions

1. **Adding a Habit:**
   - Click "+ إضافة عادة" button
   - Modal opens with icon picker + text input
   - Save → habit added to list + grid

2. **Editing a Habit:**
   - Click edit icon (✏️)
   - Modal opens with pre-filled data
   - Save → updates reflect everywhere

3. **Deleting a Habit:**
   - Click delete icon (🗑️)
   - Confirmation prompt
   - Confirm → removes habit + related checkmarks

4. **Checking Daily Progress:**
   - Click checkbox in weekly grid
   - Progress bar animates
   - Stats update immediately
   - Data saved to localStorage

5. **Toggling Dark Mode:**
   - Click moon/sun icon
   - Theme transitions smoothly
   - Preference saved

### Edge Cases
- No habits: Show empty state message
- All habits completed: Show celebration animation
- First visit: Load default habits
- LocalStorage unavailable: Show warning, use in-memory

---

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] RTL layout works correctly
- [ ] Arabic font (Cairo) loads and displays
- [ ] Dark mode toggle changes all colors smoothly
- [ ] Progress bar animates on value change
- [ ] Checkboxes have smooth check animation
- [ ] Responsive: works on mobile (375px), tablet (768px), desktop (1440px)
- [ ] Cards have proper shadows and rounded corners

### Functional Checkpoints
- [ ] Year displays correctly (2026)
- [ ] Month displays in Arabic
- [ ] Habit count updates when adding/deleting
- [ ] Progress percentage calculates correctly
- [ ] Default habits load on first visit
- [ ] Add/Edit/Delete habits works
- [ ] Checkboxes toggle and persist
- [ ] Weekly grid reflects checkbox states
- [ ] Data persists after page refresh
- [ ] Monthly reset clears checkmarks
- [ ] Dark mode preference persists

### Performance
- [ ] Page loads under 2 seconds
- [ ] Animations run at 60fps
- [ ] No layout shifts after load

---

## 5. Technical Implementation

### File Structure
```
index.html    - Single HTML file with embedded CSS and JS
```

### Data Schema (LocalStorage)
```
javascript
{
  habits: [
    { id: 1, icon: "⏰", name: "استيقاظ 5:00" }
  ],
  completions: {
    "2026-01-15": { 1: true, 2: false } // date: { habitId: completed }
  },
  darkMode: false,
  currentMonth: "يناير"
}
```

### Arabic Month Names
- يناير, فبراير, مارس, أبريل, مايو, يونيو
- يوليو, أغسطس, سبتمبر, أكتوبر, نوفمبر, ديسمبر

### Day Names (RTL)
- س (الأحد/Sunday)
- ح (الاثنين/Monday)
- ن (الثلاثاء/Tuesday)
- ث (الأربعاء/Wednesday)
- ر (الخميس/Thursday)
- خ (الجمعة/Friday)
- ج (السبت/Saturday)
