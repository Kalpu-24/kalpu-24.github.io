/*
  All the words and numbers on the site live in this file.
  Edit it, then run `node build.mjs` from the new/ folder to regenerate the pages.

  Text is plain text. Wrap something in `backticks` to show it as code.
  Every figure here was checked against the project repositories, the store
  pages or the previous site on 13 Nov 2026. The `// source:` comments say which.
*/

export const site = {
  url: "https://kalpshah.dev/new/", // change to https://kalpshah.dev/ when this replaces the root site
  noindex: true, // set to false when this replaces the root site
};

export const profile = {
  name: "Kalp Shah",
  role: "Game developer",
  location: "Gujarat, India",
  headline: "I build games in Unreal Engine 5 and C++.",
  intro:
    "Gameplay systems, UI and the unglamorous work of getting a build out the door. I'm a programmer at Shortgun Games, where I worked on the co-op adventure Roll 'Em Out; before that, a jam-winning puzzle game, a gravity platformer and an action RPG, built solo.",
  email: "contact@kalpshah.dev",
  resume: "public/Kalp-Resume-Game.pdf",
  links: [
    { label: "GitHub", url: "https://github.com/Kalpu-24" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/Kalpu24/" },
    { label: "itch.io", url: "https://kryoxx-studio.itch.io/" },
    { label: "Telegram", url: "https://t.me/kalpu_24" },
  ],
  about: {
    punch: "A game developer figuring it out, one idea at a time.",
    paragraphs: [
      "I didn't start building things because I had a plan. I just couldn't stop thinking about how cool it would be if this existed.",
      "I make things out of curiosity, emotion, and the hope that someone out there will feel something too. My solo work goes out under the name Kryoxx Studio.",
    ],
  },
};

/* The strip under the hero. */
export const headlineStats = [
  { v: "1st", l: "Druid Mechanics Game Jam 2025", to: "boomcorp" },
  { v: "4", l: "Unreal Engine 5 games", to: null },
  { v: "6k+", l: "Google Play installs", to: "snakewall" },
];

/* Experience and education, newest first. */
export const timeline = [
  { when: "Jan 2026 – present", what: "Programmer, Shortgun Games", detail: "Inventory, settings and UI on Roll 'Em Out, a four-player co-op adventure on Steam.", to: "rollemout" },
  { when: "2022 – 2026", what: "B.Tech, Computer Science and Engineering", detail: "Uka Tarsadia University, Gujarat." },
  { when: "Aug 2025", what: "Winner, Druid Mechanics Game Jam 2025", detail: "Boom Corp., designed, built and released solo in nine days.", to: "boomcorp" },
  { when: "May 2025", what: "Released The Gravity Flip", detail: "A ten-level gravity platformer in C++, on itch.io.", to: "tgf" },
  { when: "2025", what: "Unreal Engine 5 – Gameplay Ability System – Top Down RPG", detail: "Udemy course, completed as AuraRPG on a newer engine version than the course used.", to: "aurarpg" },
  { when: "Jan 2025", what: "Published SnakeWall on Google Play", detail: "An open-source Android live wallpaper you can play.", to: "snakewall" },
];

/* What I work with, and where each thing was used. */
export const skills = [
  {
    group: "Engine and languages",
    items: [
      { label: "Unreal Engine 5", in: ["rollemout", "boomcorp", "tgf", "aurarpg"] },
      { label: "C++", in: ["rollemout", "tgf", "aurarpg"] },
      { label: "Blueprints", in: ["rollemout", "boomcorp", "tgf", "aurarpg"] },
      { label: "Java (Android)", in: ["snakewall"] },
    ],
  },
  {
    group: "Gameplay systems",
    items: [
      { label: "Gameplay Ability System", in: ["aurarpg"] },
      { label: "Inventory and settings", in: ["rollemout"] },
      { label: "Custom gravity and movement", in: ["tgf"] },
      { label: "Save and load", in: ["aurarpg", "tgf"] },
      { label: "Enhanced Input", in: ["tgf", "aurarpg", "boomcorp"] },
    ],
  },
  {
    group: "AI, UI and visuals",
    items: [
      { label: "Behavior Trees and EQS", in: ["aurarpg"] },
      { label: "UMG, widget controllers, MVVM", in: ["aurarpg", "tgf", "rollemout"] },
      { label: "Niagara VFX", in: ["aurarpg", "boomcorp", "tgf"] },
      { label: "Post-process toon and outline shader", in: ["boomcorp"] },
    ],
  },
  {
    group: "Shipping",
    items: [
      { label: "Steam, itch.io, Google Play releases", in: ["rollemout", "boomcorp", "tgf", "snakewall"] },
      { label: "Build size and performance passes", in: ["boomcorp", "tgf"] },
      { label: "Git, Git LFS, GitHub Actions", in: ["snakewall", "boomcorp"] },
      { label: "Blender, Photoshop", in: ["boomcorp", "tgf"] },
    ],
  },
];

export const projects = [
  /* ------------------------------------------------------------------ */
  {
    id: "rollemout",
    name: "Roll 'Em Out",
    font: "Jaro",
    fontScale: 1.08,
    theme: { bg: "#0b1f24", surface: "#12303a", ink: "#f3efe6", muted: "#9fb6b6", accent: "#ffb347", onAccent: "#1d1300" },
    fact: "Free demo on Steam",
    art: { src: "key", pos: "50% 30%" },
    prop: "roll", // the ball rolls along the card as you scroll
    kind: "Co-op adventure",
    year: "2026",
    pitch: "A co-op adventure for up to four players, tied together by a rope, rolling a cursed friend out of a collapsing cave.",
    role: "Programmer, Shortgun Games",
    period: "Mar – Jun 2026",
    status: "Free demo on Steam, full release coming soon", // source: Steam store page
    engine: "Unreal Engine 5 · C++ · Blueprints",
    platform: "Windows (Steam)",
    links: [
      { label: "Steam page", note: "Wishlist", url: "https://store.steampowered.com/app/4139160/Roll_em_Out/" },
      { label: "Play the demo", note: "Steam", url: "https://store.steampowered.com/app/4676930/Roll_em_Out_Demo/" },
      { label: "Studio page", note: "shortgun.in", url: "https://www.shortgun.in/games/roll-em-out" },
    ],
    highlights: [
      "Built the inventory system, the settings menu and in-game UI",
      "Also worked on gameplay, networking and animation in a small team",
      "Developed in four months, with a free demo out on Steam",
    ],
    tags: ["Unreal Engine 5", "C++", "Blueprints", "Online co-op", "UI"],
    stats: [
      { v: "1 – 4", l: "players, online co-op" },
      { v: "4 months", l: "development time" }, // source: previous site
      { v: "150+", l: "Steam wishlists" }, // source: previous site
      { v: "4", l: "interface languages" }, // source: Steam store page
    ],
    overview: [
      "A few friends enter a cave. One of them touches an ancient relic, gets cursed and turns into a bouncy ball. Everyone else is tied together on one rope and has to get him out before the cave comes down. You slap the ball, hook it, pull it and push it past carnivorous plants, bats, snakes and a spirit that hunts the ball if it rolls too far from the group.",
      "I joined Shortgun Games as a programmer in January 2026 and still work there. Roll 'Em Out was developed between March and June 2026. It is a small studio, so the work was broad: I owned some systems outright and helped wherever the build needed it.",
    ],
    systemsTitle: "What I worked on",
    systems: [
      { title: "Inventory system", text: "The system players use to pick up, carry and use the tools they find in the cave, in a game where everything has to stay in sync between up to four connected players." },
      { title: "Settings", text: "The settings menu and the logic behind it: reading, applying and saving the player's options." },
      { title: "User interface", text: "In-game and menu UI built in UMG, wired to gameplay from both C++ and Blueprints." },
      { title: "Gameplay, networking, animation", text: "Day-to-day feature work and fixes outside my main areas. On a team this size the programmer who is free takes the task." },
    ],
    challenge: {
      title: "A short runway and a small team",
      paragraphs: [
        "The game was developed in four months, with limited people and limited time. That meant deciding early what each system had to do for the demo and what could wait, and then keeping to it.",
        "It also meant picking up unfamiliar areas quickly. I came in having built single-player games alone; here the code had to work for four players at once and fit into systems other people were writing at the same time.",
      ],
    },
    notes: [
      { title: "About this page", paragraphs: ["Roll 'Em Out belongs to Shortgun Games and its source is private, so this page describes my role and not the internals. The description of the game comes from its Steam page."] },
    ],
    shots: [
      { n: 1, w: 1920, h: 1080, alt: "Looking down a cave shaft at three roped explorers and the ball" },
      { n: 2, w: 1672, h: 941, alt: "Two explorers beside a glowing cave marking and a carnivorous plant" },
      { n: 3, w: 1920, h: 1080, alt: "A wide blue cavern with explorers on a stone bridge" },
      { n: 4, w: 1920, h: 1080, alt: "Explorers climbing through a narrow brick passage" },
    ],
    reviews: [],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "boomcorp",
    name: "Boom Corp.",
    font: "Orbitron",
    fontScale: 0.8,
    theme: { bg: "#020710", surface: "#08142b", ink: "#dcfff7", muted: "#84aeb0", accent: "#cdff1b", onAccent: "#0b1300" },
    fact: "Winner, Druid Mechanics Game Jam 2025",
    art: { src: "key", pos: "50% 50%" },
    prop: "float", // the bomb drifts above the card
    kind: "First-person puzzle",
    year: "2025",
    pitch: "Minesweeper you have to walk through: a first-person puzzle game about scanning a room for buried explosives.",
    role: "Solo developer",
    period: "3 – 11 Aug 2025",
    status: "Released on itch.io · v1.2", // source: itch.io page
    engine: "Unreal Engine 5.6 · Blueprints", // source: BoomCorp.uproject
    platform: "Windows",
    links: [
      { label: "Download", note: "itch.io", url: "https://kryoxx-studio.itch.io/boom-corp" },
      { label: "Watch the trailer", note: "YouTube", url: "https://www.youtube.com/watch?v=o26X81-yo5w" },
      { label: "Jam entry", note: "itch.io", url: "https://itch.io/jam/druid-mechanics-community-game-jam-3/rate/3801801" },
    ],
    highlights: [
      "Winner of the Druid Mechanics Game Jam 2025",
      "Designed, built and released solo in nine days, entirely in Blueprints",
      "A post-jam pass cut the download from 430 MB to 307 MB",
    ],
    tags: ["Unreal Engine 5", "Blueprints", "Post-process shader", "Niagara", "Game jam"],
    stats: [
      { v: "1st", l: "Druid Mechanics Game Jam 2025" },
      { v: "9 days", l: "concept to release" },
      { v: "8 × 8", l: "tile grid, 8 explosives" },
      { v: "307 MB", l: "download, down from 430 MB" }, // source: itch.io file list, v1.0 vs v1.2
    ],
    overview: [
      "You have been recruited by Boom Corp., the galaxy's premier provider of mine detection services. Each room is an 8 × 8 floor of tiles with eight explosives buried somewhere under it. You carry two tools: a scanner that tells you how many explosives touch the tile in front of you, and a blaster that clears a tile. Clear every safe tile and you win. Clear the wrong one and the room finds out what was under it.",
      "I made it alone for the Druid Mechanics Game Jam 2025, from an empty project to a released build in nine days, and it won the jam.",
    ],
    systemsTitle: "What I built",
    systems: [
      { title: "The grid", text: "`BP_TileManager` spawns the floor, picks which tiles hide explosives at random each run, and answers the two questions the rest of the game asks: how many explosives touch this tile, and how far away is the nearest one." },
      { title: "Scanner and blaster", text: "The player swaps between two tools with animated transitions. Right-click scans: a screen on the scanner model itself shows the count for the tile under the laser sight. Left-click fires a projectile that clears the tile it hits." },
      { title: "Proximity beeper", text: "The scanner beeps faster as you get closer to an explosive. The interval comes from the distance, in tiles, to the nearest one, so you can feel your way around the room before you commit to a shot." },
      { title: "Consequences", text: "A safe tile breaks apart with a Niagara burst and leaves a hole. A live one triggers a radial physics impulse that throws the room's props around, a camera shake, and the game-over screen." },
      { title: "Toon shader", text: "The look is a post-process material: cel shading plus an outline pass that detects edges from both scene depth and surface normals, with line thickness adjusted by distance and viewing angle so outlines hold up close and far." },
      { title: "Everything around the game", text: "Title screen, intro cutscene, an onboarding tutorial that a save file marks as seen so it only plays once, HUD, win and lose screens, credits, music and UI sounds." },
    ],
    flow: {
      title: "One turn",
      steps: [
        { t: "Listen", d: "The beeper speeds up near an explosive." },
        { t: "Scan", d: "Right-click a tile to read how many explosives touch it." },
        { t: "Deduce", d: "Cross-reference the numbers, as in Minesweeper." },
        { t: "Shoot", d: "Left-click clears a tile. There is no undo." },
        { t: "Win or boom", d: "Clear all 56 safe tiles, or hit one of the 8." },
      ],
    },
    devlog: {
      title: "Nine days, from the commit log",
      items: [
        { d: "3 Aug", t: "Empty project. Basic first-person movement and a floor of tiles." },
        { d: "4 Aug", t: "Core game playable on day two. Toon shader and laser sight added the same day." },
        { d: "6 Aug", t: "Sound and visual effects. The level is dressed and finished." },
        { d: "8 Aug", t: "HUD, title menu, intro cutscene, onboarding tutorial, UI sounds and music." },
        { d: "10 Aug", t: "Credits, win and lose screens. First build uploaded to itch.io." },
        { d: "13 Aug", t: "v1.2: lighting baked, anti-aliasing changed, unused plugins removed." },
      ],
    },
    challenge: {
      title: "From concept to completion in nine days",
      steps: [
        ["Problem", "A nine-day jam, alone, covering design, programming, art direction and sound. The risk in a jam is a clever idea that never becomes a finished game."],
        ["Approach", "I got the core loop playable by the end of day two and treated everything after it as polish on something that already worked. I posted progress publicly every day, which kept each day tied to a specific milestone."],
        ["Result", "A complete, published game ahead of the deadline, and first place. The host's verdict: \"Absolutely awesome game. Exceptional work.\""],
      ],
    },
    notes: [
      {
        title: "After the jam: v1.2",
        paragraphs: [
          "The jam build used fully dynamic lighting with Lumen. For a single static room that was wasted cost, so v1.2 bakes all the lighting, replaces temporal super resolution with FXAA and strips the plugins the game never used. The download dropped from 430 MB to 307 MB and the game runs on weaker hardware.",
        ],
      },
      {
        title: "Credits",
        paragraphs: [
          "Environment models are from KayKit's Prototype Bits. The break and impact particles started from two Niagara packs on Fab. I modelled the bomb scanner and the title-screen letters in Blender and textured them to match.",
        ],
      },
    ],
    shots: [
      { n: 1, w: 1704, h: 960, alt: "Title screen with an explosion in place of the first O in Boom" },
      { n: 2, w: 1704, h: 960, alt: "First-person view of the room, holding the blaster" },
      { n: 3, w: 1704, h: 960, alt: "Aiming the laser sight across the tiled floor" },
      { n: 4, w: 1704, h: 960, alt: "A cleared tile, open to the floor below" },
      { n: 5, w: 1704, h: 960, alt: "An explosion throwing barrels and crates across the room" },
      { n: 6, w: 1704, h: 960, alt: "Credits screen: Made by Kalp Shah, Kryoxx Studio" },
    ],
    reviews: [
      { text: "Absolutely awesome game. Well done. Exceptional work. Hope you gonna take it further.", author: "Petraefa", role: "Game jam host" },
      { text: "I think this is our winner. Fun, unique approach to the classic minesweeper.", author: "Lexior", role: "Jam participant" },
      { text: "Really love the modern twist on the classic Minesweeper! Ah memories :)", author: "Exetorius", role: "Jam participant" },
      { text: "Really nice game, it's a nice twist on minesweeper and very fun to play. I really like the art style!", author: "Caleex", role: "Player, itch.io" },
      { text: "Funny, good idea, we can enjoy old small minesweeper but this time in 3D.", author: "Warrpirek", role: "Jam participant" },
    ],
    toy: { kind: "mines", title: "Try the idea", text: "The same puzzle in two dimensions: an 8 × 8 room with 8 explosives. Click to clear a tile, right-click to mark one. Your first tile is always safe here; in the game it isn't." },
  },

  /* ------------------------------------------------------------------ */
  {
    id: "tgf",
    name: "The Gravity Flip",
    font: "Sour Gummy",
    fontScale: 1,
    theme: { bg: "#0c0b10", surface: "#1a1722", ink: "#f2f0f6", muted: "#a7a2b5", accent: "#ff5db4", onAccent: "#2b0017" },
    fact: "Four-way gravity, written in C++",
    art: { src: "key", pos: "50% 20%" },
    kind: "Puzzle platformer",
    year: "2025",
    pitch: "A side-scrolling platformer where one key turns the whole world: flip gravity, or bend it ninety degrees, and walk on whatever is now the floor.",
    role: "Solo developer",
    period: "25 Apr – 10 May 2025", // source: previous site (start), itch.io release date (end)
    status: "Released on itch.io",
    engine: "Unreal Engine 5 · C++ · Blueprints",
    platform: "Windows",
    links: [
      { label: "Download", note: "itch.io", url: "https://kryoxx-studio.itch.io/the-gravity-flip" },
    ],
    highlights: [
      "Four-way gravity with 90° and 180° turns, written in C++",
      "Camera, controls and physics props all follow the gravity direction",
      "Ten levels, keyboard and touch controls, saved progress",
    ],
    tags: ["Unreal Engine 5", "C++", "Character movement", "Enhanced Input", "Level design"],
    stats: [
      { v: "10", l: "levels" },
      { v: "16 days", l: "start to release" },
      { v: "4", l: "gravity directions" },
      { v: "276 MB", l: "download" }, // source: itch.io file list
    ],
    overview: [
      "The Gravity Flip is built around a single idea: what if gravity worked the other way? Spikes on the floor? Flip. Exit on the ceiling? Flip. Each level is a small box that only makes sense once you have turned it over a few times.",
      "It is less about difficulty than about the feeling of disorientation and flow as the world turns on its head. I built it alone in sixteen days, with the gameplay code in C++ and the levels, UI and effects in Blueprints.",
    ],
    systemsTitle: "How it works",
    systems: [
      { title: "A four-way gravity state", text: "The player controller tracks which way is down: floor, ceiling, left wall or right wall. Three inputs change it: turn 90° clockwise, turn 90° counter-clockwise, or flip 180°. Each one sets a new gravity direction on the character's movement component, so jumping, falling and walking all work on any surface." },
      { title: "The turn itself", text: "While gravity is changing, input is locked, the character drops to one-tenth speed and the camera rolls to the new orientation. Then time and control come back. That short slow-motion beat is what makes a mid-air flip readable instead of nauseating." },
      { title: "Left stays left", text: "When down becomes a wall, the character's sideways axis is now vertical in the world. The controller picks the new movement axis and adds or removes the negate modifier on the A and D key mappings at runtime, so the key that moves you left on screen always moves you left on screen." },
      { title: "Props that fall with you", text: "Physics objects turn off the engine's gravity and apply their own force every tick. When the player turns gravity, the controller finds every actor that implements `IGravityReceiverInterface` and hands it the new direction, so crates fall toward the same floor you do." },
      { title: "A camera with a dead zone", text: "A separate camera actor follows the character only once they leave a box in the middle of the frame, with lag on the spring arm. Which world axes count as horizontal and vertical swap when gravity goes sideways." },
      { title: "Progress and input mode", text: "A save file records which levels are finished and whether you play with a keyboard or on a touchscreen. The HUD loads a different overlay for each, and the level select unlocks from the saved list." },
    ],
    flow: {
      title: "What one key press does",
      steps: [
        { t: "Press E, Q or F", d: "Turn 90° either way, or flip 180°." },
        { t: "Lock and slow", d: "Input off, character at 0.1× time." },
        { t: "New down", d: "Movement component and every gravity receiver get the new direction." },
        { t: "Remap", d: "Movement axis and key modifiers updated." },
        { t: "Camera roll", d: "Camera rotates to match, then control returns." },
      ],
    },
    challenge: {
      title: "Making the flip feel right",
      steps: [
        ["Problem", "A responsive gravity flip caused trouble everywhere at once: which way the character faces, what counts as ground, how the camera follows, and what the movement keys mean when the floor is a wall."],
        ["Approach", "I tied everything to one gravity direction owned by the player controller. The character, the camera, the input mapping and the physics props all read from it or are told when it changes, instead of each guessing on its own."],
        ["Result", "Gravity can change mid-jump without breaking movement, and the controls stay predictable in all four orientations."],
      ],
    },
    notes: [
      {
        title: "A decision: no Android release",
        paragraphs: [
          "The game has touch controls and I took an Android build through closed testing on Google Play. It ran well on many phones, but a number of device-specific bugs turned up that would have taken significant time to fix.",
          "Windows was always the main platform, so I stopped the Android release rather than ship something uneven. Thanks to everyone who joined the testing.",
        ],
      },
    ],
    codebase: { lines: "1,769", files: 38 }, // source: wc -l on Source/
    shots: [
      { n: 1, w: 1920, h: 1080, alt: "Main menu with the orange robot character" },
      { n: 2, w: 1920, h: 1080, alt: "Level one: a vertical shaft with the exit at the bottom" },
      { n: 3, w: 1920, h: 1080, alt: "The level mid-rotation, tilted on screen" },
      { n: 4, w: 1920, h: 1080, alt: "A corridor with a pit of glowing spikes" },
      { n: 5, w: 1920, h: 1080, alt: "A long level seen at an angle while gravity turns" },
      { n: 6, w: 1920, h: 1080, alt: "Controls screen: choose touch or keyboard" },
      { n: 7, w: 1704, h: 960, alt: "Touch controls overlay with move and gravity buttons" },
    ],
    reviews: [
      { text: "The gravity-switching mechanic is genius! Makes every level feel fresh and challenging.", author: "Sujal", role: "Player" },
      { text: "Solid af game, works good, smooth, nice mechanic, good idea, keep it up.", author: "Tako", role: "Player" },
      { text: "Man.. it's already a great fun game. Also, the graphics are so good. I liked every aspect of it.", author: "Vivek", role: "Player" },
      { text: "Good mechanics, I like the concept. It feels a little bit too easy but overall great game. Waiting for more levels.", author: "Yash", role: "Player" },
      { text: "I enjoyed it while playing man, great work, waiting for more levels.", author: "Nitin", role: "Tester" },
      { text: "Amazing concept. It was a fun playthrough.", author: "Shreyash", role: "Player" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "aurarpg",
    name: "AuraRPG",
    font: "Pirata One",
    fontScale: 1.12,
    theme: { bg: "#0b072a", surface: "#161042", ink: "#eeeef8", muted: "#aaa5d2", accent: "#f3c969", onAccent: "#251a00" },
    fact: "10,000 lines of C++ on the Gameplay Ability System",
    art: { src: "key", pos: "50% 22%" },
    kind: "Top-down action RPG",
    year: "2025",
    pitch: "A top-down action RPG on Unreal's Gameplay Ability System: spells, attributes, enemy AI, save slots and a full UI, in about ten thousand lines of C++.",
    role: "Solo developer",
    period: "Jan – Apr 2025",
    status: "Playable demo · source on GitHub",
    engine: "Unreal Engine 5.5 · C++ · Blueprints · GAS", // source: Aura.uproject
    platform: "Windows, Linux", // source: Build/ folder and commit log
    links: [
      { label: "Source code", note: "GitHub", url: "https://github.com/Kalpu-24/Aura-RPG" },
      { label: "Download the demo", note: "Telegram", url: "https://t.me/KryoxxStudio/7/113" },
    ],
    highlights: [
      "About 10,000 lines of C++ on the Gameplay Ability System",
      "Seven spells, 22 attributes, four damage types with their own debuffs",
      "Six enemy variants on Behavior Trees and EQS, three save slots, checkpoints",
    ],
    tags: ["Unreal Engine 5", "C++", "Gameplay Ability System", "Behavior Trees", "EQS", "MVVM", "Niagara"],
    stats: [
      { v: "10,037", l: "lines of C++ in 134 files" }, // source: wc -l on Source/Aura
      { v: "7", l: "spells: 4 offensive, 3 passive" }, // source: AuraGameplayTags.cpp
      { v: "22", l: "gameplay attributes" }, // source: AuraAttributeSet.h
      { v: "72", l: "native gameplay tags" }, // source: AuraGameplayTags.cpp
    ],
    overview: [
      "AuraRPG is a top-down action RPG in the style of Diablo. You click to move, cast fire, lightning and arcane spells from a hotbar, level up, spend points on attributes and new spells, and fight through goblins, shamans, demons and ghouls that each attack differently.",
      "I built it while working through a long Gameplay Ability System course, as my way into Unreal's C++ side. The course targets Unreal 5.2; I built on 5.5, so a good part of the work was reading engine source and documentation to adapt what had changed. The demo levels at the end are my own.",
    ],
    systemsTitle: "What is in it",
    systems: [
      { title: "Ability system core", text: "A custom `UAuraAbilitySystemComponent` and `UAuraAttributeSet`. Abilities are granted, levelled, equipped to input slots and unlocked by level, with their state tracked through gameplay tags (locked, eligible, unlocked, equipped)." },
      { title: "Seven spells", text: "Fire Bolt (projectiles that home and spread as it levels), Fire Blast (a ring of fireballs that go out and come back), Electrocute (a beam that chains to nearby enemies) and Arcane Shards (a targeted area spell with a magic-circle cursor). Three passives: Halo of Protection, Life Siphon and Mana Siphon." },
      { title: "Attributes and damage", text: "Four primary attributes drive ten secondary ones through gameplay effects and custom modifier calculations. Four resistances, health and mana complete the set. All damage goes through one execution calculation." },
      { title: "Debuffs", text: "Each damage type can apply its own debuff: burn, stun, and arcane and physical effects. The chance is reduced by the target's resistance, and the damage, frequency and duration ride along in a custom gameplay effect context that is serialised for the network." },
      { title: "Enemies", text: "Six variants across three classes (warrior, ranger, elementalist): spear and slingshot goblins, demon warriors and rangers, ghouls, and a shaman that throws fire and summons minions. Behavior Trees pick the action; an EQS query finds ranged attackers a position with a clear shot." },
      { title: "Click-to-move", text: "A short click builds a navigation path, turns it into a spline and auto-runs the character along it. Holding the button moves directly toward the cursor. The same cursor trace highlights enemies and interactable objects in different colours." },
      { title: "UI", text: "Health and mana globes, XP bar, spell hotbar with cooldowns, attribute menu, a spell tree and floating damage numbers that show blocks and crits. Widgets never touch gameplay classes directly: three widget controllers broadcast changes to them, and the load screen uses Unreal's MVVM plugin." },
      { title: "Save and load", text: "Three save slots. Checkpoints save the player's level, XP, attributes and abilities, plus the state of world actors flagged for saving, and the game resumes at the right map and player start." },
      { title: "Loot, spawns and demo levels", text: "Enemies drop potions and crystals from chance-based loot tiers, and spawn volumes bring in waves as you enter an area. I added five showcase maps that walk a player through movement, checkpoints, levelling and enemy types, and end in a brawl arena with its own spawner class." },
    ],
    flow: {
      title: "What happens to a point of damage",
      intro: "Every hit in the game runs through `UExecCalc_Damage`, in this order.",
      steps: [
        { t: "Resist", d: "Each damage type is cut by the target's matching resistance, 0 – 100%." },
        { t: "Fall off", d: "Area spells scale by distance from the centre." },
        { t: "Block", d: "A roll against block rate. A block halves the hit." },
        { t: "Armor", d: "Armor, less the attacker's penetration, scaled by level curves." },
        { t: "Crit", d: "Crit chance less the target's crit resistance. A crit doubles the hit and adds bonus damage." },
      ],
    },
    challenge: {
      title: "Following a 5.2 course on 5.5",
      steps: [
        ["Problem", "The course was recorded on Unreal Engine 5.2 and I was on 5.5. Several systems, the Gameplay Ability System most of all, had breaking changes or deprecated nodes, and I was new to all of it."],
        ["Approach", "Whenever the course and the engine disagreed, I went to the 5.5 documentation, the engine source, community forums and GitHub discussions, worked out what had changed, and rewrote that part of the C++ or Blueprint logic to match."],
        ["Result", "A finished project on the newer engine, and practice at something that matters on long-lived codebases: working out what changed between versions and migrating code across it."],
      ],
    },
    notes: [
      {
        title: "Credits",
        paragraphs: [
          "The architecture follows the Udemy course \"Unreal Engine 5 – Gameplay Ability System – Top Down RPG\". Characters, environment pieces, particle effects, icons and sounds are the course's licensed assets. The showcase maps, the brawl spawner and the 5.5 port are mine.",
        ],
      },
    ],
    codebase: { lines: "10,037", files: 134 },
    shots: [
      { n: 1, w: 1920, h: 1080, alt: "Main menu: Aura, Master of the Elements" },
      { n: 2, w: 1920, h: 1080, alt: "A checkpoint crystal in a showcase level" },
      { n: 3, w: 1920, h: 1080, alt: "Level-one character facing enemies in the levelling showcase" },
      { n: 4, w: 1920, h: 1080, alt: "A level-up burst of golden particles" },
      { n: 5, w: 1920, h: 1080, alt: "The abilities menu with offensive and passive spell trees" },
      { n: 6, w: 1920, h: 1080, alt: "The attributes menu listing primary and secondary stats" },
      { n: 7, w: 1920, h: 1080, alt: "The enemy types showcase with shamans and demons" },
      { n: 8, w: 1920, h: 1080, alt: "A fire spell exploding in a crowd of enemies, with a Block message" },
      { n: 9, w: 1920, h: 1080, alt: "A lightning beam striking an enemy" },
      { n: 10, w: 1920, h: 1080, alt: "An arcane spell erupting among enemies" },
    ],
    reviews: [
      { text: "Great game with many fun abilities. Last level was diabolical though :)", author: "Shreyash", role: "Player" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "snakewall",
    name: "SnakeWall",
    font: "MLCD",
    fontScale: 0.92,
    theme: { bg: "#eeeef2", surface: "#ffffff", ink: "#141218", muted: "#5d5a66", accent: "#c8201b", onAccent: "#ffffff" },
    fact: "6k+ installs on Google Play",
    art: { src: "prop", pos: "50% 46%" },
    kind: "Android live wallpaper",
    year: "2024",
    pitch: "The classic Snake, rebuilt as an Android live wallpaper. The game is your home screen.",
    role: "Creator and maintainer",
    period: "Dec 2024 – Oct 2025",
    status: "On Google Play · v1.0.8 · open source", // source: app/build.gradle.kts, Play Store page
    engine: "Java · Android SDK · Canvas",
    platform: "Android 8.0 and later", // source: minSdk 26
    links: [
      { label: "Get it on Google Play", note: "Android", url: "https://play.google.com/store/apps/details?id=kalp.snake.wall" },
      { label: "Source code", note: "GitHub", url: "https://github.com/Kalpu-24/SnakeWall" },
    ],
    highlights: [
      "6k+ installs on Google Play and 28 stars on GitHub",
      "The whole game runs inside Android's wallpaper service, drawn on a Canvas",
      "Open source under MIT, with features contributed by other developers",
    ],
    tags: ["Java", "Android", "WallpaperService", "Canvas", "GitHub Actions", "Open source"],
    stats: [
      { v: "6k+", l: "Google Play installs" }, // source: previous site (Play Console); the public badge reads 5K+
      { v: "4.6", l: "store rating" }, // source: previous site
      { v: "28", l: "GitHub stars" }, // source: GitHub, 13 Nov 2026
      { v: "19 × 19", l: "board, with wrapping walls" }, // source: SnakeWallpaperService.java
    ],
    overview: [
      "SnakeWall puts a playable game of Snake on your Android home screen. Set it as your wallpaper, tap start, and steer with four on-screen buttons while your app icons sit on top.",
      "It began as an attempt to copy the Snake widget on Nothing phones, became a wallpaper when widgets turned out to be the wrong tool, and had a working release within a week. It has been on Google Play since January 2025, and is now at v1.0.8.",
    ],
    systemsTitle: "How it works",
    systems: [
      { title: "A game inside the wallpaper service", text: "There is no activity running the game. Everything lives in a `WallpaperService.Engine`: a game thread moves the snake and draws each frame to the wallpaper's surface with the Canvas API, and touches arrive through the wallpaper's own touch callback." },
      { title: "The board", text: "A 19 × 19 grid sized to the screen width. The snake is a linked list of grid coordinates: each step adds a head and removes the tail, and the walls wrap around to the opposite side." },
      { title: "Speed", text: "The game starts at one step every 200 ms. Every third piece of food shortens the step, in smaller amounts as it gets faster, so it ramps quickly at first and then levels out." },
      { title: "Being a good wallpaper", text: "A wallpaper must not drain the battery. The game pauses itself when the screen turns off, when the home screen is covered, and after ten seconds without input. The thread sleeps between steps, so nothing redraws faster than the snake moves." },
      { title: "Customisation", text: "Five colour themes, an option to change colours automatically, a grid toggle, a vibration toggle, and a custom image as the background with light or dark controls. A preview in the app renders the same game view before you apply it." },
      { title: "Releases", text: "GitHub Actions builds debug and signed release APKs. The best score is kept in shared preferences, and the app collects no data." },
    ],
    challenge: {
      title: "From widget to wallpaper",
      paragraphs: [
        "The first plan was a home-screen widget like Nothing's. I wrote a custom view for the game with swipe gestures, then hit the wall: Android widgets cannot run a custom view or a game loop.",
        "I posted about being stuck on my Telegram channel, and someone suggested a live wallpaper instead. A wallpaper gets a real drawing surface and its own touch events, which is everything the game needed.",
        "One limit remained. A swipe on the home screen belongs to the launcher: it opens the app drawer or the notification shade. So the game uses four on-screen buttons, and that constraint ended up defining how it looks.",
      ],
    },
    codebase: { lines: "2,521", files: 11 }, // source: wc -l on app/src/main/java
    video: { src: "assets/games/snakewall/demo.mp4", w: 576, h: 1280, caption: "Forty seconds of SnakeWall running as a wallpaper." },
    shots: [
      { n: 1, w: 230, h: 512, alt: "The SnakeWall icon on a blank screen" },
      { n: 2, w: 230, h: 512, alt: "The app's home screen with preview, themes and settings tiles" },
      { n: 3, w: 230, h: 512, alt: "Wallpaper preview with the start button and direction pad" },
      { n: 4, w: 230, h: 512, alt: "Theme picker showing light and dark themes" },
      { n: 5, w: 230, h: 512, alt: "Settings sheet with the grid toggle" },
    ],
    reviews: [
      { text: "Pretty creative stuff.", author: "HowToMen", role: "YouTuber" },
      { text: "Uniquely fresh idea which brings back nostalgic memories. +1 for the haptic support since it feels premium with the haptics.", author: "Raj", role: "Android user" },
      { text: "A super creative idea! Playing Snake right on the wallpaper is both fun and unique, never seen anything like it.", author: "Sujal", role: "Android user" },
      { text: "Didn't expect to be playing Snake on my home screen lol. Super fun as always and works smoothly.", author: "Adarsh", role: "Android user" },
      { text: "Unique idea, it works really well, I can spend hours playing the snake game and never get tired of it :)", author: "Pie", role: "Android user" },
      { text: "Is a great app. Is so cool and simple.", author: "nevulastra", role: "Android user" },
    ],
    toy: { kind: "snake", title: "Play it here", text: "The wallpaper's rules in your browser: a 19 × 19 board, walls that wrap, and a step that gets shorter every third piece of food. Arrow keys or the buttons." },
  },
];
