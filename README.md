# SpotiDrop

A modern Spotify track downloader built with vanilla JavaScript, featuring a premium user experience, real-time download tracking, and an elegant glassmorphism-inspired interface.

SpotiDrop enables users to retrieve track information from Spotify URLs and download tracks through a fast, responsive, and visually refined web application.

---

## Overview

SpotiDrop was developed to provide a seamless music downloading experience through a clean frontend architecture. The application integrates with external APIs to fetch track metadata, displays detailed song information, manages download progress, and maintains a local download library for easy access.

The project focuses on modern UI/UX principles, performance, and responsiveness while remaining lightweight and framework-independent.

---

## Key Features

### Music Downloading
- Fetch track information directly from Spotify URLs
- Download tracks in MP3 format
- Automatic metadata retrieval
- Album artwork preview

### Download Management
- Real-time progress tracking
- Active download queue
- Download completion notifications
- Download status monitoring

### User Experience
- Modern glassmorphism interface
- Animated mesh background
- Smooth transitions and micro-interactions
- Responsive design across all devices

### Local Library
- Download history persistence using Local Storage
- Quick access to previously downloaded tracks
- One-click re-download functionality
- Automatic history management

---

## Screenshots

Add screenshots of the application here.

### Landing Page

![Landing Page](screenshots/home.png)

### Download Interface

![Download Interface](screenshots/download.png)

### Music Library

![Library](screenshots/library.png)

---

## Technology Stack

| Technology | Purpose |
|------------|----------|
| HTML5 | Application Structure |
| CSS3 | Styling & Animations |
| JavaScript (ES6+) | Application Logic |
| RapidAPI | Spotify Data Integration |
| Local Storage API | Persistent Data Storage |
| Lucide Icons | Modern Icon System |

---

## Project Architecture

```text
SpotiDrop
│
├── index.html
├── style.css
├── app.js
└── README.md
```

### Core Components

#### Frontend Interface
Handles user interaction, URL validation, and dynamic rendering of track information.

#### API Integration
Communicates with external services to retrieve track metadata and download links.

#### Download Manager
Processes downloads, tracks progress, and manages active download states.

#### Local Library System
Stores downloaded tracks locally and provides quick access to download history.

---

## Getting Started

### Prerequisites

- Modern web browser
- Internet connection
- RapidAPI account and API key

### Installation

Clone the repository:

```bash
git clone https://github.com/Shubhamdev21/spotifydownload.git
```

Navigate to the project directory:

```bash
cd spotifydownload
```

Open the project:

```bash
index.html
```

No additional dependencies or build tools are required.

---

## Configuration

The application requires a valid RapidAPI key.

Locate the API configuration inside:

```javascript
app.js
```

Replace:

```javascript
const apiKey = "YOUR_API_KEY";
```

with your own RapidAPI key.

---

## Application Workflow

1. User provides a Spotify track URL.
2. URL validation is performed.
3. Track metadata is fetched through the API.
4. Song details are displayed.
5. Download process is initiated.
6. Progress is tracked in real time.
7. Download history is stored locally.

---

## Design Highlights

The interface was designed with a focus on modern web aesthetics:

- Glassmorphism components
- Dynamic gradient lighting
- Floating mesh background effects
- Premium typography
- Responsive dashboard layout
- Smooth animation system

---

## Performance Considerations

- Lightweight frontend architecture
- No external frameworks
- Local caching through browser storage
- Optimized DOM updates
- Efficient download handling

---

## Future Enhancements

- Playlist downloading support
- Dark/Light theme switcher
- Download statistics dashboard
- Search functionality
- User authentication
- Cloud-based download history
- Audio preview support

---

## Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

```bash
Fork the repository
Create a feature branch
Commit your changes
Push to your fork
Open a Pull Request
```

Please ensure code quality and maintain consistency with the existing project structure.

---

## Author

### Shubham Dev

Full Stack Web Developer

GitHub:
https://github.com/Shubhamdev21

LinkedIn:
(Add your LinkedIn profile)

---

## License

This project is released for educational and learning purposes.

---

## Disclaimer

SpotiDrop is intended solely for educational and research purposes.

The developers do not host, store, or distribute copyrighted content. Users are responsible for ensuring compliance with Spotify's Terms of Service and all applicable copyright laws within their jurisdiction.

---

<div align="center">

### If you found this project useful, consider giving it a star ⭐

Built with passion for web development and user experience.

