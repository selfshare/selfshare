import mysql from 'mysql';
import {IImage} from './entity/IImage';
import {IGallery} from './entity/IGallery';

let connection: any;
const GET_ALL_IMAGES = 'SELECT * from Images';
const GET_ALL_GALLERIES = 'SELECT * from Galleries';
const GET_ALL_SETTINGS = 'SELECT * from Settings';


const GET_ALL_IMAGES_LARGE = 'SELECT image_id, title, description, tag, upload_timestamp, base64_large AS base64 FROM Images'
const GET_ALL_IMAGES_MEDIUM = 'SELECT image_id, title, description, tag, upload_timestamp, base64_medium AS base64 FROM Images'
const GET_ALL_IMAGES_SMALL = 'SELECT image_id, title, description, tag, upload_timestamp, base64_small AS base64 FROM Images '

const GET_ALL_GALLERIES_INFO = 'SELECT gallery_id, title, description FROM Galleries';
const GET_ALL_GALLERIES_MEDIUM = 'SELECT gallery_id, title, description, base64_medium as base64, order_nr FROM Galleries ORDER BY order_nr';
const GET_ALL_GALLERIES_SMALL = 'SELECT gallery_id, title, description, base64_small as base64, order_nr FROM Galleries ORDER BY order_nr';

const CREATE_IMAGES_TABLE = 'CREATE TABLE Images (image_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, gallery_id INT UNSIGNED, CONSTRAINT fk_gallery FOREIGN KEY (gallery_id) REFERENCES Galleries(gallery_id), title VARCHAR(64), description VARCHAR(512), tag VARCHAR(32), upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, base64_large LONGTEXT not null, base64_medium LONGTEXT not null, base64_small LONGTEXT not null)';
const CREATE_GALLERIES_TABLE = 'CREATE TABLE Galleries (gallery_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(64) UNIQUE, description VARCHAR(512), base64_medium LONGTEXT, base64_small LONGTEXT, order_nr INT DEFAULT 0)';
const CREATE_SETTINGS_TABLE = 'CREATE TABLE Settings (settings_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, username VARCHAR(32) NOT NULL, password_hash BINARY(64) NOT NULL, author_name VARCHAR(64), author_description VARCHAR(2058), author_pic_base64 LONGTEXT, site_background_base64 LONGTEXT, site_color VARCHAR(32), allow_download BIT, water_mark_base64 LONGTEXT, login_hash BINARY(64))';

const DELETE_IMAGE_ROW = 'DELETE from Images';
const DELETE_GALLERY_ROW = 'DELETE from Galleries';

const GET_MAX_ORDER_NR = 'SELECT MAX(order_nr) as "maxValue" FROM Galleries';


export function connectDB() {
    connection = mysql.createConnection({
        host: process.env.db_host || "docker",
        user: 'selfshare',
        password: 'xs6HZKdc5YEi6', // it's recommended to change the password for production builds (here and inside the db)
        database: 'selfshare'
    });
    connection.connect((err: any) => {
        if (err) throw err;
        console.log("Successfully connected to database!");
        checkIfAllTablesExist();
    });
}

export function checkIfAllTablesExist() {
    doesGalleryTableExist((exists: boolean) => {
        if (!exists) {
            console.log('Table "Gallery" does not exist, creating new one...');
            createGalleryTable();
        }
    });
    doesImageTableExist((exists: boolean) => {
        if (!exists) {
            console.log('Table "Images" does not exist, creating new one...');
            createImageTable();
        }
    });
    doesSettingsTableExist((exists: boolean) => {
        if (!exists) {
            console.log('Table "Settings" does not exist, creating new one...');
            createSettingsTable();
        }
    });
}


// private

function doesImageTableExist(callback: { (exists: any): void; (arg0: boolean): any; }) {
    connection.query(GET_ALL_IMAGES, (error: any) => {
        return callback(!error);
    });

}

function doesGalleryTableExist(callback: { (exists: any): void; (arg0: boolean): any; }) {
    connection.query(GET_ALL_GALLERIES, (error: any) => {
        return callback(!error);
    });
}

function doesSettingsTableExist(callback: (exists: any) => void) {
    connection.query(GET_ALL_SETTINGS, (error: any) => {
        return callback(!error);
    });
}

function createImageTable() {
    connection.query(CREATE_IMAGES_TABLE);
}


function createGalleryTable() {
    connection.query(CREATE_GALLERIES_TABLE);
}

function createSettingsTable() {
    connection.query(CREATE_SETTINGS_TABLE);
}

function getMaxOrderNr(callback: (max: number) => any) {
    connection.query(GET_MAX_ORDER_NR, (err: any, res: any) => {
        if (res[0].maxValue == null) {
            return callback(-1);
        }
        return callback(res[0].maxValue);
    });
}

function getGalleryByOrderNr(orderNr: number, callback: (gallery: IGallery) => any) {
    connection.query(GET_ALL_GALLERIES + ` WHERE order_nr=${orderNr}`, (err: any, res: any) => {
        if (res.length > 0) {
            return callback(res[0] as IGallery);
        }
        return callback(null);
    });
}

function getGalleryById(id: number, callback: (gallery: IGallery) => any) {
    connection.query(GET_ALL_GALLERIES + ` WHERE gallery_id=${id}`, (err: any, res: any) => {
        if (res.length > 0) {
            return callback(res[0] as IGallery);
        }
        return callback(null);
    });
}

