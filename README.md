# Jamestown

Jamestown is a web-based educational and interactive experience. It is structured to provide both gameplay and informational content, separating core mechanics from contextual pages. The site is minimal, functional, and designed for clarity.

## Pages

- **Home** – General context, introduction to Jamestown, and overview of the site’s purpose.
- **Culture** – Insights into the social and cultural life within the Jamestown scenario.
- **Relation Tips** – Practical advice for navigating interpersonal dynamics in the game context.
- **Legacy** – Discussion of outcomes, consequences, and how choices propagate over time.
- **Game** – The interactive survival component where users make decisions and see results.
- **Leaderboard** – Displays performance metrics of users sorted by time or score, updated dynamically.

## Structure

- `src/components/` – Contains UI elements such as the game board, leaderboard, and header.
- `src/pages/` – Astro pages for routing, connecting components and content.
- `public/` – Static assets like images or icons.

## Getting Started

1. Install dependencies:
```bash
npm install astro
npx install react 


```
npm run dev
Visit http://localhost:4321 to access the site locally.

Data Flow

Game actions produce results stored via backend endpoints.

Leaderboard fetches, sorts, and displays user data.

Components remain decoupled for clarity and predictable behavior.

Purpose

The site combines interactive gameplay with informational context. Each page and component is designed to be legible, modular, and extendable. The goal is to provide an experience that is both instructive and functional, without unnecessary complexity.

Contributing

Report issues or suggest improvements.

Pull requests should maintain clarity and modularity.

Contributions should respect the minimal and transparent structure of the project.
