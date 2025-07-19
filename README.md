# Vincent Chan's Portfolio Website

![Portfolio Website](https://i.imgur.com/your_image_here.jpg)

## 🚀 Overview

A modern, responsive portfolio website built with Next.js 14, showcasing my skills, projects, and professional experience. This website serves as both a personal portfolio and a demonstration of my full-stack development capabilities.

## ✨ Features

- **Modern UI/UX**: Clean, responsive design with smooth animations and transitions
- **Skills Showcase**: Interactive skills grid with detailed modal views
- **Project Portfolio**: Showcase of academic and professional projects
- **About Me Section**: Comprehensive background information including education and experience
- **Contact System**: Interactive contact form with message board functionality
- **MongoDB Integration**: Backend database for storing and retrieving messages
- **PDF Viewer**: Capability to view certificates and documents
- **Responsive Design**: Fully responsive across all device sizes

## 🛠️ Technologies Used

### Frontend
- **Next.js 14**: React framework with App Router for server components and routing
- **React**: Component-based UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Component library for consistent design

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling

### Tools & Deployment
- **Git & GitHub**: Version control and code hosting
- **ESLint**: Code linting
- **TypeScript**: Static type checking

## 🏗️ Project Structure

```
├── public/             # Static assets (images, etc.)
├── src/                # Source code
│   ├── app/            # Next.js App Router pages
│   │   ├── about/      # About page
│   │   ├── api/        # API routes
│   │   ├── components/ # Page-specific components
│   │   ├── contact/    # Contact page
│   │   ├── skills/     # Skills page
│   │   └── ...         # Other pages
│   ├── components/     # Shared React components
│   ├── lib/            # Utility functions and libraries
│   └── scripts/        # Database scripts and utilities
└── ...                 # Configuration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/portfolio-website.git
   cd portfolio-website
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📝 Features in Detail

### Skills Showcase
- Interactive grid displaying skills categorized by domain
- Detailed modal views with skill descriptions and experience
- Filtering capability by skill category

### Message Board
- Public message board for visitors to leave comments
- MongoDB integration for message storage
- Rate limiting and spam protection
- Automatic message expiration after 3 days

### Responsive Design
- Fully responsive layout adapting to all screen sizes
- Dynamic component rendering based on viewport width
- Optimized animations and transitions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Feel free to reach out if you have any questions or would like to collaborate:

- Email: chanchuntat1@gmail.com
- LinkedIn: [linkedin.com/in/vincentcct/](https://www.linkedin.com/in/vincentcct/)
- GitHub: [github.com/Vincent0009](https://github.com/Vincent0009)

---

Built with ❤️ by Vincent Chan

