# AlisonAI

A collaborative real-time application built with React and TypeScript, featuring modular architecture and comprehensive testing.

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/giorgi-dogadze/alisonai.git
cd alisonai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Implementation Notes

### Tech Stack
- **Vite** - Fast build tool and development server
- **Shadcn/ui** - Component library for consistent UI
- **Tailwind CSS** - Utility-first CSS framework
- **Prettier & ESLint** - Code formatting and linting
- **Jest** - Testing framework with full coverage

### Project Structure
The project follows a modular, feature-based architecture:
- **Features folder**: Isolated modules organized by functionality
- Each feature contains:
  - `components/` - Feature-specific UI components
  - `hooks/` - Custom React hooks for business logic
  - `index.ts` - Public API exports

### Key Features
- **Collaborative Chat** - Real-time messaging with typing indicators
- **Shared Counter** - Synchronized counter across sessions
- **User Presence** - Real-time user activity tracking
- **Collaborative Sessions** - Multi-user interaction support

### Testing
- All functionality is covered with Jest unit tests
- Test files are co-located with their implementation
- Run tests with `npm test` or `npm run test:coverage`
