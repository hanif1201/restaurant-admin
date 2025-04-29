# GoChop Restaurant Admin Dashboard

A powerful and intuitive React-based dashboard for restaurant owners to manage their menu, orders, profile, and business operations in the GoChop food delivery system.

## Features

- **Dashboard Overview**: Real-time statistics and charts displaying key metrics
- **Menu Management**: Create, update, delete, and toggle availability of menu items
- **Order Management**: View and update the status of customer orders
- **Profile Management**: Update restaurant information, business hours, and account settings
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18, React Router 6, TailwindCSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Charts**: Chart.js with React-ChartJS-2
- **UI Components**: Custom components built with TailwindCSS
- **Icons**: React Icons (Font Awesome)
- **Notifications**: React Toastify

## Prerequisites

- Node.js 16+
- npm or yarn
- GoChop Backend API running (see backend docs)

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-repo/gochop-restaurant-admin.git
cd gochop-restaurant-admin
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory

```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server

```bash
npm start
# or
yarn start
```

5. The application will be available at `http://localhost:3000`

## Project Structure

```
restaurant-admin/
├── public/                  # Static files
├── src/
│   ├── api/                 # API service integration
│   ├── assets/              # Assets (images, styles)
│   ├── components/          # Reusable components
│   │   ├── common/          # Common UI components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── menu/            # Menu management components
│   │   ├── orders/          # Order management components
│   │   └── profile/         # Profile management components
│   ├── contexts/            # React contexts for state management
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Page layouts
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   ├── Menu/            # Menu management pages
│   │   ├── Orders/          # Order management pages
│   │   └── Settings/        # Settings pages
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main application component
│   └── index.jsx            # Application entry point
├── .env                     # Environment variables
├── package.json             # Project dependencies
└── tailwind.config.js       # TailwindCSS configuration
```

## API Integration

This application is designed to work with the GoChop backend API. The API endpoints used include:

- Authentication: `/api/auth/*`
- User profile: `/api/users/*`
- Restaurant profile: `/api/restaurants/*`
- Menu management: `/api/menu/*`
- Order management: `/api/orders/*`

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Deployment

Deploy the contents of the `build/` directory to your web server or hosting service of choice.

For environment-specific configuration, update the `.env` file accordingly.

## License

This project is licensed under the MIT License.
