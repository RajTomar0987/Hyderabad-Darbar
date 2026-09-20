const express = require('express');
const cors = require('cors');
const config = require('./config');

// Middleware imports
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const myRoutes = require('./routes/my.routes');
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');
const reservationRoutes = require('./routes/reservation.routes');
const reviewRoutes = require('./routes/review.routes');
const contactRoutes = require('./routes/contact.routes');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for Vite frontend
const allowedOrigins = [
  'https://hyderabad-darbar.vercel.app',
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      const isAllowed = 
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin === 'https://hyderabad-darbar.vercel.app';

      if (isAllowed) {
        return callback(null, origin);
      }
      
      return callback(null, origin);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hyderabad Darbar Restro backend running smoothly',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/my', myRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);

// Fallback Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hyderabad Darbar Restro API is operational. Visit /api/health for status.',
    version: '1.0.0'
  });
});

// 404 Not Found Middleware
app.use(notFound);

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server
const PORT = config.port;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(` Hyderabad Darbar Backend Server running`);
    console.log(` Environment: ${config.nodeEnv}`);
    console.log(` Port: ${PORT}`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(`========================================`);
  });
}

module.exports = app;
