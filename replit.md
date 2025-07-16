# ColorCraft - Smart Color Palette Generator

## Overview

ColorCraft is a modern web application designed for generating, managing, and sharing color palettes. It provides designers and developers with AI-powered color naming, image color extraction, contrast checking, and professional export capabilities. The application features a clean, responsive interface with both light and dark themes.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **State Management**: React hooks with custom hooks for palette management
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-based session storage
- **API Structure**: RESTful endpoints for palette operations
- **Storage Strategy**: Dual approach with in-memory storage for development and PostgreSQL for production

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Type Safety**: Full TypeScript coverage across client, server, and shared modules
- **Path Aliases**: Configured for clean imports (`@/`, `@shared/`)

## Key Components

### Color Management
- **Color Utilities**: Functions for color conversion, brightness calculation, and random palette generation
- **Color Naming**: AI-like color naming system with extensive color database
- **Contrast Checking**: WCAG compliance checking with accessibility grading

### User Interface
- **Palette Grid**: Interactive color cards with click-to-copy functionality
- **Theme System**: Light/dark mode with persistent user preference
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Modal System**: Multiple specialized modals for different functions

### Data Persistence
- **Local Storage**: Client-side palette saving with custom hooks
- **Database Schema**: Palette storage with shareable links
- **Export Functionality**: Multiple export formats (JSON, PNG, SCSS)

## Data Flow

1. **Palette Generation**: Random color generation or image extraction creates initial palette
2. **User Interaction**: Users can edit individual colors, save palettes, or share them
3. **Data Persistence**: Palettes saved locally in browser storage or shared via database
4. **Export/Import**: Palettes can be exported in various formats or loaded from share links

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error handling in development

## Deployment Strategy

### Build Process
1. **Client Build**: Vite builds React application to `dist/public`
2. **Server Build**: ESBuild compiles Express server to `dist/index.js`
3. **Database Migration**: Drizzle handles schema migrations

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **NODE_ENV**: Environment-specific behavior
- **Session Configuration**: PostgreSQL-based session storage

### Production Deployment
- Static assets served from `dist/public`
- Express server handles API routes and serves client application
- Database migrations run automatically via Drizzle

## Changelog
- July 07, 2025. Initial setup
- July 07, 2025. Added PostgreSQL database with enhanced schema (isPublic, metadata fields)
- July 07, 2025. Created DatabaseStorage class and switched from MemStorage to PostgreSQL
- July 07, 2025. Enhanced palette storage with metadata support for advanced features

## User Preferences

Preferred communication style: Simple, everyday language.