# Graphical Password Authentication

This project is a graphical password authentication system built with Node.js, Express, MongoDB, and frontend JavaScript. It allows users to register and authenticate using selected points on images as their password.

## Features

- User registration with graphical password selection on images
- User login with graphical password verification
- Backend API built with Express and MongoDB for data storage
- Frontend built with HTML, CSS, and JavaScript
- Parcel bundler for frontend asset management
- CORS configured for secure cross-origin requests

## Project Structure

- `server.js`: Main backend server file with API endpoints and MongoDB connection
- `public/`: Frontend static files including HTML, CSS, and JavaScript
- `package.json`: Project metadata and scripts
- `README.md`: Project documentation

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build frontend assets for production:

```bash
npm run build
```

## Configuration

- The backend URL is configured in the frontend JavaScript files (`public/image_selection.js`, `public/image_selection_new.js`, `public/img_verification.js`) as:

```js
const backendUrl = 'https://graphical-password-authentication-vnxk.onrender.com';
```

- The backend server (`server.js`) is configured to allow CORS requests from this URL.

## Usage

- Access the application via the frontend served by the Express server.
- Register a new user by selecting points on images as your graphical password.
- Login using your username and graphical password.

## Dependencies

- express
- mongoose
- body-parser
- cors
- nodemon (dev dependency)
- parcel (dev dependency)

## License

This project is licensed under the ISC License.
