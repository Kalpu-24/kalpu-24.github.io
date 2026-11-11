/*
  Single source of truth for the whole site.
  Add a game: drop its images in assets/games/<id>/ and add one entry here.
  `cover`, `back` and `stickers` drive the shelf on the home page; `loop` draws the
  "How it plays" graph on the game page (leave it out to skip that section).
  The home page, the game page and the scoreboard all read from this file.

  Text is plain text (no HTML). Use arrays for multiple paragraphs.
*/

export const profile = {
  name: "Kalp Shah",
  role: "Game Developer",
  email: "contact@kalpshah.dev",
  resume: "public/Kalp-Resume-Game.pdf",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/Kalpu24/" },
    { label: "GitHub", url: "https://github.com/Kalpu-24" },
    { label: "Telegram", url: "https://t.me/kalpu_24" },
  ],
};

export const games = [
  {
    id: "rollemout",
    name: "Roll 'Em Out",
    kind: "Co-op adventure",
    year: "2026",
    pitch: "A first-person co-op adventure about rolling your friend out of a mysterious cave.",
    role: "Programmer, Shortgun Games",
    stack: "Unreal Engine 5 · C++ · Blueprints",
    highlight: "150+ Steam wishlists",
    theme: {
      font: "Jaro", scale: 1.12,
      bg: "#0b1f24", surface: "#12303a", ink: "#f3efe6", muted: "#9fb6b6",
      accent: "#ffb347", onAccent: "#1d1300",
    },
    stage: { shot: 2, prop: { left: "-7%", bottom: "-9%", height: "44%" } },
    cover: { fit: "cover", bg: "#0b1f24" },
    back: ["Programmer, Shortgun Games", "Unreal Engine 5 · C++ · Blueprints", "Inventory, settings, UI, networking"],
    stickers: [["150+", "Steam wishlists"], ["4 mo", "start to finish"]],
    // DRAFT: written from the overview text. Replace with the real loop.
    loop: {
      steps: [
        { title: "Tied up", text: "You and your friend start deep in a mysterious cave, tied up.", shot: 3 },
        { title: "Roll 'em", text: "The rolling mechanic: one player rolls the other along." },
        { title: "Work together", text: "Get through challenging environments as a pair.", shot: 2 },
        { title: "Out of the cave", text: "Roll your friend all the way out." },
      ],
    },
    facts: [
      ["Period", "March – June 2026"],
      ["Status", "Completed"],
      ["Category", "Game"],
      ["Role", "Programmer at Shortgun Games"],
      ["Engine", "Unreal Engine 5"],
      ["Built with", "C++ · Blueprints"],
    ],
    links: [
      { label: "Steam", note: "Windows", url: "https://store.steampowered.com/app/4139160/Roll_em_Out/" },
    ],
    metrics: [
      { value: "4 months", label: "Development time" },
      { value: "150+", label: "Steam wishlists" },
    ],
    overview: [
      "I worked on this project as a programmer at Shortgun Games. Roll 'Em Out is a first-person co-op adventure about rolling your friend out of a mysterious cave.",
      "The game features a unique rolling mechanic, where players must work together to navigate through challenging environments while they are tied up.",
    ],
    technical: [
      ["Tech stack", "Unreal Engine, Blueprints, C++."],
      ["Many hats", "As a programmer at a startup, I wore multiple hats, including gameplay, UI, networking, animation and more."],
      ["Main areas", "Prominently worked on the inventory system, settings, UI and more."],
    ],
    challenge: {
      paragraphs: [
        "There were several challenges, like time constraints and resources. The game was developed in a short span of 4 months, which required efficient time management and prioritization of tasks.",
        "Additionally, the team had to work with limited resources, which meant that we had to be creative and resourceful in our approach to problem-solving.",
      ],
    },
    shots: [[1920, 1080], [1672, 941], [1920, 1080], [1920, 1080]],
    reviews: [],
  },

  {
    id: "boomcorp",
    name: "Boom Corp.",
    kind: "3D puzzle · Jam winner",
    year: "2025",
    pitch: "A first-person 3D puzzle game of logic and consequence — Minesweeper you have to walk through.",
    role: "Solo developer",
    stack: "Unreal Engine 5 · Blueprints",
    highlight: "Winner, Druid Mechanics Game Jam 2025",
    theme: {
      font: "Orbitron", scale: 0.74,
      bg: "#020710", surface: "#08142b", ink: "#dcfff7", muted: "#84aeb0",
      accent: "#cdff1b", onAccent: "#0b1300",
    },
    stage: { shot: 4, prop: { left: "-10%", bottom: "-13%", height: "56%" } },
    cover: { fit: "contain", bg: "#061023" },
    back: ["Solo developer", "Unreal Engine 5 · Blueprints", "Toon shading · Lumen · 8×8 grid"],
    stickers: [["#1", "Druid Mechanics Jam 2025"], ["9 days", "concept to release"]],
    loop: {
      steps: [
        { title: "Enter room", text: "A random 8×8 grid of safe and dangerous tiles." },
        { title: "Scan", text: "Clearing a tile reveals information about its surroundings.", shot: 3 },
        { title: "Deduce", text: "The numbers tell you how many explosives touch that tile." },
      ],
      branch: {
        title: "Safe tile?", text: "One wrong move and the consequences are immediate.",
        yes: { title: "Mark", shot: 4 }, no: { title: "Boom", shot: 5 },
      },
    },
    facts: [
      ["Period", "3 – 11 Aug 2025"],
      ["Status", "Completed"],
      ["Category", "Game jam project"],
      ["Award", "Jam winner"],
      ["Role", "Solo developer"],
      ["Engine", "Unreal Engine 5"],
      ["Built with", "Blueprints"],
    ],
    links: [
      { label: "Itch.io", note: "Windows", url: "https://kryoxx-studio.itch.io/boom-corp" },
      { label: "Trailer", note: "YouTube", url: "https://www.youtube.com/watch?v=o26X81-yo5w" },
    ],
    metrics: [
      { value: "9 days", label: "Development time" },
      { value: "700 MB", label: "Build size" },
      { value: "8×8", label: "Tile grid" },
      { value: "8", label: "Planted tiles" },
    ],
    overview: [
      "Boom Corp. is a first-person 3D puzzle game of logic and consequence. You will be deployed into rooms with a random grid of safe and dangerous tiles, requiring careful planning and quick reflexes to navigate and locate the precise coordinates of mine-planted tiles.",
      "This game was created for the Druid Mechanics Game Jam 2025 over 9 days.",
    ],
    technical: [
      ["Engine", "Unreal Engine 5, scripted in Blueprints. Windows build."],
      ["Scan", "Use your bomb scanner to interact with the grid. Clearing a tile will reveal crucial information about its surroundings."],
      ["Deduce", "The numbers revealed tell you how many explosives are touching that tile. Use this information to logically deduce which tiles are safe and which are hiding a threat."],
      ["Mark", "Once you have identified a threat, clear out the rest of the tiles to mark its location."],
      ["Survive", "One wrong move, one lapse in judgment, and the consequences will be… immediate and explosive."],
      ["Physics", "UE5's built-in physics engine with simulated actors and collision filtering."],
      ["Lighting", "Fully dynamic lighting with Lumen (software ray tracing), tailored for performance."],
      ["Post process", "Toon shading using post-process materials with an outline shader."],
      ["Input", "Keyboard and mouse support."],
      ["UI / UX", "Minimal and sleek HUD."],
      ["Theme", "A mixture of retro and sci-fi."],
      ["Audio", "Ambient soundscapes and sound effects for actions and UI."],
    ],
    challenge: {
      title: "From concept to completion in 9 days",
      steps: [
        ["Problem", "The primary challenge was the extreme time constraint of a 9-day game jam. The goal was to take a simple idea and develop it into a complete and polished game from scratch, covering all stages from initial design and programming to final art and sound."],
        ["Solution", "To meet the deadline, development was scoped appropriately, focusing on core gameplay mechanics and iterative design. Regular updates on progress were shared for accountability, ensuring every day I completed specific milestones."],
        ["Impact", "The result was a successfully completed and published game, delivered before time. The project demonstrates the ability to manage a tight schedule, prioritize core features, and execute on a concept to deliver a polished and engaging experience from start to finish."],
      ],
    },
    shots: [[1704, 960], [1704, 960], [1704, 960], [1704, 960], [1704, 960], [1704, 960]],
    reviews: [
      { text: "Absolutely Awesome game. Well done. Exceptional work. Hope you gonna take it further.", author: "Petraefa", role: "Game jam host", featured: true },
      { text: "I think this is our winner. Fun, unique approach to the classic minesweeper.", author: "Lexior", role: "Game jam participant", featured: true },
      { text: "Really love the modern twist on the classic Minesweeper! Ah memories :)", author: "Exetorius", role: "Game jam participant" },
      { text: "Fun: Funny, good idea, we can enjoy old small minesweeper but this time in 3D.", author: "Warrpirek", role: "Game jam participant" },
      { text: "I think it's quite fitting", author: "xTriplex", role: "Game jam participant" },
      { text: "I'm very proud of my creation.", author: "Kalp", role: "Myself" },
    ],
  },

  {
    id: "tgf",
    name: "The Gravity Flip",
    kind: "Puzzle platformer",
    year: "2025",
    pitch: "A game built around a single, perspective-bending idea — what if gravity worked the other way?",
    role: "Solo developer",
    stack: "Unreal Engine 5 · C++ · Blueprints",
    highlight: "10 levels, built in 2 weeks",
    theme: {
      font: "Sour Gummy", scale: 1,
      bg: "#0c0b10", surface: "#1a1722", ink: "#f2f0f6", muted: "#a7a2b5",
      accent: "#ff5db4", onAccent: "#2b0017",
    },
    stage: { shot: 5, prop: { right: "5%", top: "-9%", height: "64%" } },
    cover: { fit: "contain", bg: "#000000" },
    back: ["Solo developer", "Unreal Engine 5 · C++ · Blueprints", "Custom gravity movement system"],
    stickers: [["10", "levels"], ["2 wks", "solo build"]],
    loop: {
      steps: [
        { title: "Run", text: "Move and jump through an abstract sci-fi level.", shot: 2 },
        { title: "Read the room", text: "Obstacles are built around momentum and inversion timing." },
        { title: "Flip gravity", text: "Flip it, or turn it 90° either way — even mid-jump.", shot: 4 },
      ],
      branch: {
        title: "Landed clean?", text: "The world turns on its head; you have to keep up.",
        yes: { title: "Next level", shot: 3 }, no: { title: "Instant retry", shot: 5 },
      },
    },
    facts: [
      ["Period", "25 Apr – 7 May 2025"],
      ["Status", "Completed"],
      ["Category", "Game"],
      ["Role", "Solo developer"],
      ["Engine", "Unreal Engine 5"],
      ["Built with", "C++ · Blueprints"],
    ],
    links: [
      { label: "Itch.io", note: "Windows", url: "https://kryoxx-studio.itch.io/the-gravity-flip" },
    ],
    metrics: [
      { value: "2 weeks", label: "Development time" },
      { value: "264 MB", label: "Build size" },
      { value: "10", label: "Levels" },
      { value: "20 min", label: "Average playthrough" },
    ],
    overview: [
      "The Gravity Flip is a game built around a single, perspective-bending idea — what if gravity worked the other way?",
      "It's less about challenge and more about the feeling of disorientation, discovery, and flow as the world turns on its head.",
    ],
    technical: [
      ["Engine", "Unreal Engine 5, scripted in C++ and Blueprints. Windows build."],
      ["Core mechanic", "Gravity inversion on player input, flipping character and environment physics."],
      ["Physics", "UE5's built-in physics engine with simulated actors and collision filtering."],
      ["Lighting", "Fully dynamic lighting with Lumen (software ray tracing), tailored for performance."],
      ["Camera", "Follows the player with adjustable angles and movement space."],
      ["Input", "Keyboard and touch support."],
      ["Level design", "10 levels with increasing complexity, each introducing new mechanics and challenges."],
      ["Obstacles", "Designed to exploit momentum and inversion timing."],
      ["Pacing", "Instant retries to encourage experimentation."],
      ["UI / UX", "Minimal and sleek HUD."],
      ["Theme", "Abstract sci-fi with minimal visuals."],
      ["Code", "Written modular and highly scalable, following best coding practices."],
      ["Performance", "Optimized for smooth gameplay on mid-range hardware."],
      ["Audio", "Ambient soundscapes and sound effects for actions and events."],
    ],
    challenge: {
      title: "Gravity inversion mechanics",
      steps: [
        ["Problem", "Implementing a smooth and responsive gravity flip introduced complications with character orientation, collision detection, and platform traversal."],
        ["Solution", "Designed a custom movement system tied to a world-space gravity vector, re-calibrated physics interactions, and synced camera behavior accordingly."],
        ["Impact", "Achieved precise control and predictable physics, allowing gravity to flip mid-jump or on angled surfaces without breaking gameplay flow."],
      ],
    },
    notes: [
      {
        title: "A critical decision: no Android release",
        paragraphs: [
          "After extensive closed testing, I made the decision to discontinue the Android release of Gravity Flip.",
          "While the game performed well on many devices, a number of device-specific bugs emerged that would require significant time and resources to address. While fixable, addressing them would divert focus from my core platform — Windows. Mobile is not my primary target, and this decision allows me to prioritize quality and development efficiency.",
          "Thanks to everyone who joined the Play Store testing. Your support is truly appreciated.",
        ],
      },
    ],
    shots: [[1920, 1080], [1920, 1080], [1920, 1080], [1920, 1080], [1920, 1080], [1920, 1080], [1704, 960]],
    reviews: [
      { text: "The gravity-switching mechanic is genius! Makes every level feel fresh and challenging.", author: "Sujal", role: "Player", featured: true },
      { text: "solid af game, works good, smooth, nice mechanic, good idea, keep it up.", author: "Tako", role: "Player" },
      { text: "Man.. it's already a great fun game.. Also, the graphics are so good.. I liked every aspect of it.", author: "Vivek", role: "Player" },
      { text: "It a good game, Good mechanics, I like the concept, It feels little bit too easy but overall great game, Waiting for more levels", author: "Yash", role: "Player" },
      { text: "I enjoyed it while playing man great work, waiting for more levels.", author: "Nitin", role: "Tester" },
      { text: "Amazing concept. It was fun playthrough.", author: "Shreyash", role: "Player" },
      { text: "Its fun to play, immersive experience", author: "Moksh", role: "Player" },
      { text: "Its fun, hoping for more projects like this.", author: "Spark", role: "Player" },
      { text: "It was short yet fun game.", author: "Raj", role: "Player" },
      { text: "It is a Great Game", author: "Ashwamegh", role: "Tester" },
      { text: "Enjoyed playing it.", author: "Harshit", role: "Player" },
      { text: "It was fun to play", author: "Dilip", role: "Player" },
    ],
  },

  {
    id: "aurarpg",
    name: "AuraRPG",
    kind: "Top-down action RPG",
    year: "2025",
    pitch: "A stylized top-down action RPG with fluid combat and modular abilities, built on Unreal's Gameplay Ability System.",
    role: "Solo developer",
    stack: "Unreal Engine 5 · C++ · GAS",
    highlight: "Spells, stats, AI and UI on a 50/50 C++ / Blueprint codebase",
    theme: {
      font: "Pirata One", scale: 1.14,
      bg: "#0b072a", surface: "#161042", ink: "#eeeef8", muted: "#aaa5d2",
      accent: "#f3c969", onAccent: "#251a00",
    },
    stage: { shot: 8, prop: { left: "-11%", bottom: "-7%", height: "84%" } },
    cover: { fit: "cover", bg: "#0b072a" },
    back: ["Solo developer", "Unreal Engine 5.5 · C++ · GAS", "Spells, stats, enemy AI, UI"],
    stickers: [["GAS", "playable RPG demo"], ["50/50", "C++ and Blueprint"]],
    loop: {
      steps: [
        { title: "Enter the level", text: "Goblins, Demons and Ghouls are waiting.", shot: 2 },
        { title: "Cast", text: "Fire and lightning spells from the spell bar, each on a cooldown.", shot: 9 },
        { title: "Hit lands", text: "Crits, stuns, damage over time, blocks and knockbacks.", shot: 8 },
      ],
      branch: {
        title: "Enemy down?", text: "Every enemy type has its own spellcasting logic.",
        yes: { title: "XP and level up", shot: 5 }, no: { title: "They cast back", shot: 7 },
      },
    },
    facts: [
      ["Period", "Jan – Mar 2025"],
      ["Status", "Completed"],
      ["Category", "Game demo"],
      ["Role", "Solo developer"],
      ["Engine", "Unreal Engine 5.5"],
      ["Built with", "C++ · Blueprints · GAS"],
    ],
    links: [
      { label: "Download", note: "Telegram", url: "https://t.me/KryoxxStudio/7/113" },
      { label: "Source", note: "GitHub", url: "https://github.com/Kalpu-24/Aura-RPG" },
    ],
    metrics: [],
    overview: [
      "AuraRPG is a stylized top-down action RPG built in Unreal Engine 5 using the Gameplay Ability System (GAS).",
      "It features fluid combat, modular abilities, and a dynamic world that reacts to player progression.",
    ],
    technical: [
      ["Engine", "Unreal Engine 5.5."],
      ["Scripting", "Hybrid approach — 50% C++ / 50% Blueprint, using the GAS framework."],
      ["Core mechanics", "RPG combat system powered by GAS — including spells, attributes, and combat effects."],
      ["Ability system", "Custom AbilitySystemComponent and AttributeSet in C++; uses Gameplay Tags, Gameplay Effects, and Gameplay Cues."],
      ["Combat", "Supports elemental damage (fire, lightning), crits, stuns, DOTs, blocked hits, and knockbacks."],
      ["Stats & leveling", "Primary (STR, INT, etc.), secondary (Crit Chance, Armor), and vital stats (Health, Mana); XP and level-up with unlockable spells and attributes."],
      ["AI", "Behavior Trees and EQS; enemies like Goblins, Demons, and Ghouls with their own spellcasting logic."],
      ["UI", "UMG with MVVM; spell bar with cooldowns, attribute and spell upgrade panels, floating combat text, XP and level indicators."],
      ["Camera", "Fixed top-down camera with dynamic object fading and trace-based visibility clearing."],
      ["Visual effects", "Niagara systems for spell effects (burns, explosions), damage types, and level-up feedback."],
      ["Assets", "Custom characters, modular environment tiles, particle VFX, icons, and SFX (licensed from the course)."],
      ["Code", "Written modular and highly scalable, following best coding practices."],
      ["Optimization", "Designed with a scalable architecture; effect context and replication logic optimized for multiplayer-readiness."],
      ["Tooling", "JetBrains Rider, Struct Ops, Ability Tasks, lambdas, and Blueprint Function Libraries."],
      ["Packaging", "Windows 64-bit, shipping configuration; multiplayer-ready architecture (EOS / Steam compatible design)."],
    ],
    challenge: {
      title: "Following a UE 5.2 course on UE 5.5",
      steps: [
        ["Problem", "The course I followed was built on Unreal Engine 5.2, while I was using UE 5.5. Many systems, especially in GAS, had breaking changes or deprecated nodes, making it difficult to follow along as a complete beginner."],
        ["Solution", "I cross-referenced official Unreal Engine 5.5 documentation, community forums, and GitHub discussions to manually adapt and modernize sections of the course code. I learned to identify breaking changes and refactor Blueprint and C++ logic accordingly."],
        ["Impact", "This not only helped me complete the project in the latest version of UE, but also built my confidence in solving real-world versioning and migration problems — a valuable skill for working on long-term or legacy projects."],
      ],
    },
    shots: Array(10).fill([1920, 1080]),
    reviews: [
      { text: "Great game with many fun abilities. Last level was diabolical though :)", author: "Shreyash", role: "Player" },
    ],
  },

  {
    id: "snakewall",
    name: "SnakeWall",
    kind: "Android live wallpaper",
    year: "2024",
    pitch: "A modern twist on the classic Snake game, re-imagined as a live wallpaper you can play on your home screen.",
    role: "Solo developer",
    stack: "Java · Android Canvas API",
    highlight: "6k+ Play Store installs · 4.6 rating",
    theme: {
      font: "MLCD", scale: 0.9, light: true,
      bg: "#eeeef2", surface: "#ffffff", ink: "#141218", muted: "#5d5a66",
      accent: "#c8201b", onAccent: "#ffffff",
    },
    stage: { shot: "key", fit: "contain", prop: { right: "-3%", bottom: "-11%", height: "82%" } },
    cover: { fit: "contain", bg: "#ffffff" },
    back: ["Solo developer", "Java · Android Canvas API", "A live wallpaper you can play"],
    stickers: [["6k+", "Play Store installs"], ["4.6", "store rating"]],
    loop: {
      steps: [
        { title: "Home screen", text: "The wallpaper is the game.", shot: 1 },
        { title: "Tap start", text: "Touch is detected inside the wallpaper engine." },
        { title: "Steer", text: "On-screen buttons, because swipes belong to the system.", shot: 3 },
      ],
      branch: {
        title: "Left the home screen?", text: "The game runs on a low-interval frame loop to save battery.",
        yes: { title: "State saved", shot: 5 }, no: { title: "Keep playing", shot: 2 },
      },
    },
    keyFit: "contain",
    facts: [
      ["Period", "18 – 23 Dec 2024"],
      ["Status", "Completed"],
      ["Category", "Live wallpaper"],
      ["Role", "Solo developer"],
      ["Tools", "Android Studio"],
      ["Built with", "Java · Wallpaper Engine"],
    ],
    links: [
      { label: "Google Play", note: "Android", url: "https://play.google.com/store/apps/details?id=kalp.snake.wall" },
      { label: "Source", note: "GitHub", url: "https://github.com/Kalpu-24/SnakeWall" },
    ],
    metrics: [
      { value: "6k+", label: "Play Store installs" },
      { value: "4.6", label: "Rating" },
      { value: "29", label: "GitHub stars" },
    ],
    overview: [
      "SnakeWall is a modern twist on the classic Snake game, re-imagined as a dynamic live wallpaper. Built for Android, it features smooth animations, adaptive design, and minimalist visuals.",
    ],
    technical: [
      ["Tech stack", "Java, Android Studio."],
      ["Platform", "Android Live Wallpaper Engine."],
      ["Rendering", "Canvas API (hardware-accelerated)."],
      ["Grid system", "Odd-number square grid with dynamic size."],
      ["Snake structure", "Linked list of grid coordinates."],
      ["Screen handling", "Responsive to resolution and orientation."],
      ["Persistence", "Game state saved and restored on wallpaper pause / resume."],
      ["Performance", "Optimized for minimal battery usage; runs on a low-interval frame loop."],
      ["Input", "Touch detection inside the wallpaper engine."],
      ["Customization", "Color themes and grid visibility options."],
      ["Code", "Written modular and highly scalable, following best coding practices."],
    ],
    challenge: {
      title: "From widget to wallpaper",
      paragraphs: [
        "The initial idea was to mimic Nothing's Snake Game Widget. I created a custom view for the game with gesture support. However, when I tried to implement it as a widget, I hit a roadblock with the widget's limitations.",
        "I posted about this on my Telegram channel and got a suggestion to implement it as a live wallpaper instead. This was a game-changer, allowing me to use the Android Live Wallpaper Engine and Canvas API for smooth animations and adaptive design.",
        "One limitation remained: I could not use gestures, as they would trigger system gestures like the app drawer or notification panel — so I adapted to on-screen buttons.",
      ],
    },
    shots: Array(5).fill([230, 512]),
    reviews: [
      { text: "Pretty Creative Stuff", author: "HowToMen", role: "YouTuber / tech enthusiast", featured: true },
      { text: "Uniquely fresh idea which brings back nostalgic memories. +1 for the haptic support since it feels premium with the haptics.", author: "Raj", role: "Android user" },
      { text: "A super creative idea! Playing Snake right on the wallpaper is both fun and unique never seen anything like it.", author: "Sujal", role: "Android user" },
      { text: "Didn't expect to be playing Snake on my home screen lol. Super fun as always and works smoothly.", author: "Adarsh", role: "Android user" },
      { text: "Unique idea, it works really well, I can spend hours playing the snake game, and never get tired of :)", author: "Pie", role: "Android user" },
      { text: "Is a great app. Is so cool and simple", author: "nevulastra", role: "Android user" },
    ],
  },
];

/* Headline numbers shown on the home page. */
export const scoreboard = [
  { value: "Winner", label: "Druid Mechanics Game Jam 2025", game: "boomcorp" },
  { value: "6k+", label: "Play Store installs", game: "snakewall" },
  { value: "4.6", label: "Store rating", game: "snakewall" },
  { value: "150+", label: "Steam wishlists", game: "rollemout" },
];
