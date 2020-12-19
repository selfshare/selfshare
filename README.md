# selfshare
Share your images on your own server.

![Home screenshot](screenshots/home.png)

## Features
- There is a main view for guests, and an admin view for the admin.
- Admin can:
  - Upload images into galleries ✓
  - create, remove, edit, organize galleries ✓
  - change look of the site (color, background)
  - enable/disable watermark/lower quality/copyright stuff
  - allow / disable download button
  - edit author page ✓

(optional ideas)
- secured password https://www.npmjs.com/package/password-hash ✓
- custom order images ✓

## Development Environment
- Clone the project
- If not already installed, download Node.js at https://nodejs.org/en/download

### 1. MySQL Database (Manual)
- If needed refer to [How to install MySQL Server in Docker Container](DOCKER_MYSQL.md)
- add user and database called selfshare (with all rights)
- do this inside MYSQL console: ``ALTER USER 'selfshare' IDENTIFIED WITH mysql_native_password BY 'xs6HZKdc5YEi6';`` and ``flush privileges;`` to allow password authentication.

### 1.5. MySQL Database (Production build)
- Make sure NodeJs and Gulp are installed https://gulpjs.com/docs/en/getting-started/quick-start/
- Navigate to the root directory which contains the ``Dockerfile`` and ``gulpfile.js``
- Run ``gulp db-build`` to build the database image
- Run ``gulp db-run`` to start the database container on port 3366

### 2. Backend
- Navigate to ``src/backend``
- Run ``npm install`` to download all dependencies
- Run ``npm run dev`` in terminal or add it to your IDE's run config

### 3. Frontend
- Navigate to ``src/frontend``
- Run ``npm install`` to download all dependencies
- Run ``npm start`` in terminal or add it to your IDE's run config

### 4. Setup
- See 'Setup Page'

## First Production Build (With Gulp)
- Clone the project
- Make sure NodeJs and Gulp are installed https://gulpjs.com/docs/en/getting-started/quick-start/
- Navigate to the root directory which contains the ``Dockerfile`` and ``gulpfile.js``
- Run ``gulp db-build`` to build the database image
- Run ``gulp db-run`` to start the database container
- Run ``gulp build`` to build the main image
- Run ``gulp run --port <PORT>`` to start the main image on the preferred port (default: 80)
- Navigate to ``http://localhost:<PORT>/setup``

## Update Production Build and keep Database
- Run ``gulp exit`` to stop and remove the main container
- Run ``gulp build`` to build the main image
- Run ``gulp run --port <PORT>`` to start the main image on the preferred port (default: 80)
- Navigate to ``http://localhost:<PORT>``

## Setup Page
- Navigate to ``http://localhost:<PORT>/setup``
- After setup, you can change settings, create galleries, upload images and more on ``http://localhost:<PORT>/dashboard``


TODOs:
- gallery navigation (back button)
- loading animation when opening images in full size
- think about where to put the title and description (and tags) on full size 
- restrict title with special characters
- https://getbootstrap.com/docs/5.0/components/carousel/ for full size
- In dashboard-content replace currentGallery with something better
- Secure post and put requests