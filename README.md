<div align="center">

# 💬 Sarahah App Frontend

A modern anonymous messaging platform built with **Next.js 16**, **React 19**, and **TypeScript**, focused on secure authentication, modular architecture, and a smooth user experience.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Frontend for the **Sarahah App** .

</div>

---

## 🔗 Links

[![Frontend Repository](https://img.shields.io/badge/Frontend-Repository-181717?style=for-the-badge&logo=github)](https://github.com/e-mustafa/saraha-app-frontend)

[![Backend Repository](https://img.shields.io/badge/Backend-Repository-181717?style=for-the-badge&logo=github)](https://github.com/e-mustafa/saraha-app)

[![Live Demo](https://img.shields.io/badge/Live-Demo-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://github.com/e-mustafa/saraha-app)

[![Backend API](https://img.shields.io/badge/API-Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://saraha-app-back.vercel.app/)

---

# 📖 Overview

Sarahah App is a full-stack anonymous messaging platform that allows users to exchange anonymous or identified messages in a secure and user-friendly environment.

This repository contains the frontend application built with **Next.js App Router**. It communicates with an Express.js backend through a secure proxy layer while using modern React patterns for state management, data fetching, and form handling.

The project focuses on:

- Clean and maintainable architecture
- Secure authentication
- Responsive user experience
- Reusable UI components
- Modern frontend best practices

---

# ✨ Features

| 🔐 Authentication     | Messaging             | User Experience        |
| --------------------- | --------------------- | ---------------------- |
| ✅ Email Login        | ✅ Anonymous Messages | ✅ Dark Mode           |
| ✅ Google Login       | ✅ Public Messages    | ✅ RTL/LTR             |
| ✅ OTP                | ✅ Favorites          | ✅ Responsive          |
| ✅ Reset Password     | ✅ Image Upload       | ✅ Accessibility       |
| ✅ Email Verification | ✅ Audio Recording    | ✅ Toast Notifications |

---

## 💬 Messaging

- Anonymous messages
- Identified messages
- Public messages
- Private messages
- Favorite messages
- Sent messages
- Received messages
- Categorized inbox

---

## 🎙️ Media

- Image upload
- Audio recording
- Audio playback
- Media preview

---

## 🌍 Internationalization

- English
- Arabic
- RTL support
- LTR support
- Localized validation messages

---

## 🎨 User Experience

- Responsive layout
- Dark mode
- Light mode
- Deferent themes
- Accessible UI components
- Toast notifications
- Modern form validation

---

# 🛠 Tech Stack

| Category      | Technologies                         |
| ------------- | ------------------------------------ |
| Framework     | Next.js 16, React 19, TypeScript     |
| Styling       | Tailwind CSS v4, Shadcn UI, Radix UI |
| Forms         | React Hook Form, Zod                 |
| Server State  | TanStack Query                       |
| Client State  | Zustand                              |
| Localization  | next-intl                            |
| Icons         | Lucide React                         |
| Notifications | Sonner                               |

<!-- ---

# 📷 Screenshots

| Home | Inbox |
|------|------|
| ![](docs/images/home.png) | ![](docs/images/inbox.png) |

| Message | Profile |
|------|------|
| ![](docs/images/message.png) | ![](docs/images/profile.png) |

| Settings | Dark Mode |
|------|------|
| ![](docs/images/settings.png) | ![](docs/images/dark.png) | -->

---

# 🎯 Design Goals

The frontend was designed with the following goals:

- Modular code organization
- Reusable components
- Type safety
- Secure authentication flow
- Responsive layouts
- Scalable project structure
- Maintainable codebase
- Good developer experience

---

# ⭐ Highlights

- Next.js App Router
- React Server Components
- Feature-based architecture
- Secure authentication flow
- Automatic token refresh
- Type-safe API communication
- RTL/LTR support
- Dark mode
- Responsive design
- Modern React ecosystem

---

# 🏗 Project Architecture

The frontend follows a feature-based modular architecture that separates business logic, UI components, API communication, and shared utilities. This structure keeps features isolated, improves maintainability, and makes the application easier to scale.

```text

src
├── app                 # App Router pages, layouts and API routes
│   ├── [locale]
│   ├── api
│   └── ...
│
├── modules
│   ├── auth
│   ├── messages
│   ├── profile
│   ├── settings
│   └── shared
│
├── providers          # Global application providers
├── shared
│   ├── components
│   ├── hooks
│   ├── services
│   ├── utils
│   ├── config
│   └── types
│
├── i18n              # Localization configuration
└── proxy.ts          # Authentication & localization middleware
```

Each feature module contains its own components, hooks, validation schemas, services, API requests, and business logic to reduce coupling between features.

---

# 🔐 Authentication Flow

Authentication is handled using **HTTP-only cookies** together with **JWT Access Tokens** and **Refresh Tokens**.

Instead of exposing access tokens to the browser, requests are forwarded through a Next.js proxy layer.

```text
Browser
      │
      ▼
Next.js Proxy Route
      │
      ▼
Express API
      │
      ▼
MongoDB
```

This approach keeps authentication tokens outside the client-side application and centralizes API communication.

---

# 🔄 Automatic Token Refresh

When an access token expires, the frontend automatically refreshes the session without interrupting the user experience.

The refresh process is synchronized to prevent multiple simultaneous refresh requests.

```text
API Request
      │
      ▼
401 Unauthorized
      │
      ▼
Refresh Token Request
      │
      ▼
Receive New Tokens
      │
      ▼
Retry Original Request
```

Only one refresh request is executed even if multiple API calls fail simultaneously.

---

# 🌐 API Layer

All communication with the backend is handled through a centralized API client.

Features include:

- Centralized request handling
- Automatic JSON serialization
- FormData support
- Global error handling
- Automatic token refresh
- Request retry after successful refresh
- Typed API responses
- Custom API error objects

This keeps API logic out of UI components and provides a consistent developer experience.

---

# 🔀 Next.js Proxy Layer

The application uses internal Next.js API routes as a proxy between the browser and the backend API.

Benefits include:

- HTTP-only cookie support
- No access token exposure
- Simplified API calls
- Unified request handling
- Secure Authorization header injection

---

# 🛡 Route Protection

Authentication is enforced using **Next.js Middleware**.

The middleware is responsible for:

- Locale detection
- Protected route handling
- Guest-only route protection
- Automatic token refresh
- Session validation
- Authentication redirects

---

# 📦 State Management

The application separates client state from server state.

## Client State

Managed using **Zustand** for lightweight global state such as UI state and client-side interactions.

## Server State

Managed using **TanStack Query**, providing:

- Request caching
- Automatic cache invalidation
- Background refetching
- Retry strategies
- Mutation management

This separation keeps application state predictable and easy to maintain.

---

# 🌍 Internationalization

Localization is implemented using **next-intl**.

Features include:

- English
- Arabic
- RTL support
- LTR support
- Locale-aware routing
- Localized validation messages

---

# ✅ Form Handling

Forms are built using:

- React Hook Form
- Zod validation

Benefits:

- Type-safe validation
- Reusable schemas
- Better performance
- Cleaner form components

---

# 🎨 UI System

The interface is built using reusable UI components powered by:

- Shadcn UI
- Radix UI
- Tailwind CSS

The design system supports:

- Dark mode
- Responsive layouts
- Accessible components
- Consistent spacing
- Reusable form controls

---

# ⚙ Error Handling

The application provides centralized error handling through a custom API layer.

Features include:

- Global API errors
- Toast notifications
- Validation error support
- Authentication error handling
- Session expiration detection

---

# 🚀 Performance Optimizations

Several techniques are used to improve performance and user experience.

- React Server Components
- App Router
- Route-based code splitting
- Lazy loading
- Optimized API caching
- Request deduplication
- Automatic retry strategy
- Exponential backoff
- Efficient re-rendering with Zustand
- Type-safe API communication

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js 20+
- npm / pnpm / yarn
- Running Sarahah App Backend

---

## Installation

Clone the repository:

```bash
git clone https://github.com/e-mustafa/saraha-app-frontend.git
```

Navigate to the project:

```bash
cd saraha-app-frontend
```

Install dependencies:

```bash
npm install
```

or

```bash
pnpm install
```

---

# ⚙ Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

> Adjust the values according to your backend configuration.

---

# ▶ Running the Project

Development

```bash
npm run dev
```

Production Build

```bash
npm run build
```

Start Production Server

```bash
npm run start
```

Lint

```bash
npm run lint
```

---

# 📦 Deployment

The frontend is designed to be deployed independently from the backend.

Recommended platforms:

- Vercel
- Netlify
- Self-hosted Node.js server

The backend can be deployed separately and configured using environment variables.

---

# 🤝 Working with the Backend

This frontend communicates with the dedicated Express.js backend.

Repository:

```
https://github.com/e-mustafa/saraha-app
```

The backend provides:

- Authentication
- Google OAuth
- JWT & Refresh Tokens
- Anonymous Messaging
- Public Messages
- Image Uploads
- Record Voice Note and Uploads
- Email Verification
- Password Reset
- Change Email
- Rate Limiting
- Request Validation
- Encryption
- Redis Session Management

---

# 💡 Technical Decisions

Several implementation choices were made to improve maintainability and security.

### Why Next.js Proxy Routes?

Instead of exposing backend endpoints directly to the browser, all requests pass through internal Next.js API routes.

This allows:

- HTTP-only cookie authentication
- Authorization header injection
- Centralized request handling
- Simplified frontend API calls

---

### Why TanStack Query?

Server state is managed separately from client state.

Benefits include:

- Request caching
- Background refetching
- Retry strategies
- Mutation lifecycle management
- Reduced boilerplate

---

### Why Zustand?

Only client-side UI state is stored in Zustand.

This keeps the global store lightweight while leaving server data to TanStack Query.

---

### Why Feature-Based Modules?

Organizing the project by feature instead of file type makes it easier to:

- Scale the application
- Isolate business logic
- Reuse components
- Maintain large codebases

---

<!-- # 📄 Project Status

This project is actively maintained and new features are continuously being added and improved.

Future improvements may include:

- Real-time messaging
- Push notifications
- Advanced search
- User blocking
- Message reactions
- PWA support

--- -->

<!-- # 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

If you find a bug or have an idea for improvement:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request -->

---

# 👨‍💻 Author

**Mustafa AbuTabl**

Frontend Developer

<p align="left">

<a href="https://github.com/e-mustafa">
<img src="https://img.shields.io/badge/GitHub-e--mustafa-181717?style=for-the-badge&logo=github">
</a>

<a href="https://linkedin.com/in/e-mustafa">
<img src="https://img.shields.io/badge/LinkedIn-Mustafa_AbuTabl-0A66C2?style=for-the-badge&logo=linkedin">
</a>

<a href="https://e-mustafa.github.io/portfolio">
<img src="https://img.shields.io/badge/Portfolio-Visit-5B21B6?style=for-the-badge&logo=googlechrome&logoColor=white">
</a>

<a href="mailto:eng.mustafa@hotmail.com">
<img src="https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail&logoColor=white">
</a>

</p>

---

If you found this project useful or interesting, consider giving it a ⭐ on GitHub.
