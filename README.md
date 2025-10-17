# Book Trading Club

A modern Full-Stack MERN web application for exchanging physical books between readers worldwide with real-time chat functionality.

## About

Book Trading Club is a platform that enables book lovers to exchange their physical books with others. Discover new stories, share your favorite books, connect with readers in your area, and communicate in real-time through our integrated chat system.

This project fulfills all requirements of the FreeCodeCamp "Manage a Book Trading Club" challenge with additional advanced features.

## FreeCodeCamp User Stories

- As an unauthenticated user, I can view all books posted by every user
- As an authenticated user, I can add a new book to my collection
- As an authenticated user, I can update my settings (full name, city, state)
- As an authenticated user, I can propose a trade and wait for the other user to accept

## Features

### Book Management
- View all books from all users with pagination (public access)
- Add books manually or via Open Library API
- Search books by ISBN with automatic data filling
- Search books by title/author with paginated results
- Manage personal collection (edit/delete)
- Automatic cover images with fallback
- Book status tracking (available/pending/traded)
- Pagination support (12 books per page for browsing, 10 results per page for search)

### User Management
- Registration and login with JWT authentication
- Profile management (name, city, state)
- View all registered users and their collections
- Password hashing with bcrypt
- Protected routes on frontend and backend
- Real-time online status indicators

### Trade System
- Send trade requests for books
- Manage incoming and outgoing requests
- Accept or reject trade offers
- Automatic ownership transfer on approval
- Trade history view
- Cancel pending requests

### Real-Time Chat System 
- Real-time 1:1 messaging between users
- WebSocket-based communication (Socket.io)
- Chat directly from user profiles or book cards
- Persistent message history stored in database
- Online status indicators
- Read receipts
- JWT-secured WebSocket connections
- Instant message delivery without page reload

### Pagination System 
- Efficient data loading with server-side pagination
- Smart pagination controls with ellipsis for many pages
- Consistent pagination across all data views
- Automatic scroll to top on page change
- Configurable page sizes
- Total result counts and page information
- Limited Open Library results (max 100) for better UX

### UI/UX
- Responsive design (desktop, tablet, mobile)
- Modern CSS design system with CSS variables
- Loading states for all async operations
- Comprehensive error handling
- Form validation
- Accessibility features (ARIA labels)
- Smooth animations and transitions

## Tech Stack

### Frontend
- React 18.x
- Vite
- React Router v6
- Axios
- Socket.io-client (Real-time communication)
- Context API (State management)
- CSS Variables

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.io (WebSocket server)
- JWT (jsonwebtoken)
- bcryptjs

### External APIs
- Open Library API

## Installation

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account
- Git

### Setup

Clone the repository:

