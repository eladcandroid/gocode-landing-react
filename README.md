# GoCode Landing Page

A modern React landing page with lead management system built with Vite, TypeScript, Tailwind CSS, and Appwrite.

## Features

- **Modern Landing Page**: Beautiful, responsive design with AI-focused branding
- **Lead Management**: Complete CRUD operations for managing website leads
- **Real-time Data**: Powered by Appwrite backend
- **Type Safety**: Built with TypeScript for better development experience
- **Responsive Design**: Works perfectly on all devices
- **Smooth Animations**: Using Framer Motion for engaging user experience

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom CSS Variables
- **UI Components**: Custom component library with shadcn/ui patterns
- **Backend**: Appwrite (Database, Authentication)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Appwrite account and project

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/landing.git
cd landing/gocode-landing
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Update `.env` with your Appwrite configuration:

```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_LEADS_COLLECTION_ID=your_leads_collection_id_here
```

### 4. Setup Appwrite Database

1. Create a new database in your Appwrite project
2. Create a collection called "leads" with the following attributes:
   - `email` (string, required)
   - `message` (string, required)
   - `status` (enum: "new", "contacted", "qualified", "converted", "closed", default: "new")
   - `source` (string, default: "website")
   - `contact_date` (datetime, required)

3. Set appropriate permissions for your collection

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── Landing.tsx      # Main landing page component
│   └── Leads.tsx        # Lead management component
├── lib/
│   ├── appwrite.ts      # Appwrite configuration
│   └── utils.ts         # Utility functions
├── services/
│   └── leadService.ts   # Lead CRUD operations
├── types/
│   └── Lead.ts          # TypeScript type definitions
└── ...
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Features Overview

### Landing Page
- Hero section with call-to-action
- Features showcase with AI-powered development highlights
- Project portfolio section
- Contact form with lead capture
- Responsive navigation
- Smooth scrolling and animations

### Lead Management
- View all leads in a sortable table
- Filter leads by status
- Update lead status
- View detailed lead information
- Delete leads with confirmation
- Real-time updates

## Database Schema

The Leads collection uses the following schema:

```json
{
  "email": {
    "type": "string",
    "format": "email",
    "required": true
  },
  "message": {
    "type": "string",
    "required": true
  },
  "status": {
    "type": "string",
    "enum": ["new", "contacted", "qualified", "converted", "closed"],
    "default": "new"
  },
  "source": {
    "type": "string",
    "default": "website"
  },
  "contact_date": {
    "type": "datetime",
    "required": true
  }
}
```

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

### Recommended Hosting

- **Vercel**: Easy deployment with GitHub integration
- **Netlify**: Simple drag-and-drop deployment
- **Cloudflare Pages**: Fast global CDN

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email contact@gocode.co.il or create an issue in this repository.
