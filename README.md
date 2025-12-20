# 📝 NotesApp - Real-time Firebase Cloud Notes

A modern, cross-platform note-taking application built with **React Native (Expo)** and **Firebase Firestore**. This app allows users to create, read, update, and delete (CRUD) notes in real-time with seamless synchronization across all devices.

## 🚀 Features

* **Cloud Synchronization:** Notes are stored in Firebase Firestore and sync instantly across Web, Android, and iOS.
* **Dark Mode Support:** Fully integrated light and dark themes using React Context API.
* **Real-time Clock:** Dynamic clock display in the header updating every second.
* **Smart Search:** Search through titles and content with a persistent search history (chips).
* **Categorization:** Organize notes by categories like Work, Personal, Ideas, or Others.
* **Responsive Design:** Optimized layouts for both mobile devices and web browsers, including a fixed Floating Action Button (FAB).

## 🛠 Tech Stack

* **Frontend:** React Native (Expo)
* **Backend:** Firebase Firestore
* **Navigation:** React Navigation (Stack)
* **State Management:** React Context API (for Themes and Settings)
* **Icons:** Ionicons (@expo/vector-icons)

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/notesapp.git](https://github.com/your-username/notesapp.git)
    cd notesapp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    Update `src/firebaseConfig.js` with your Firebase project credentials:
    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

4.  **Run the application:**
    ```bash
    npx expo start
    ```
    * Press `w` for Web.
    * Press `a` for Android.
    * Press `i` for iOS.

## 📂 Project Structure

* `src/screens/` — Contains screen components (HomeScreen, CreateNote, etc.).
* `src/storage/` — Firebase Firestore logic and CRUD functions.
* `src/context/` — Context providers for Theme and Settings.
* `firebaseConfig.js` — Firebase SDK initialization.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).