# Sales Dashboard Frontend

A modern React-based dashboard for visualizing sales representatives data with filtering, sorting, and AI-powered insights.

## Features

- **Interactive Sales Table**: View, sort, and filter sales representatives data
- **Detailed Sales Rep View**: Click on any row to see detailed information about a sales representative
- **Server-side Pagination**: Efficiently handle large datasets with server-side pagination
- **Advanced Filtering**: Filter data by ID, name, role, and region
- **AI-powered Insights**: Ask questions about your sales data and get intelligent responses
- **Responsive Design**: Works well on desktop and mobile devices

## Tech Stack

- **Next.js**: React framework for production
- **React**: UI library
- **Styled Components**: CSS-in-JS styling solution
- **Axios**: HTTP client for API requests
- **React Table**: Hooks for building powerful tables

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Development

Run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
frontend/
├── components/           # React components
│   ├── SalesTable.js     # Main table component with filtering and pagination
│   └── SalesRepDetail.js # Detailed view component for a selected sales rep
├── pages/                # Next.js pages
│   └── index.js          # Main page with table and AI section
├── public/               # Static assets
├── styles/               # Global styles
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Component Overview

### SalesTable

The main table component that displays sales representatives data with the following features:
- Server-side pagination
- Server-side sorting
- Filtering by multiple fields
- Row selection to view detailed information

### SalesRepDetail

Displays detailed information about a selected sales representative, including:
- Personal information
- Skills
- Deals
- Clients

## API Integration

The frontend communicates with the backend API for the following operations:
- Fetching paginated sales representatives data
- Sorting and filtering data
- Sending questions to the AI endpoint and receiving responses