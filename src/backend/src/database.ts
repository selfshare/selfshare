import mysql from 'mysql';
import {IImage} from './entity/IImage';
import {IGallery} from './entity/IGallery';
import {IAbout} from "./entity/IAbout";

let connection: any;
const GET_ALL_IMAGES = 'SELECT * from Images';
const GET_ALL_GALLERIES = 'SELECT * from Galleries';
const GET_ALL_SETTINGS = 'SELECT * from Settings';

const GET_ABOUT_INFOS = 'SELECT author_name AS name, author_description AS description, author_pic_base64 AS picture FROM Settings';


const GET_ALL_IMAGES_LARGE = 'SELECT image_id, title, description, tag, upload_timestamp, base64_large AS base64, order_nr, gallery_id FROM Images';
const GET_ALL_IMAGES_MEDIUM = 'SELECT image_id, title, description, tag, upload_timestamp, base64_medium AS base64, order_nr, gallery_id FROM Images';
const GET_ALL_IMAGES_SMALL = 'SELECT image_id, title, description, tag, upload_timestamp, base64_small AS base64, order_nr, gallery_id FROM Images';

const GET_ALL_GALLERIES_INFO = 'SELECT gallery_id, title, description FROM Galleries';
const GET_ALL_GALLERIES_MEDIUM = 'SELECT gallery_id, title, description, base64_medium as base64, order_nr FROM Galleries ORDER BY order_nr';
const GET_ALL_GALLERIES_SMALL = 'SELECT gallery_id, title, description, base64_small as base64, order_nr FROM Galleries ORDER BY order_nr';

const CREATE_IMAGES_TABLE = 'CREATE TABLE Images (image_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, gallery_id INT UNSIGNED, CONSTRAINT fk_gallery FOREIGN KEY (gallery_id) REFERENCES Galleries(gallery_id), title VARCHAR(64), description VARCHAR(512), tag VARCHAR(32), upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, base64_large LONGTEXT not null, base64_medium LONGTEXT not null, base64_small LONGTEXT not null, order_nr INT DEFAULT 0)';
const CREATE_GALLERIES_TABLE = 'CREATE TABLE Galleries (gallery_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(64) UNIQUE, description VARCHAR(512), base64_medium LONGTEXT, base64_small LONGTEXT, order_nr INT DEFAULT 0)';
const CREATE_SETTINGS_TABLE = 'CREATE TABLE Settings (settings_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, site_title VARCHAR(64), site_description VARCHAR(2048), username VARCHAR(32) NOT NULL, password_hash BINARY(64) NOT NULL, author_name VARCHAR(64), author_description VARCHAR(2058), author_pic_base64 LONGTEXT, site_background_base64 LONGTEXT, site_color VARCHAR(32), allow_download BIT, water_mark_base64 LONGTEXT, login_hash BINARY(64))';

const DELETE_IMAGE_ROW = 'DELETE from Images';
const DELETE_GALLERY_ROW = 'DELETE from Galleries';

const GET_MAX_ORDER_GALLERIES = 'SELECT MAX(order_nr) as "maxValue" FROM Galleries';
const GET_MAX_ORDER_IMAGES = 'SELECT MAX(order_nr) as "maxValue" FROM Images';


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

function getMaxOrderGalleries(callback: (max: number) => any) {
    connection.query(GET_MAX_ORDER_GALLERIES, (err: any, res: any) => {
        if (res[0].maxValue == null) {
            return callback(-1);
        }
        return callback(res[0].maxValue);
    });
}

