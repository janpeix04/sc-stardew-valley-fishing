# Stardew Valley Fishing Replica - Web Project
> [!IMPORTANT]  
> This project was created purely for education purposes as part of a university assignment at the Autonomous University of Barcelona. It replicates the fishing minigame mechanics from *Stardew Valley* to practice web development using modern frameworks. Some assets may be inspired by or sourced from the original game. This project is **not affiliated with or endorsed by ConcernedApe or Stardew Valley**. All assets used are strictly for educational/demo purposes.

## Project Overview
This project is a web-based fishing minigame inspired by *Stardew Valley*, built to demonstrate proficiency in **full-stack development** using **Vue.js** on the frontend and **Node.js (Express)** with **WebSockets** on the backend.

The main goals were:
- Learn Vue.js component-based architecture.
- Understand state management and event handling in a reactive framework.
- Implement real-time communication between client and server using WebSockets.
- Handle asynchronous game mechanics (timers, progress bar, player actions).
- Practice clean code organization and modular design.

## Features
- **Fishing Minigame Mechanics**
    - Cast a line, wait for a fish to bite, and reel in.
    - Fish move dynamically with randomized speed and direction.
    - Catch bar interacts with fish for successful catches.
    - Progress bar tracks success/failure of the fishing attempt.
- **Dynamic Difficulty**
    - Different difficulties control fish speed and catch mechanics.
    - Attempts are tracked and limited per session.
- **Real-Time Updates**
    - WebSocket-based communication ensures smooth updates for fish, catch bar, and progress bar.
- **User Interface Components**
    - Modular Vue.js components.
    - Dynamic text rendering using a custom `Letter` and `Sentence` system.
    - Action buttons with interactive states and cooldowns.
- **Educational Purpose**
    - Implements multiple asynchronous patterns (timeouts, intervals, promises).
    - Demonstrates clean separation of concerns: UI, game logic, and server communication.

## Tech Stack
| **Layer** | **Technology** |
| --------- | -------------- |
| Frontend | Vue.js 3 (Composition & Options API) |
| Backend | Node.js, Express.js |
| Real-Time | WebSocket (ws library) |
| Styling | CSS / Scoped styles |
| Assets | Official Stardew Valley assets used for demonstration purposes (educational only) |

## Project Structure
```php
root/
├─ backend/
│  └─ app.js            # Express + WebSocket server
├─ frontend/
│  ├─ public/              # Static assets
│  ├─ src/
│  │  ├─ components/       # Vue components for UI and game
│  │  ├─ base_components/  # Base reusable components
│  │  ├─ App.vue           # Main app component
│  │  └─ main.js           # Vue entry point
└─ README.md
```

## Getting Started
### Prerequisites
- Node.js >= 16
- npm

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/janpeix04/sc-stardew-valley-fishing.git
    cd sc-stardew-valley-fishing
    ```
2. Install dependencies
    ```bash
    cd frontend/
    npm install
    cd ../backend
    npm install
    ```
### Running the Project
1. Start the backend server:
    ```bash
    cd backend
    node app.js
    ```
2. Start the frontend development server (in another terminal):
    ```bash
    cd frontend
    npm run dev
    ```
3. Open your browser at `http://localhost:5173/` to play the minigame.

## Discalimer
- This project is purely **educational** and for portfolio demonstration purposes.
- It is **not a commercial project** and has **no affilitation with Stardew Valley or ConcernedApe**.
- Some assets may originate from *Stardew Valley*; they are used strictly for educational purposes and demonstration.
- This project should **not be used for distribution or monetization**.

## Inspired By
This project is inspired by the fishing minigame in the official game:

[🎮 Stardew Valley Official Website](https://www.stardewvalley.net/)

> [!NOTE]
> ⚠️ **Disclaimer:** This project is not affiliated with or endorsed by ConcernedApe or Stardew Valley. It was created solely for educational purposes.
