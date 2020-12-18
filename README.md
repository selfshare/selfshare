# selfshare
Share your images on your own server. Sort them by galleries and tags.

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

## First Production Build (With Gulp)
- Clone the project
- Make sure NodeJs and Gulp are installed https://gulpjs.com/docs/en/getting-started/quick-start/
- Navigate to the root directory which contains the ``Dockerfile`` and ``gulpfile.js``
- Run ``gulp db-build`` to build the database image
- Run ``gulp db-run`` to start the database container
- Run ``gulp build`` to build the main image
- Run ``gulp run --port <PORT>`` to start the main image on the preferred port (default: 80)
- Navigate to ``http://localhost:<PORT>``

## Update Production Build and keep Database
- Run ``gulp exit`` to stop and remove the main container
- Run ``gulp build`` to build the main image
- Run ``gulp run --port <PORT>`` to start the main image on the preferred port (default: 80)
- Navigate to ``http://localhost:<PORT>``

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
- list view
- comments, likes, (users?)
- secured password https://www.npmjs.com/package/password-hash ✓
- custom order images ✓
- statistics dashboard
- multiple pages
- multiple languages


TODOs:
- db column size too small for big images? (TEXT) - seems ok ✓
- gallery navigation (back button)
- Dashboard content: Keep galleries open when updating ✓
- loading animation when opening images in full size
- think about where to put the title and description (and tags) on full size 
- restrict title with special characters
- https://getbootstrap.com/docs/5.0/components/carousel/ for full size
- Remove duplicated upload code and make one (compress) image service
- In dashboard-content replace currentGallery with something better
- Secure post and put requests

- Implement disclaimer editing:
  Idea: One blank page in dashboard which supports html code. This is already used in the about page description. Basicly most of it can be copy and pasted. Dont forget change activated Save and Decline buttons.
