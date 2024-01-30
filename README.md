# Online Banking System

This project is a simple online banking system built using JavaScript, HTML, CSS, Node.js, Express, Sequelize, and MySQL.
###NB: This is not a complete project it's just a trial bootstrap

## Project Structure

The project structure is organized as follows:

```
project-root
|-- public
|   |-- js
|       |-- script.js
|-- models
|   |-- Account.js
|-- node_modules (generated by npm)
|-- index.html
|-- styles.css
|-- server.js
|-- package.json
|-- README.md
```

## Prerequisites

- Node.js and npm installed on your machine.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Musyoka2020-eng/online-banking.git
   cd online-banking
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Setup MySQL Database:**
   - Install MySQL on your machine.
   - Create a database named `online_banking`.

4. **Configure Database Connection:**
   - Open `models/Account.js` and configure the database connection details.

5. **Run the Server:**
   ```bash
   node server.js
   ```

   The server will run on http://localhost:3000.

6. **Access the Application:**
   Open your web browser and go to http://localhost:3000 to access the online banking system.

## Project Components

### Frontend (public folder)

- **HTML:** `index.html` - Main HTML file for the application.
- **CSS:** `styles.css` - Stylesheet for styling the application.
- **JavaScript:** `public/js/script.js` - Frontend logic using JavaScript.

### Backend (server.js)

- **Node.js and Express:** `server.js` - Backend server using Node.js and Express.
- **Sequelize and MySQL2:** `models/Account.js` - Sequelize model for the `Account` entity.

### API Endpoints

- **Root URL:** http://localhost:3000 - Home page.
- **API Endpoint:** http://localhost:3000/api/accounts - Fetch all accounts.

## Additional Notes

- Make sure to configure the Content Security Policy (CSP) in your HTML for security.
- Consider enhancing security practices, especially for handling sensitive information in a real-world application.
- This is a basic example, and additional features and security measures are needed for a production-ready online banking system.
