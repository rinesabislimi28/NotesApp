# AI Prompt Log

## Session 1 - Initial Implementation
**User Request**: Create notes app with local CRUD, search history, dark mode, tags.

**Actions Taken**:
1. Explored existing React Native/Expo project structure
2. Created implementation plan for search history, tags, and premium UI
3. Added search history functions to `notesStorage.js`
4. Created `TagInput` and `TagFilter` components
5. Updated `SearchBar` with history dropdown
6. Enhanced `NoteItem` with tag badges and icon buttons
7. Integrated features into all screens (Home, Add, Edit)
8. Refined theme colors and shadows

## Session 2 - Bug Fixes
**Issues Encountered**:
- Syntax error in `notesStorage.js` (duplicate imports)
- Require cycle warnings (App.js ↔ screens)
- Deprecated shadow props warning
- SearchBar styles truncated

**Fixes Applied**:
1. Cleaned up `notesStorage.js` - removed duplicates
2. Created `src/context/AppContext.js` to break require cycle
3. Updated all shadow props to `boxShadow`
4. Fixed SearchBar.js syntax error

**Final Status**: ✅ All features implemented, warnings resolved, Metro bundler running

## AI Prompts Used
1. "Generate storage layer with AsyncStorage for notes and search history"
2. "Create TagInput component for adding/removing tags"
3. "Create TagFilter component for filtering notes by tag"
4. "Refactor SearchBar to show search history dropdown"
5. "Update NoteItem to display tags as badges"
6. "Fix require cycle by extracting AppContext"
7. "Replace deprecated shadow props with boxShadow"