export function getFullImageById(id: number, callback: (arg0: any) => any) {
    connection.query(GET_ALL_IMAGES + ` WHERE image_id=${id}`, (err: any, res: any) => {
        return callback(res[0]);
    });
}


// Gallery

export function addGallery(gallery: IGallery, callback: (arg0: any) => any) {
    getMaxOrderNr(max => {
        max++;

        connection.query(`INSERT INTO Galleries (title, description, order_nr) VALUES ("${gallery.title}", "${gallery.description}", ${max})`, (err: any, res: any) => {
            if (err !== null) {
                console.log(err.message);
                return callback(null);
            }
            return callback({code: 200});
        });
    });
}

export function updateGalleryById(id: string, updatedGallery: IGallery, callback: (arg0: any) => any) {
    console.log(updatedGallery);
    const newOrderNr = updatedGallery.order_nr;
    getGalleryByOrderNr(newOrderNr, swapGallery => {
        if (swapGallery.gallery_id !== updatedGallery.gallery_id) {
            getGalleryById(updatedGallery.gallery_id, galleryByTitle => {
                const oldNr = galleryByTitle.order_nr;
                connection.query(`UPDATE Galleries SET title="${swapGallery.title}", description="${swapGallery.description}", order_nr="${oldNr}" WHERE gallery_id=${swapGallery.gallery_id}`);
                connection.query(`UPDATE Galleries SET title="${galleryByTitle.title}", description="${galleryByTitle.description}", order_nr="${updatedGallery.order_nr}" WHERE gallery_id=${galleryByTitle.gallery_id}`, (err: any, res: any) => {
                    if (err !== null) {
                        console.log(err.message);
                        return callback(null);
                    }
                    return callback({code: 200});
                });
            });
        } else {
            connection.query(`UPDATE Galleries SET title="${updatedGallery.title}", description="${updatedGallery.description}", order_nr="${updatedGallery.order_nr}", WHERE gallery_id=${updatedGallery.gallery_id}`, (err: any, res: any) => {
                if (err !== null) {
                    console.log(err.message);
                    return callback(null);
                }
                return callback({code: 200});
            });
        }
    });
}

export function setGalleryThumbnailById(galleryId: string, sentImage: IImage, callback: (response: any) => any) {
    getFullImageById(sentImage.image_id, image => {
        connection.query(`UPDATE Galleries SET base64_medium="${image.base64_medium}", base64_small="${image.base64_small}" WHERE gallery_id=${galleryId}`, (err: any, res: any) => {
            if (err !== null) {
                console.log(err.message);
                return callback(null);
            }
            return callback({code: 200});
        });
    });
}

export function deleteGalleryById(id: number, callback: (arg0: any) => any) {
    connection.query(DELETE_IMAGE_ROW + ` WHERE gallery_id=${id}`, (err: any, res: any) => {
        connection.query(DELETE_GALLERY_ROW + ` WHERE gallery_id=${id}`, (err1: any, res1: any) => {
            return callback(res1);
        });
    });
}

// Images

export function addImage(image: IImage, gallery: IGallery) {
    connection.query(`INSERT INTO Images (title, description, tag, gallery_id) VALUES ("${image.title}", "${image.description}", "${image.tag}", "${gallery.gallery_id}")`, (err: any, res: any) => {
        console.log('Added image entity successfully!');
    });
}

export function getAllGalleriesMedium(callback: (arg0: any) => any) {
    connection.query(GET_ALL_GALLERIES_MEDIUM, (err: any, res: IGallery[]) => {
        return callback(res);
    });
}

export function getAllGalleriesSmall(callback: (arg0: any) => any) {
    connection.query(GET_ALL_GALLERIES_SMALL, (err: any, res: IGallery[]) => {
        return callback(res);
    });
}

export function getGalleryByTitle(title: string, callback: (gallery: IGallery) => any) {
    connection.query(GET_ALL_GALLERIES_INFO + ` WHERE title="${title}"`, (err: any, res: any) => {
        if (res.length > 0) {
            return callback(res[0] as IGallery);
        }
        return callback(null);
    });
}


export function getImageById(id: number, callback: (arg0: any) => any) {
    connection.query(GET_ALL_IMAGES_LARGE + ` WHERE image_id=${id}`, (err: any, res: any) => {
        return callback(res[0]);
    });
}

export function getMediumImagesByGalleryId(id: number, callback: (arg0: any) => any) {
    connection.query(GET_ALL_IMAGES_MEDIUM + ` WHERE gallery_id=${id}`, (err: any, res: any) => {
        return callback(res);
    });
}

export function getSmallImagesByGalleryId(id: number, callback: (arg0: any) => any) {
    connection.query(GET_ALL_IMAGES_SMALL + ` WHERE gallery_id=${id}`, (err: any, res: any) => {
        return callback(res);
    });
}

export function uploadImageToGallery(image: IImage, callback: (arg0: any) => any) {
    connection.query(`INSERT INTO Images (title, description, tag, gallery_id, base64_large, base64_medium, base64_small) VALUES ("${image.title}", "${image.description}", "${image.tag}", "${image.gallery_id}", "${image.base64_large}", "${image.base64_medium}", "${image.base64_small}")`, (err: any, res: any) => {
        if (err !== null) {
            console.log(err.message);
            return callback(null);
        }
        return callback({code: 200});
    });
}

export function deleteImageById(id: number, callback: (arg0: any) => any) {
    connection.query(DELETE_IMAGE_ROW + ` WHERE image_id=${id}`, (err: any, res: any) => {
        return callback(res);
    });
}