function getMaxOrderImages(galleryId: string, callback: (max: number) => any) {
    connection.query(GET_MAX_ORDER_IMAGES + ` WHERE gallery_id=${galleryId}`, (err: any, res: any) => {
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

function getImageByOrderNrAndGalleryId(orderNr: number, galleryId: string, callback: (image: IImage) => any) {
    connection.query(GET_ALL_IMAGES + ` WHERE order_nr=${orderNr} AND gallery_id=${galleryId}`, (err: any, res: any) => {
        if (res.length > 0) {
            return callback(res[0] as IImage);
        }
        return callback(null);
    });
}

// General

export function getAboutInfos(callback: (response: IAbout) => any) {
    connection.query(GET_ABOUT_INFOS, (err: any, res: any) => {
        if (res.length > 0) {
            return callback(res[0] as IAbout);
        }
        return callback(null);
    });
}


// Gallery

export function addGallery(gallery: IGallery, callback: (arg0: any) => any) {
    getMaxOrderGalleries(max => {
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
    const newOrderNr = updatedGallery.order_nr;
    getGalleryByOrderNr(newOrderNr, swapGallery => {
        if (swapGallery.gallery_id !== updatedGallery.gallery_id) {
            console.log("Changed order");
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
            console.log("General update");
            connection.query(`UPDATE Galleries SET title="${updatedGallery.title}", description="${updatedGallery.description}", order_nr="${updatedGallery.order_nr}" WHERE gallery_id=${updatedGallery.gallery_id}`, (err: any, res: any) => {
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


export function getImageById(id: number, callback: (image: IImage) => any) {
    connection.query(GET_ALL_IMAGES_LARGE + ` WHERE image_id=${id}`, (err: any, res: any) => {
        return callback(res[0]);
    });
}

export function getMediumImagesByGalleryId(id: number, callback: (arg0: any) => any) {
    connection.query(GET_ALL_IMAGES_MEDIUM + ` WHERE gallery_id=${id} ORDER BY order_nr DESC`, (err: any, res: any) => {
        return callback(res);
    });
}

export function getSmallImagesByGalleryId(id: number, callback: (arg0: any) => any) {
    connection.query(GET_ALL_IMAGES_SMALL + ` WHERE gallery_id=${id} ORDER BY order_nr DESC`, (err: any, res: any) => {
        return callback(res);
    });
}

export function uploadImageToGallery(image: IImage, callback: (arg0: any) => any) {
    getMaxOrderImages(String(image.gallery_id), max => {
        max++;

        connection.query(`INSERT INTO Images (title, description, tag, gallery_id, base64_large, base64_medium, base64_small, order_nr) VALUES ("${image.title}", "${image.description}", "${image.tag}", "${image.gallery_id}", "${image.base64_large}", "${image.base64_medium}", "${image.base64_small}", "${max}")`, (err: any, res: any) => {
            if (err !== null) {
                console.log(err.message);
                return callback(null);
            }
            return callback({code: 200});
        });
    });
}

export function updateImageById(id: string, updatedImage: IImage, callback: (arg0: any) => any) {
    const newOrderNr = updatedImage.order_nr;
    getImageByOrderNrAndGalleryId(newOrderNr, String(updatedImage.gallery_id),  swapImage => {
        if (swapImage.image_id !== updatedImage.image_id) {
            console.log("Changed order");
            getImageById(updatedImage.image_id, imageByTitle => {
                const oldNr = imageByTitle.order_nr;
                connection.query(`UPDATE Images SET title="${swapImage.title}", description="${swapImage.description}", order_nr="${oldNr}" WHERE image_id=${swapImage.image_id}`);
                connection.query(`UPDATE Images SET title="${imageByTitle.title}", description="${imageByTitle.description}", order_nr="${updatedImage.order_nr}" WHERE image_id=${imageByTitle.image_id}`, (err: any, res: any) => {
                    if (err !== null) {
                        console.log(err.message);
                        return callback(null);
                    }
                    return callback({code: 200});
                });
            });
        } else {
            console.log("General update");
            connection.query(`UPDATE Images SET title="${updatedImage.title}", description="${updatedImage.description}", order_nr="${updatedImage.order_nr}" WHERE image_id=${updatedImage.image_id}`, (err: any, res: any) => {
                if (err !== null) {
                    console.log(err.message);
                    return callback(null);
                }
                return callback({code: 200});
            });
        }
    });
}

export function deleteImageById(id: number, callback: (arg0: any) => any) {
    getImageById(id, image => {
        let command = '';
        getMaxOrderImages(String(image.gallery_id), max => {

            connection.query(DELETE_IMAGE_ROW + ` WHERE image_id=${id}`, (err1: any, res1: any) => {

                if (err1 != null){
                    console.log(err1);
                }

                for (let counter = image.order_nr; counter < max; counter++){
                    command += `UPDATE Images SET order_nr=${counter} WHERE order_nr=${counter+1} AND gallery_id=${image.gallery_id};`
                }

                console.log(command);

                if(command.length > 0){
                    connection.query(command, (err2: any, res2: any) => {
                        if (err2 != null){
                            console.log(err2);
                        }
                        return callback(res1);
                    });
                }
                return callback(res1);
            });
        });
    });
}


