# Shadow Rift - Gacha RPG

Mobile-first browser Gacha RPG built for GitHub + Railway.

## Features

- Mobile web game UI
- Gacha summon system
- R / SR / SSR / UR rarity rates
- Hero inventory
- 5-hero team system
- Hero upgrades
- Auto campaign battle
- Daily reward
- Local save using browser localStorage
- Custom SVG character artwork and animated CSS

## Run on Railway

1. Open Railway
2. New Project
3. Deploy from GitHub repo
4. Choose this repository
5. Railway will detect Node.js
6. Start command: `npm start`

No environment variables are required for this version.

## Local run

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## Notes

This is the first playable MVP. Data is saved inside the player browser. For a bigger online version, add PostgreSQL accounts, admin panel, payment shop, events, and anti-cheat.
