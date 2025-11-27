# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "NotesApp" (or any name you like)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Get Firebase Config

1. In your Firebase project, click the **web icon** (</>) to add a web app
2. Register app with nickname "NotesApp Web"
3. Copy the `firebaseConfig` object shown
4. Open `src/storage/notesStorage.js` in your code
5. Replace the demo config (lines 7-13) with your real config

## Step 3: Enable Firestore

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to you)
5. Click "Enable"

## Step 4: Test the App

1. The Metro bundler will auto-reload
2. Add a note on your phone
3. Open the web version - the note should appear!
4. Add a note on web - it should appear on your phone!

## Security Note

⚠️ Test mode allows anyone to read/write your database. Before deploying:
1. Go to Firestore → Rules
2. Update rules to require authentication or add security

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```
