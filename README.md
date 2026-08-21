# RouteWise AI

### Your Intelligent Travel Companion

[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://routewiseai-dun.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-Framework-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-Library-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Maps-7EBC6F?style=flat-square&logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org/)
[![Recharts](https://img.shields.io/badge/Recharts-Analytics-8884D8?style=flat-square)](https://recharts.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

A modern, intelligent travel companion designed to simplify trip planning, organize travel information, manage expenses, prepare packing lists, explore destinations, and preserve travel memories in one unified workspace.

---

## Overview

RouteWise AI is a local-first travel planning and management platform built to make the entire travel journey more organized and personalized.

Instead of switching between multiple applications for itineraries, maps, packing lists, expenses, journals, and travel information, RouteWise AI brings these experiences together through a single connected travel workspace.

The platform provides:

- Intelligent Trip Planning
- Personalized Itinerary Generation
- Context-Aware Packing
- Destination Exploration
- Interactive Maps
- Expense & Budget Tracking
- Travel Journal
- Trip Timeline & Memories
- RouteWise Travel Assistant
- Travel Safety Center

---

## Problem Statement

Travel planning is often fragmented across multiple applications and services.

Travelers commonly face:

- Scattered itinerary information
- Manual trip planning
- Forgotten travel essentials
- Difficult expense tracking
- Generic recommendations
- Separate tools for maps and destinations
- Disconnected travel memories
- Limited visibility into the complete journey

RouteWise AI addresses these challenges through a unified travel workspace that connects planning, organizing, traveling, and remembering.

---

## Live Demo

**https://routewiseai-dun.vercel.app/**

[![Open RouteWise AI](https://img.shields.io/badge/OPEN-ROUTEWISE_AI-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://routewiseai-dun.vercel.app/)

---

## Core Features

### Intelligent Trip Planner

Create personalized trips using:

- Destination
- Travel dates
- Duration
- Number of travelers
- Budget
- Interests
- Travel style

The local intelligence engine uses these preferences to generate a structured travel plan.

### Personalized Itinerary

Create and manage day-by-day travel schedules containing:

- Activities
- Locations
- Timings
- Duration
- Categories
- Estimated costs
- Descriptions

Users can customize activities and track trip progress.

### Context-Aware Packing

Generate personalized packing recommendations based on:

- Destination
- Duration
- Weather
- Activities
- Travel style

Users can manage their checklist by adding, removing, and completing items.

### Destination Explorer

Discover travel destinations through organized information covering:

- Attractions
- Food
- Culture
- Activities
- Photography spots
- Shopping
- Family experiences
- Hidden gems

### Interactive Maps

Built using OpenStreetMap and Leaflet to display:

- Attractions
- Itinerary locations
- Saved places
- Travel points
- Emergency locations

### Expense & Budget Tracker

Track travel spending across categories such as:

- Accommodation
- Food
- Transport
- Shopping
- Activities
- Entertainment
- Miscellaneous

Provides budget usage, remaining balance, and spending analytics.

### Travel Journal & Memories

Capture the journey through:

- Journal entries
- Notes
- Photos
- Locations
- Important moments

### Trip Timeline

Provides a chronological view of the complete journey including:

- Activities
- Visited locations
- Expenses
- Journal entries
- Memories
- Custom events

### RouteWise Assistant

A context-aware travel assistant designed around the user's trip information.

It can help with:

- Itinerary questions
- Packing suggestions
- Budget information
- Trip summaries
- Activity planning
- Travel recommendations

### Safety Center

Provides organized travel safety information including:

- Emergency information
- Police
- Hospitals
- Fire services
- Safety guidelines
- Emergency locations

---

## Intelligent Travel Architecture

```text
                     USER PREFERENCES
                            │
                            ▼
                   ┌─────────────────┐
                   │   Trip Profile  │
                   └────────┬────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
     Destination          Budget          Interests
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                ┌──────────────────────┐
                │ Local Intelligence   │
                │       Engine         │
                └──────────┬───────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     Itinerary         Packing       Recommendations
       Engine            Engine            Engine
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                  Personalized Trip
