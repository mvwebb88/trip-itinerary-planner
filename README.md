✈️ Trip Itinerary Planner

A full-stack MEN (MongoDB, Express, Node.js) application that allows users to plan trips and organize itineraries securely. Users can sign up, log in, create trips, edit or delete them, and manage trip details — all with session-based authentication.

📸 Screenshot / Logo

🧭 Description

Trip Itinerary Planner is a web application designed to help users plan and manage their travel experiences. After creating an account, users can create trips, add destinations and dates, edit trip details, and remove trips they no longer need. Each user only has access to their own data, ensuring privacy and security.

This project was built as part of the General Assembly MEN Stack CRUD App Project to demonstrate full-stack development, authentication, authorization, and RESTful routing.

🚀 Getting Started
🔗 Live App

Deployed URL goes here (Heroku / Render):

https://your-app-name.herokuapp.com

📋 Planning Materials

Trello Board (User Stories, Wireframes, ERD):

https://trello.com/b/your-board-link

🔐 Features

User authentication (Sign Up / Sign In / Sign Out)

Session-based authorization

Create, view, edit, and delete trips (CRUD)

Each trip is tied to the logged-in user

Protected routes (only authenticated users can manage trips)

Clean navigation bar with conditional links

MongoDB-backed session storage

🛠️ Technologies Used

Node.js

Express.js

MongoDB

Mongoose

EJS

express-session

connect-mongo

bcrypt

method-override

dotenv

Morgan

📁 Project Structure
travel-planner/
├── controllers/
│   ├── auth.js
│   └── trips.js
├── middleware/
│   └── isSignedIn.js
├── models/
│   ├── User.js
│   └── Trip.js
├── routes/
│   ├── auth.js
│   └── trips.js
├── views/
│   ├── auth/
│   ├── trips/
│   └── partials/
├── public/
├── server.js
└── README.md

🔒 Authorization Rules

Users must be logged in to create, edit, or delete trips

Users can only view and modify their own trips

Guest users are redirected to the sign-in page

🧪 Next Steps (Future Enhancements)

Add itinerary items within each trip

Improve UI styling with CSS Grid/Flexbox

Add flash messages for success/error feedback

Add trip date validation

Allow users to upload images for trips

Add pagination for large trip lists

📎 Attributions

Express.js Documentation

MongoDB Atlas

Mongoose Documentation

bcrypt