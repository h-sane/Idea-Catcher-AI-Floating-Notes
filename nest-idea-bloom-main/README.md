# 📘 IdeaNest – Smart Idea Organizer

*IdeaNest* is a powerful single-platform application designed to help users quickly capture, organize, and manage their ideas with the help of voice-to-text, NLP-powered suggestions, team collaboration, and export functionality.

---

## 🚀 Core Features (MVP)

### 📝 Quick Note Capture
- Minimal UI for instant text or voice-to-text input.
- *Pin important ideas* for quick access.

### 🗂 Manual & Auto Categorization
- Tag ideas as *Work, **Personal, **Project, **Inspiration*, etc.
- Use NLP to *automatically categorize* ideas via a dedicated button.

### 📜 Idea Feed
- Chronological or category-based view.
- Searchable by keyword.
- *Edit/Delete/PDF Export/Pin* each idea.

### ⏰ Smart Reminders
- Time-based or location-based reminders.
- Context-aware NLP reminders (e.g., "Email the client" → Suggest reminder for tomorrow morning).
- *Calendar integration* for scheduling.

### 🎤 Voice Notes + Transcription
- Record voice input.
- Speech-to-text button for real-time transcription.

### 👥 Team Collaboration
- Collaborate with team members.
- Shared ideas visible to all collaborators.
- Roles: *Owner, **Member*

### 📊 Creativity Index
- NLP-powered analysis to assign a *Creativity Score (0–100)*.

### 📤 Export Options
- Export selected or all ideas as:
  - *Notion Cards* (via Notion API)
  - *Google Docs* (via Google Drive API)
  - *PDF* (via jsPDF or Python’s reportlab)
  - *Downloadable on local device*

---

## 📎 Floating Widget (System-Wide)

A draggable, collapsible widget that floats over all apps.

### ✨ Features
- *New Idea Capture*  
  Instantly input or record voice for new ideas without leaving your current app.
- *View Past Ideas*  
  Mini scrollable feed inside the widget for recent/pinned ideas.
- *Smart Task Reminder*  
  NLP-powered suggestions for task-based reminders.

### 🔧 Widget Requirements
- Floats across all apps.
- Draggable and snaps to screen edges.
- Minimal, aesthetic, and collapsible.
- Syncs instantly with the main app.

### 🧪 Bonus Functionality
- *Enable Widget via Button* (No keyboard shortcut like Ctrl+Shift+I).
- *Quick Tagging* directly inside the widget (Work, Personal, etc.).

---

## 📚 Additional Functionalities

### 📥 PDF Export
- Each idea (new or existing) includes a *Download as PDF* option.
- Includes idea, description, timestamp.
- Instantly downloads to local device.

### 🤖 NLP-Assisted Features
- *Assist Button:* Automatically generates a detailed description using NLP.
- *Auto-Tag Button:* Uses NLP to assign the best-matching category to the idea.

---

## 🔐 User Management with Supabase
- User accounts and team collaboration handled via *Supabase*.
- Handles:
  - User authentication
  - Team-based access
  - Real-time syncing of ideas

---

## 🧱 Tech Stack

| Layer     | Tech                        |
|-----------|-----------------------------|
| Frontend  | React or Native (Web/Android) |
| Backend   | Flask / Node.js             |
| Database  | Firebase / Supabase / MongoDB |
| NLP       | spaCy, Hugging Face (BERT)  |
| Speech    | Google Speech-to-Text       |
| Export    | Notion API, Google Drive API, jsPDF / reportlab |

---

## ✅ Feature Checklist

- [x] Text and voice idea capture
- [x] NLP-generated descriptions and tags
- [x] Floating widget overlay with quick input & feed
- [x] PDF export with timestamp
- [x] Real-time reminders with calendar
- [x] Team collaboration and sharing
- [x] Creativity index for ideas
- [x] Edit/Delete/Pin options for each idea
- [x] Sync with Supabase backend
- [x] PDF download works for *both new and existing ideas*

---

## 🔄 To Do / Future Enhancements

- [ ] Add AI idea expansion suggestions
- [ ] Offline sync capability
- [ ] Voice command navigation

---

## 🧠 How to Use

1. *Sign up/Login* to start saving your ideas.
2. Click on *“Enable Widget”* to activate the system-wide floating bubble.
3. Use the *microphone icon* to convert your speech to ideas.
4. Tap the *Assist button* for NLP-generated idea descriptions.
5. Tag ideas manually or click *Auto-Tag* for smart suggestions.
6. Set reminders using *Smart Task Reminder* inside the widget.
7. Export any idea as a *PDF* with a single click.
8. Collaborate with your team in shared spaces.

---

## 📎 License

MIT License

---

Feel free to contribute to *IdeaNest* by opening issues or submitting pull requests. Let's make idea capturing smarter and more intuitive!
