# Personal Finance Assistant - Frontend

A React-based frontend application for managing personal finances with a clean, modern interface using a white and black color scheme.

## Features

- **Landing Page**: Attractive homepage with feature highlights
- **Authentication**: User registration and login with JWT tokens
- **Dashboard**: Overview of financial summary with recent transactions
- **Transaction Management**: Add, edit, delete, and filter transactions with pagination
- **Analytics**: Visual charts showing expenses by category and monthly trends
- **Receipt Processing**: Upload receipt images/PDFs for automatic data extraction
- **Responsive Design**: Mobile-friendly interface that works on all devices

## Tech Stack

- React 18
- React Router DOM for navigation
- Axios for API calls
- Chart.js with react-chartjs-2 for data visualization
- CSS3 with custom variables for theming
- Local storage for token persistence

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Personal Finance Assistant Backend running on http://localhost:3000

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3001` (or the next available port).

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.js       # Main layout with navigation
│   ├── ProtectedRoute.js # Route protection component
│   └── TransactionModal.js # Add/edit transaction modal
├── context/            # React context providers
│   └── AuthContext.js  # Authentication state management
├── pages/              # Page components
│   ├── Landing.js      # Landing/homepage
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Dashboard.js    # Main dashboard
│   ├── Transactions.js # Transaction management
│   ├── Analytics.js    # Charts and analytics
│   └── Receipts.js     # Receipt upload and processing
├── services/           # API service functions
│   └── api.js          # Axios configuration and API calls
├── App.js              # Main app component with routing
└── index.css           # Global styles and CSS variables
```

## Design Philosophy

- **Clean & Simple**: Minimal design with focus on functionality
- **White & Black Theme**: High contrast design for better readability
- **No Animations**: Static interface for faster performance
- **Mobile First**: Responsive design that works on all screen sizes
- **User Experience**: Intuitive navigation and clear visual hierarchy

## API Integration

The frontend communicates with the backend through RESTful APIs:

- **Authentication**: Login, register, profile management
- **Transactions**: CRUD operations with filtering and pagination
- **Analytics**: Summary statistics and chart data
- **Receipts**: File upload and OCR processing

## Environment Variables

- `REACT_APP_API_URL`: Backend API base URL (default: http://localhost:3000)

## Contributing

1. Follow the existing code style and structure
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Test on multiple screen sizes
5. Ensure accessibility standards are met

## Build and Deployment

To build for production:

```bash
npm run build
```

This creates a `build` folder with optimized production files that can be deployed to any static hosting service.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Personal Finance Assistant application.
