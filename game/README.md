# MiMiG Carbon Farm 🌾

**Tap to farm rice, reduce CO2, and earn MiMiG tokens!**

A tap-to-earn farming game that combines idle clicker mechanics with environmental impact and blockchain rewards.

---

## 🎮 About

MiMiG Carbon Farm is a web-based game where players:
- 🌾 Tap to harvest rice and earn points
- ⚡ Manage energy resources strategically
- 📈 Upgrade farming capabilities
- 🌍 Visualize real CO2 reduction impact
- 💰 Earn MiMiG tokens (10,000 points = 1 token)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (already configured)

### Installation

```bash
# Navigate to game directory
cd C:\dev\MIMIG\game

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

---

## 📁 Project Structure

```
game/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main game page (Session 68: Auto-save)
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Game header with stats (Session 68: Timer)
│   ├── FarmCanvas.tsx     # Main game canvas (Session 67)
│   ├── EnergyTimer.tsx    # Energy regen timer (Session 68)
│   ├── SaveIndicator.tsx  # Auto-save feedback (Session 68)
│   ├── OfflineEarningsModal.tsx  # Offline rewards (Session 68)
│   ├── UpgradeCard.tsx    # Upgrade card UI (Session 69)
│   └── UpgradePanel.tsx   # Upgrade panel with 4 types (Session 69)
├── hooks/                 # Custom React hooks
│   └── useGameStore.ts    # Zustand state management (Session 68: Save state)
├── lib/                   # Utilities and configs
│   ├── firebase.ts        # Firebase initialization
│   ├── storage.ts         # IndexedDB management
│   ├── constants.ts       # Game balance constants (Session 68: Offline earnings)
│   ├── sounds.ts          # Sound manager (Session 67)
│   └── utils.ts           # Number formatting utilities (Session 69)
├── public/                # Static assets
│   ├── images/           # Game images
│   │   ├── farm-background.png
│   │   ├── rice-icon.png
│   │   ├── particle-sparkle.png
│   │   └── particle-rice.png
│   └── sounds/           # Sound effects
│       ├── click.mp3
│       ├── warning.mp3
│       ├── levelup.mp3
│       └── success.mp3
└── styles/               # Additional styles
```

---

## 🛠️ Tech Stack

**Framework:**
- Next.js 14.2 (App Router)
- React 18.2
- TypeScript 5.3

**State Management:**
- Zustand 4.5 (Game state)
- React Query 5.0 (Server state)

**UI:**
- Material-UI 7.0
- Framer Motion 11.0 (Animations)

**Storage:**
- IndexedDB (Dexie.js)
- Firebase Firestore

**Blockchain:**
- Firebase (for this phase)
- Web3Auth integration (planned)

---

## 🎯 Development Status

### ✅ Session 66 Complete (Project Setup)

**Completed:**
- ✅ Project structure created
- ✅ Dependencies configured
- ✅ Firebase integration
- ✅ Zustand store setup
- ✅ Basic UI layout
- ✅ IndexedDB storage
- ✅ Game constants

### ✅ Session 67 Complete (Click System)

**Completed:**
- ✅ FarmCanvas component with background image
- ✅ Click mechanics (tap to harvest)
- ✅ Particle effects (+X pts animation)
- ✅ Sound system (Howler.js)
- ✅ Energy consumption logic
- ✅ Visual feedback (hover/click animations)
- ✅ Warning system (energy low)

### ✅ Session 68 Complete (Energy & Storage)

**Completed:**
- ✅ Energy regeneration timer (60s countdown)
- ✅ Real-time energy recovery (+1 every 60s)
- ✅ Auto-save system (every 5 seconds)
- ✅ Save status indicator (Saved Xs ago)
- ✅ Offline earnings calculation
- ✅ "Welcome Back" modal with rewards
- ✅ Persistent user ID (localStorage)
- ✅ Data persistence (IndexedDB)
- ✅ Base offline earnings (0.1 pts/sec at Level 0)

### ✅ Session 69 Complete (Upgrade System)

**Completed:**
- ✅ UpgradeCard component (141 lines)
- ✅ UpgradePanel component (101 lines)
- ✅ 4 upgrade types implemented:
  - 👆 Tap Power (increase points per tap)
  - 🤖 Auto Farm (passive point generation)
  - ⚡ Energy Capacity (higher max energy)
  - ⏱️ Energy Regen (faster recovery)
- ✅ Cost calculation and scaling
- ✅ Visual feedback (hover, disabled states)
- ✅ Max level handling
- ✅ Number formatting utilities (utils.ts)
- ✅ Responsive layout (mobile + desktop)

**Next: Session 70 (TBD)**
- Option 1: Achievements system
- Option 2: Daily quests
- Option 3: Season/Events
- Option 4: Multiplayer prep (rankings)
- Option 5: UI/UX polish (sounds, animations)

---

## 🎮 Game Mechanics

### Core Loop

1. **Tap** the farm to harvest rice
2. **Earn** points (consumes energy)
3. **Upgrade** your farming capabilities
4. **Level up** as you accumulate points
5. **Claim** AEC1 tokens

### Energy System

- Starts at 100 energy
- 1 energy per click
- Regenerates 1 point every 60 seconds (automatic)
- Real-time countdown timer shows next energy
- Upgradeable capacity and regen rate
- Visual progress bar for recovery

### Auto-Save System

- Automatically saves every 5 seconds
- Saves to IndexedDB locally
- Persistent user ID in localStorage
- Visual save indicator shows status
- Last save time displayed ("Saved 2s ago")
- Error handling with retry

### Upgrades (4 types)

1. **Tap Power** - More points per click
2. **Auto Farm** - Passive point generation
3. **Energy Capacity** - Higher max energy
4. **Energy Regen** - Faster energy recovery

### Offline Earnings

- Auto Farm generates points while offline
- Maximum 4 hours of offline earnings
- Calculated on return
- "Welcome Back" modal shows rewards
- Base earning: 0.1 pts/sec (Level 0)
- Scales with Auto Farm upgrade level
- Time away formatted (seconds/minutes/hours)

---

## 🔧 Configuration

### Environment Variables

```env
# Firebase (already configured in .env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mimig-carbon-farm
# ... other Firebase vars
```

### Game Balance

Edit `lib/constants.ts` to adjust:
- Initial energy/points
- Upgrade costs and effects
- Level requirements
- Token conversion rates

---

## 📜 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 🗺️ Roadmap

### Phase 1: Web Game (Week 1-6)
- ✅ Session 66: Project setup
- ✅ Session 67: Click system
- ✅ Session 68: Energy & storage
- ✅ Session 69: Upgrade system
- ⏳ Session 70: Additional systems
- ⏳ Session 71-73: Systems expansion
- ⏳ Session 74-75: Social features
- ⏳ Session 76-77: Polish & blockchain

### Phase 2: MiMiG Integration (Week 7)
- ⏳ Session 78: Platform integration

### Phase 3: Telegram Mini App (Week 8-9)
- ⏳ Session 79-80: Telegram porting

---

## 🔗 Related Projects

- **MiMiG Platform**: Main DeFi platform
- **Deployed**: https://mimig-project.web.app

---

## 📄 License

Private - MiMiG Project

---

## 👥 Team

**Developer**: MiMiG Team  
**Session**: 69 (Upgrade System Complete)  
**Started**: 2025-11-15  
**Last Updated**: 2025-11-15  

---

## 🆘 Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Firebase Connection Issues

Check `.env.local` has correct Firebase configuration.

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

---

**Ready to play? Start with `npm run dev`!** 🎮✨
