# FromFarmToFork

**A dual-interface AI-powered marketplace connecting local farmers with consumers — built for Maastricht University's Critical Making course (SDG 12).**

![React](https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react) ![Gemini](https://img.shields.io/badge/Google-Gemini_API-4285F4?logo=google) ![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite) ![Built with AI Studios](https://img.shields.io/badge/Built_with-Google_AI_Studios-orange)

---

## What is this?

FromFarmToFork is a web application with two separate interfaces:

- **Farmer Interface** — allows local farmers to list, manage, and promote their produce
- **Buyer Interface** — lets consumers browse, filter, and discover local food in their region

The app uses the **Google Gemini API** to enhance listings with AI-generated descriptions and to provide smart filtering and recommendations for buyers.

---

## Background

This project was built as the final prototype for a **Critical Making** course at [Universiteit Maastricht](https://www.maastrichtuniversity.nl/) (Exchange semester, Digital Society programme). The project addressed **UN Sustainable Development Goal 12** — Responsible Consumption and Production — specifically targeting food waste in regional supply chains.

### Problem
Local farmers in the Limburg region struggle to reach consumers directly, leading to surplus produce going unsold while consumers lack visibility into locally available food.

### Process
The project followed a full **Design Thinking** methodology:
1. **Empathize** — Interviews with local farmers, surveys with student consumers
2. **Define** — Key insight: the barrier is discoverability, not supply
3. **Ideate** — Brainstorming sessions, stakeholder personas, empathy maps
4. **Prototype** — Full working web app (this repository)
5. **Test** — User testing with both farmer and consumer personas

---

## Features

| Interface | Features |
|---|---|
| **Farmer** | Add/edit produce listings · Set availability and price · AI-assisted description generation · Dashboard overview |
| **Buyer** | Browse local produce · Filter by type, distance, availability · AI-powered search · Seller contact |

---

## Tech Stack

| | |
|---|---|
| Framework | React · TypeScript · Vite |
| AI | Google Gemini API (`gemini-pro`) |
| Styling | CSS Modules / Tailwind |
| Built with | Google AI Studios |

---

## Run Locally

**Prerequisites:** Node.js

```bash
# 1. Install dependencies
npm install

# 2. Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 3. Start the dev server
npm run dev
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com).

---

## About the Build

This app was built entirely using **Google AI Studios** (Google's Gemini-based development environment) — no manual TypeScript was written. This was a deliberate methodological choice: to explore how far AI-native development can take a non-programmer in a real-world product context.

> "AI Studios let me focus entirely on the product design and user needs rather than implementation details. The result is a working prototype app that would have taken weeks to build traditionally." — Tim Sager

---

## University Context

| | |
|---|---|
| University | Universiteit Maastricht |
| Programme | Digital Society (Exchange) |
| Course | Critical Making |
| SDG | 12 — Responsible Consumption & Production |
| Team role | Project lead & sole prototype developer |
| Year | 2024/25 |
