# selfshare
Share your images on your own server. Sort them by galleries and tags.

## Development Environment
- Clone the project
- If not already installed, download Node.js at https://nodejs.org/en/download

### 1. MySQL Database
- add user and database called selfshare (with all rights)
- do this inside MYSQL console: ``ALTER USER 'selfshare' IDENTIFIED WITH mysql_native_password BY 'xs6HZKdc5YEi6';`` and ``flush privileges;`` to allow password authentication.

### 2. Backend
- Navigate to ``src/backend``
- Run ``npm install`` to download all dependencies
- Run ``npm run dev`` in terminal or add it to your IDE's run config

### 3. Frontend
- Navigate to ``src/frontend``
- Run ``npm install`` to download all dependencies
- Run ``npm start`` in terminal or add it to your IDE's run config

## Production Build (With Docker)
- Clone the project
- Navigate to the root directory which contains the ``Dockerfile``
- Run ``sudo docker build -t selfshare .`` to build the docker image
- Run ``docker run --name selfshare -p <PORT>:3000 -d selfshare`` (replace <PORT> with preferred port) to start the docker container 
- Navigate to ``http://localhost:<PORT>``

## Features
- There is a main view for guests, and an admin view for the admin.
- Admin can:
    - Upload images into galleries
    - create, remove, edit, organize galleries
    - change look of the site (color, background)
    - enable/disable watermark/lower quality/copyright stuff
    - allow / disable download button
    - edit his author page
    
(optional ideas)
- list view
- comments, likes, (users?)
- secured password https://www.npmjs.com/package/password-hash
- custom order images
- statistics dashboard
- multiple pages
- multiple languages


check this, you idiot:
- db column size too small for big images? (TEXT)
    - seems ok, with longtext
- on dashboard content page, it loads the galleries more than once 
