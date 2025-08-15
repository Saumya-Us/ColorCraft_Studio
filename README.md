# 🎨 ColorCraft Studio

**ColorCraft Studio** is a full-featured, modern color palette generator web app built with React, TypeScript, and Vite. It empowers designers and developers to create, edit, and share beautiful color palettes with advanced tools for accessibility, color theory, and real-world UI previews.

![ColorCraft Studio](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.2-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 Features

### 🎨 **Core Palette Generation**
- **Random Generation**: Instantly generate beautiful random color palettes
- **Mood-Based Generation**: Create palettes inspired by specific moods and emotions
- **Image Color Extraction**: Upload images to extract dominant colors automatically
- **Color Theory Harmonies**: Apply professional color theory (analogous, complementary, triadic, etc.)

### 🖌️ **Advanced Editing Tools**
- **Interactive Color Editor**: Edit individual colors with precision color pickers
- **Drag & Drop Reordering**: Easily reorder colors in your palette
- **Color Locking**: Lock specific colors while regenerating others
- **Undo/Redo System**: Full history management for your palette changes

### 🧠 **AI-Powered Features**
- **Mood Generator**: AI-driven palette creation based on mood keywords
- **Smart Color Suggestions**: Intelligent recommendations for color combinations
- **Accessibility Improvements**: AI-suggested alternatives for better accessibility

### ♿ **Accessibility Tools**
- **Color Blindness Simulation**: Preview how your palette looks to users with different types of color blindness
- **Contrast Ratio Checker**: Ensure your colors meet WCAG accessibility guidelines
- **Accessibility Suggestions**: Get recommendations for more accessible color combinations
- **Real-time Contrast Analysis**: Live feedback on text readability

### 🖼️ **UI Preview & Export**
- **Real UI Components**: See your palette applied to actual UI components (cards, forms, buttons)
- **Multiple Export Formats**: Export as JSON, PNG, SCSS variables, or CSS custom properties
- **QR Code Generation**: Create shareable QR codes for your palettes
- **High-Resolution Export**: Export palettes in various sizes and formats

### 💾 **Save & Share**
- **Local Storage**: Save palettes locally in your browser
- **Shareable Links**: Generate unique URLs to share your palettes
- **Palette Management**: Organize, rename, and delete saved palettes
- **Import/Export**: Backup and restore your palette collections

### 🎨 **Gradient Generator**
- **Multi-Color Gradients**: Create beautiful gradients from your palette colors
- **Gradient Types**: Linear, radial, and custom gradient patterns
- **CSS Code Generation**: Get ready-to-use CSS gradient code

### 🌗 **Theme Support**
- **Dark/Light Mode**: Seamless switching between themes
- **System Theme Detection**: Automatically match your system preferences
- **Persistent Preferences**: Your theme choice is remembered

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saumya-Us/ColorCraft_Studio.git
   cd ColorCraft_Studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see ColorCraft Studio in action!

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/public` directory.

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.9.2** - Type-safe development
- **Vite 7.1.2** - Fast build tool and dev server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### UI Components
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Class Variance Authority** - Type-safe component variants
- **Tailwind Merge** - Intelligent class merging

### State Management
- **TanStack Query** - Server state management
- **React Hooks** - Local state management
- **Local Storage** - Persistent data storage

### Routing
- **Wouter** - Lightweight routing solution

## 📁 Project Structure

```
ColorCraftStudio/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Base UI components (buttons, inputs, etc.)
│   │   │   └── modals/    # Modal components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and helpers
│   │   ├── pages/         # Page components
│   │   └── main.tsx       # Application entry point
│   └── index.html         # HTML template
├── server/                # Backend server (if applicable)
├── shared/                # Shared types and utilities
├── attached_assets/       # Static assets
└── dist/                  # Build output
```

## 🎯 Key Components

### Enhanced Palette Grid
The main palette display with drag-and-drop reordering, color editing, and locking capabilities.

### Mood Generator
AI-powered palette generation based on mood keywords and emotional associations.

### Accessibility Panel
Comprehensive accessibility tools including color blindness simulation and contrast checking.

### Gradient Generator
Create beautiful gradients from your palette colors with CSS code generation.

### UI Preview
See your palette applied to real UI components like cards, forms, and buttons.

### Save/Share Modals
Manage palette saving and sharing with QR code generation.

## 🎨 Usage Guide

### Creating Your First Palette

1. **Generate a Random Palette**
   - Click the "Generate" button to create a random color palette
   - Use the dice icon for quick generation

2. **Customize Colors**
   - Click on any color to open the color picker
   - Adjust hue, saturation, and brightness
   - Lock colors you want to keep while regenerating others

3. **Apply Color Theory**
   - Use the "Color Theory Tips" section to apply professional harmonies
   - Choose from analogous, complementary, triadic, and more

4. **Check Accessibility**
   - Switch to the "Accessibility" tab
   - Simulate different types of color blindness
   - Check contrast ratios for text readability

5. **Save Your Palette**
   - Click "Save Palette" to store it locally
   - Give it a meaningful name for easy identification

### Advanced Features

#### Image Color Extraction
1. Click "From Image" button
2. Upload an image file
3. The app will extract dominant colors automatically
4. Use these colors as a starting point for your palette

#### Mood-Based Generation
1. Go to the "Generators" tab
2. Use the Mood Generator
3. Enter mood keywords or take the mood quiz
4. Generate palettes that match your desired emotional response

#### Gradient Creation
1. Switch to the "Gradients" tab
2. Select colors from your palette
3. Choose gradient type (linear, radial)
4. Copy the generated CSS code

#### Sharing Palettes
1. Click the share button on your palette
2. Generate a shareable link
3. Create a QR code for easy mobile access
4. Export in various formats (PNG, JSON, SCSS)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=ColorCraft Studio
```

### Tailwind Configuration
The project uses Tailwind CSS v4 with custom configuration in `tailwind.config.ts`.

### Vite Configuration
Custom Vite configuration in `vite.config.ts` with:
- React plugin
- Path aliases for clean imports
- Build optimization settings

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful component and variable names
- Add proper JSDoc comments for complex functions
- Ensure accessibility standards are met
- Test across different browsers and devices

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **Lucide** for beautiful icons
- **Framer Motion** for smooth animations
- **Tailwind CSS** for the utility-first styling approach
- **Vite** for the fast development experience

## 📞 Support

If you have any questions or need help:

- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Submit a feature request
- 📧 **Contact**: Reach out through GitHub discussions

---

**Made with ❤️ by [Saumya-Us](https://github.com/Saumya-Us)**

*ColorCraft Studio - Where creativity meets technology*
