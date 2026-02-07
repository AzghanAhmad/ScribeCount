# ScribeCount Intelligence Platform

<div align="center">

![ScribeCount](https://img.shields.io/badge/ScribeCount-Intelligence%20Platform-7c3aed?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-21-dd0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-Private-gray?style=for-the-badge)

**An end-to-end intelligence platform for authors connecting marketing actions, reader behavior, sales outcomes, and attribution into a single explainable system.**

</div>

---

## 📖 Overview

ScribeCount is a comprehensive analytics and marketing intelligence platform designed specifically for authors. It provides a unified system that tracks the entire journey from marketing campaigns to sales conversions, offering actionable insights and explainable analytics.

## ✨ Core Features

### 🔗 ScribeCount Linking (Intent Layer)
- Create canonical marketing links
- Intelligent traffic routing
- Immutable click event capture
- Campaign and context metadata attachment
- Attribution engine integration

### 📊 Website Traffic (Behavior Layer)
- First-party event tracking
- Page views and engagement metrics
- Funnel and conversion tracking
- Heatmap aggregation
- Daily behavioral snapshots

### 💰 Sales & Revenue Layer
- Retail sales ingestion
- Direct sales ingestion
- Refund and adjustment handling
- Profit normalization

### 🎯 Attribution Engine
- Deterministic attribution for direct sales
- Probabilistic models for retailers
- Confidence scoring
- Incrementality evaluation
- Versioned output records

### 📧 ScribeCount Email
- Campaign sending & management
- Automation flows
- Audience segmentation
- Deliverability monitoring
- Signal event generation

### 🤖 Hey ScribeCount Intelligence
- Natural language query processing
- Analytics API consumption
- Explanation generation
- Automated report creation
- Follow-up action suggestions

---

## 🏗️ Project Structure

```
project/
├── frontend/          # Angular 21 application
│   ├── src/
│   │   ├── app/       # Application components & pages
│   │   └── ...
│   └── ...
├── backend/           # .NET API (in development)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **Angular CLI** (v21)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file and configure
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the development server |
| `npm run build` | Build for production |
| `npm run ng` | Run Angular CLI commands |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Angular 21
- **Language:** TypeScript 5.9
- **Charting:** Chart.js 4.5
- **State Management:** RxJS 7.8

### Backend (Planned)
- **.NET Core** API
- **MySQL** Database (Railway deployment)

---

## 📐 Engineering Principles

1. **First-party data only** - No third-party tracking dependencies
2. **Event-driven architecture** - Loosely coupled, scalable design
3. **Immutable source data** - Data integrity at the core
4. **Additive attribution overlays** - Flexible attribution models
5. **Explainable analytics** - Transparent, understandable insights
6. **Loose service coupling** - Independent, maintainable services

---

## 🔄 System Flow

```
Author Actions → ScribeCount Links → Website Traffic → Sales Data 
       ↓
Attribution Engine → Unified Reporting → Hey ScribeCount Intelligence
```

---

## 📄 License

This project is **private** and proprietary. All rights reserved.

---

<div align="center">

**Built by Azghan Ahmad for ScribeCount Authors**

</div>
