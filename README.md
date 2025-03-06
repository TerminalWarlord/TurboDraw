# TurboDraw

TurboDraw is a high-performance, real-time collaborative drawing app built with **Turborepo**. Inspired by Excalidraw, it provides a smooth and interactive drawing experience using **Next.js** for the frontend, **Bun** for the backend, and **Prisma** for database management.

## 🚀 Getting Started

### Prerequisites
- **Bun** (latest version)
- **PostgreSQL** (or any database supported by Prisma)

### Installation
Clone the repository:

```sh
 git clone https://github.com/TerminalWarlord/TurboDraw.git
 cd TurboDraw
 bun install
```

### Running the Development Environment



### Database Setup
Create `.env` and add `DATABASE_URL` into `packages/db`
```sh
cd packages/db
bun prisma migrate dev
```

Install the dependencies and run the frontend, backend and ws altogether:
```sh
bun install
bun dev
```


## 📁 Project Structure

```
TurboDraw/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── ws/           # Bun-based WebSocket backend
│   ├── backend/      # Bun-based Express backend 
│
├── packages/
│   ├── db/      # Prisma database setup
│   ├── typescript-config/ # Shared TypeScript config
│
├── turbo.json   # Turborepo configuration
```

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Bun, WebSockets, Express, JWT, Bcrypt, ZOD
- **Database:** PostgreSQL, Prisma
- **Monorepo:** Turborepo

## ✨ Features
✅ Hand-drawn style sketches 🎨  
✅ Real-time collaboration 🔄  
✅ Multi-device support 📱💻  
✅ WebSockets-powered backend ⚡  
✅ Prisma for scalable database management 📊  

## 🚀 Deployment
### Build
To build all apps and packages:
```sh
bun build
```

### Remote Caching with Vercel
To enable Turborepo remote caching:
```sh
bun turbo login
bun turbo link
```

## 📜 License
[MIT License](LICENSE)

---

Made with ❤️ by TurboDraw contributors.

