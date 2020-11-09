# selfshare

## MySQL installation steps:
- run docker container
- add user and database called selfshare (with all rights)
- do this inside MYSQL console: ``ALTER USER 'selfshare' IDENTIFIED WITH mysql_native_password BY 'xs6HZKdc5YEi6';`` and ``flush privileges;`` to allow password authentication.

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


check this, you idiot:
- db colomn size too small for big images? (TEXT)