```bash
git clone https://github.com/your-username/book-trading-club.git
cd book-trading-club
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_at_least_32_characters
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Generate JWT_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Start Application

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Application runs at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- WebSocket: ws://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Books
- `GET /api/books` - Get all books (supports pagination: ?page=1&limit=12)
- `GET /api/books/user/my-books` - Get user's books (supports pagination)
- `POST /api/books` - Add new book
- `PUT /api/books/:bookId` - Update book
- `DELETE /api/books/:bookId` - Delete book

### Trades
- `GET /api/trades` - Get all trades
- `GET /api/trades/incoming` - Get incoming trade requests
- `GET /api/trades/outgoing` - Get outgoing trade requests
- `POST /api/trades` - Create trade request
- `PUT /api/trades/:id/approve` - Approve trade
- `PUT /api/trades/:id/reject` - Reject trade
- `DELETE /api/trades/:id` - Cancel trade request

### Messages 
- `GET /api/messages/conversations` - Get all user conversations
- `GET /api/messages/:userId` - Get messages with specific user
- `POST /api/messages` - Send new message
- `PUT /api/messages/:messageId/read` - Mark message as read

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get specific user

### WebSocket Events 
- `connection` - User connects to WebSocket
- `disconnect` - User disconnects
- `sendMessage` - Send message to another user
- `receiveMessage` - Receive message from another user
- `messageRead` - Message read notification
- `userOnline` - User online status update
- `userOffline` - User offline status update

## Project Structure

```
book-trading-club/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── messageController.js          
│   │   ├── tradeController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Book.js
│   │   ├── Message.js                     
│   │   ├── Trade.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── books.js
│   │   ├── messages.js                    
│   │   ├── trades.js
│   │   └── users.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                          
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   └── ProtectedRoute.jsx
    │   │   ├── books/
    │   │   │   ├── BookCard.jsx           
    │   │   │   ├── BookCard.css
    │   │   │   ├── BookSearch.jsx         
    │   │   │   ├── BookSearch.css
    │   │   │   ├── Pagination.jsx         
    │   │   │   └── Pagination.css         
    │   │   ├── chat/                      
    │   │   │   ├── ChatWindow.jsx         
    │   │   │   ├── ChatWindow.css         
    │   │   │   ├── MessageInput.jsx       
    │   │   │   └── MessageList.jsx        
    │   │   └── layout/
    │   │       ├── Footer.jsx
    │   │       ├── Footer.css
    │   │       ├── Navbar.jsx             
    │   │       └── Navbar.css
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── SocketContext.jsx          
    │   ├── pages/
    │   │   ├── AddBookPage.jsx
    │   │   ├── AddBookPage.css
    │   │   ├── AuthPages.css
    │   │   ├── BooksPage.jsx              
    │   │   ├── BooksPage.css
    │   │   ├── ChatPage.jsx               
    │   │   ├── ChatPage.css               
    │   │   ├── EditBookPage.jsx
    │   │   ├── EditBookPage.css
    │   │   ├── HomePage.jsx
    │   │   ├── HomePage.css
    │   │   ├── LoginPage.jsx
    │   │   ├── MyBooksPage.jsx            
    │   │   ├── MyBooksPage.css
    │   │   ├── ProfilePage.jsx
    │   │   ├── ProfilePage.css
    │   │   ├── RegisterPage.jsx
    │   │   ├── RegisterPage.css
    │   │   ├── RequestsPage.jsx
    │   │   ├── RequestsPage.css
    │   │   ├── TradesPage.jsx
    │   │   ├── TradesPage.css
    │   │   ├── UsersPage.jsx              
    │   │   └── UsersPage.css              
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── bookService.js             
    │   │   ├── messageService.js          
    │   │   ├── openLibraryService.js      
    │   │   ├── tradeService.js
    │   │   └── userService.js
    │   ├── styles/
    │   │   ├── index.css
    │   │   └── variables.css
    │   ├── App.jsx                        
    │   └── main.jsx                       
    ├── .env
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── README.md
```

## Architecture

### Backend (MVC Pattern)

**Models** - Data structure and business logic
- User, Book, Trade, Message schemas

**Controllers** - Handle requests and responses
- Authentication, Books, Trades, Messages, Users

**Routes** - Define API endpoints
- REST API routes for all resources

**Middleware** - Process requests before controllers
- JWT authentication, error handling

**WebSocket Layer** - Real-time communication
- Socket.io server for instant messaging
- User connection management
- Message delivery and read receipts

### Frontend

**Pages** - Top-level route components
- Public routes (Home, Books, Login, Register)
- Protected routes (My Books, Profile, Trades, Requests, Chat)

**Components** - Reusable UI elements
- Book components (Cards, Search, Pagination)
- Chat components (Window, MessageList, Input)
- Layout components (Navbar, Footer)

**Services** - API communication layer
- REST API calls (axios)
- WebSocket client (Socket.io)

**Context** - Global state management
- AuthContext (user authentication)
- SocketContext (WebSocket connection)

**Styles** - Centralized design system
- CSS Variables
- Component-specific styles

## Database Models

### User
- username, email, password (hashed)
- fullName, city, state
- addedBooks array (references to Books)

### Book
- title, author, description
- coverImage, owner (reference to User)
- status (available/pending/traded)
- Open Library fields (bookId, link)

### Trade
- from (requester), to (owner)
- book (reference)
- status (pending/approved/rejected)
- message

### Message 
- sender (reference to User)
- recipient (reference to User)
- content (text message)
- isRead (boolean)
- timestamp

## Key Features Explained

### Real-Time Chat System

The chat system uses WebSocket technology (Socket.io) for instant, bidirectional communication:

1. **Connection Management**: Users automatically connect when logged in
2. **Message Delivery**: Messages are delivered instantly without page reload
3. **Persistence**: All messages are stored in MongoDB
4. **Online Status**: Real-time indicators show who's currently online
5. **Read Receipts**: Track when messages have been read
6. **Security**: All WebSocket connections are authenticated via JWT

### Pagination System

Efficient data handling for large collections:

1. **Server-Side Pagination**: Reduces database load by fetching only needed data
2. **Smart Controls**: Shows page numbers with ellipsis (...) for better UX
3. **Configurable**: Different page sizes for different views (books: 12, search: 10)
4. **Open Library Limit**: Transparently limits external API results to 100 for better navigation
5. **Auto-Scroll**: Automatically scrolls to top when changing pages

## Deployment

### MongoDB Atlas
1. Create free cluster at mongodb.com/atlas
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for production)
4. Get connection string

### Backend (Render.com)
1. Connect GitHub repository
2. Set environment: Node
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables
6. Enable WebSocket support
7. Deploy

**Important**: Ensure your hosting service supports WebSocket connections for Socket.io to work properly.

### Frontend (Vercel)
1. Import GitHub repository
2. Framework: Vite
3. Root directory: frontend
4. Build command: `npm run build`
5. Output directory: dist
6. Add VITE_API_URL environment variable
7. Deploy

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookTradingClub
JWT_SECRET=your_random_64_character_hex_string
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Production
Update `CLIENT_URL` and `VITE_API_URL` to production URLs.

**Important for Chat**: Ensure `CLIENT_URL` in backend matches your frontend URL exactly for CORS to work with Socket.io.

## Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.x.x",
  "jsonwebtoken": "^9.x.x",
  "bcryptjs": "^2.4.3",
  "dotenv": "^16.x.x",
  "cors": "^2.8.5",
  "socket.io": "^4.x.x"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x.x",
  "axios": "^1.x.x",
  "socket.io-client": "^4.x.x"
}
```


## Security

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected routes (frontend and backend)
- CORS configuration
- WebSocket authentication via JWT
- Input validation and sanitization
- Environment variables for sensitive data
- Secure HTTP headers
- Rate limiting (recommended for production)

## Performance Optimizations

- Server-side pagination for large datasets
- Lazy loading of images
- Efficient MongoDB queries with indexes
- WebSocket connection pooling
- Debounced search inputs
- Memoized React components where beneficial

## Known Limitations

- Open Library search results limited to 100 items (by design for better UX)
- WebSocket connections require persistent server (not suitable for serverless)
- Real-time features require stable internet connection



## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Author

Maximilian Adam

- GitHub: https://github.com/Max-A92

## Acknowledgments

- FreeCodeCamp for the project requirements
- Open Library for the book metadata API
- MongoDB for the cloud database solution
- Socket.io for real-time communication framework

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For questions or issues, please open an issue in the GitHub repository.

---
