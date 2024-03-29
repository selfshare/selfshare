import mysql from 'mysql';
import {IImage} from './entity/IImage';
import {IGallery} from './entity/IGallery';
import {IAbout} from "./entity/IAbout";
import {ISecurity} from "./entity/ISecurity";
import crypto from 'crypto';
import {IGeneral} from "./entity/IGeneral";

let connection: any;
const GET_ALL_IMAGES = 'SELECT * from Images';
const GET_ALL_GALLERIES = 'SELECT * from Galleries';
const GET_ALL_SETTINGS = 'SELECT * from Settings';

const GET_GENERAL_INFO = 'SELECT site_title AS title, site_description AS description, site_theme AS theme FROM Settings';
const GET_ABOUT_INFOS = 'SELECT author_name AS name, author_description AS description, author_pic_base64 AS picture, author_email as email FROM Settings';
const GET_DISCLAIMER_INFOS = 'SELECT disclaimer FROM Settings'

const GET_LOGIN_HASH = 'SELECT login_hash FROM Settings'
const GET_USERNAME = 'SELECT username FROM Settings'
const GET_PASSWORD_HASH = 'SELECT password_hash from Settings';

const GET_ALL_IMAGES_LARGE = 'SELECT image_id, title, description, upload_timestamp, base64_large AS base64, order_nr, gallery_id FROM Images';
const GET_ALL_IMAGES_MEDIUM = 'SELECT image_id, title, description, upload_timestamp, base64_medium AS base64, order_nr, gallery_id FROM Images';

const GET_ALL_IMAGES_SMALL = 'SELECT image_id, title, description, upload_timestamp, base64_small AS base64, order_nr, gallery_id FROM Images';
const GET_ALL_GALLERIES_INFO = 'SELECT gallery_id, title, description FROM Galleries';
const GET_ALL_GALLERIES_MEDIUM = 'SELECT gallery_id, title, description, base64_medium AS base64, order_nr FROM Galleries ORDER BY order_nr';
const GET_ALL_GALLERIES_SMALL = 'SELECT gallery_id, title, description, base64_small AS base64, order_nr FROM Galleries ORDER BY order_nr';

const CREATE_IMAGES_TABLE = 'CREATE TABLE Images (image_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, gallery_id INT UNSIGNED, CONSTRAINT fk_gallery FOREIGN KEY (gallery_id) REFERENCES Galleries(gallery_id), title VARCHAR(64), description VARCHAR(512), upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, base64_large LONGTEXT NOT NULL, base64_medium LONGTEXT NOT NULL, base64_small LONGTEXT NOT NULL, order_nr INT DEFAULT 0)';
const CREATE_GALLERIES_TABLE = 'CREATE TABLE Galleries (gallery_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(64) UNIQUE, description VARCHAR(512), base64_medium LONGTEXT, base64_small LONGTEXT, order_nr INT DEFAULT 0)';
const CREATE_SETTINGS_TABLE = 'CREATE TABLE Settings (settings_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, site_title VARCHAR(64), site_description VARCHAR(2048), username VARCHAR(32) NOT NULL, password_hash BINARY(161) NOT NULL, author_name VARCHAR(64), author_description VARCHAR(2048), author_pic_base64 LONGTEXT, author_email VARCHAR(320), disclaimer LONGTEXT, site_theme VARCHAR(128), login_hash BINARY(32))';

const DELETE_IMAGE_ROW = 'DELETE from Images';
const DELETE_GALLERY_ROW = 'DELETE from Galleries';

export function connectDB() {
    connection = mysql.createConnection({
        host: process.env.db_host || 'docker',
        port: Number(process.env.db_port) || 3306,
        user: 'selfshare',
        password: 'xs6HZKdc5YEi6', // it's recommended to change the password for production builds (here and inside the sql script)
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
    connection.query(GET_ALL_GALLERIES_INFO, (err: any, res: any) => {
        if (res == null) {
            return callback(-1);
        } else {
            return callback(res.length - 1);
        }
    });
}

function getMaxOrderImages(galleryId: string, callback: (max: number) => any) {
    connection.query(GET_ALL_IMAGES + ` WHERE gallery_id=${galleryId}`, (err: any, res: any) => {
        if (res == null) {
            return callback(-1);
        } else {
            return callback(res.length - 1);
        }
    });
}

function getGalleryByOrderNr(orderNr: number, callback: (gallery: IGallery) => any) {
    connection.query(GET_ALL_GALLERIES + ` WHERE order_nr=${orderNr}`, (err: any, res: any) => {
        if (res.length > 0) {
            return callback(res[0] as IGallery);
        } else {
            return callback(null);
        }
    });
}

function getGalleryById(id: number, callback: (gallery: IGallery) => any) {
    connection.query(GET_ALL_GALLERIES + ` WHERE gallery_id=${id}`, (err: any, res: any) => {
        if (res.length > 0) {
            return callback(res[0] as IGallery);
        } else {
            return callback(null);
        }

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
        } else {
            return callback(null);
        }
    });
}

function hashPassword(password: string, callback: (hashed: string) => any) {
    const salt = crypto.randomBytes(16).toString('hex');

    crypto.scrypt(password, salt, 64, ((err, derivedKey) => {
        if (err) {
            console.log(err);
        }
        return callback(salt + ':' + derivedKey.toString('hex'));
    }));
}

function verify(password: string, hash: string, callback: (valid: boolean) => any) {
    const [salt, key] = hash.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) {
            console.log(err);
        }
        return callback(key === derivedKey.toString('hex'));
    });
}

function doesSettingsEntryExists(callback: (exists: boolean) => any) {
    connection.query(GET_ALL_SETTINGS, (error: any, res: any) => {
        return callback(res.length > 0);
    });
}

// General

export function getGeneralInfos(callback: (response: IGeneral) => any) {
    connection.query(GET_GENERAL_INFO, (err: any, res: any) => {
        if (res.length > 0) {
            return callback(res[0] as IGeneral);
        } else {
            return callback(null);
        }
    });
}

export function updateGeneralInfos(general: IGeneral, callback: (response: any) => any) {
    connection.query(`UPDATE Settings SET site_title="${general.title}", site_description="${general.description}", site_theme="${general.theme}"`, (err: any) => {
        if (err !== null) {
            console.log(err.message);
            return callback(null);
        } else {
            return callback({code: 200});
        }
    });
}

export function getAboutInfos(callback: (response: IAbout) => any) {
    connection.query(GET_ABOUT_INFOS, (err: any, res: any) => {
        if (res.length > 0) {
            return callback(res[0] as IAbout);
        } else {
            return callback(null);
        }
    });
}

export function updateAboutInfos(about: IAbout, callback: (response: any) => any) {
    connection.query(`UPDATE Settings SET author_name="${about.name}", author_description="${about.description}", author_pic_base64="${about.picture}", author_email="${about.email}"`, (err: any) => {
        if (err !== null) {
            console.log(err.message);
            return callback(null);
        } else {
            return callback({code: 200});
        }
    });
}

export function getDisclaimerInfos(callback: (response: any) => any) {
    connection.query(GET_DISCLAIMER_INFOS, (err: any, res: any) => {
        if (res.length > 0) {
            return callback({body: res[0].disclaimer, code: 200});
        } else {
            return callback(null);
        }
    });
}

export function updateDisclaimerInfos(disclaimer: any, callback: (response: any) => any) {
    connection.query(`UPDATE Settings SET disclaimer="${disclaimer.body}"`, (err: any) => {
        if (err !== null) {
            console.log(err.message);
            return callback(null);
        } else {
            return callback({code: 200});
        }
    });
}

export function updateSecurityInfo(security: ISecurity, callback: (response: any) => any) {
    doesSettingsEntryExists(exists => {
        if (exists) {
            if (security.password != null && security.password.length > 0) {
                hashPassword(security.password, hashed => {
                    connection.query(`UPDATE Settings SET username="${security.username}", password_hash="${hashed}", login_hash=""`, (err: any) => {
                        if (err !== null) {
                            console.log(err.message);
                            return callback({code: 500});
                        } else {
                            return callback({code: 200});
                        }
                    });
                });
            } else {
                connection.query(`UPDATE Settings SET username="${security.username}"`, (err: any) => {
                    if (err !== null) {
                        console.log(err.message);
                        return callback({code: 500});
                    } else {
                        return callback({code: 200});
                    }
                });
            }
        } else {
            hashPassword(security.password, hashed => {
                connection.query(`INSERT INTO Settings (username, password_hash, login_hash, site_title, site_description, author_name, author_description, author_pic_base64, author_email, disclaimer, site_theme) VALUES ("${security.username}", "${hashed}", "", "my selfshare page", "", "", "", "", "", "", "Flatly")`, (err: any) => {
                    if (err !== null) {
                        console.log(err.message);
                        return callback({code: 500});
                    } else {
                        return callback({code: 200});
                    }
                });
            });
        }
    });
}

export function loginAndGetHash(authHeader: string, callback: (response: any) => any) {
    const decoded = Buffer.from(authHeader.replace('Basic ', ''), 'base64').toString();
    const [username, password] = decoded.split(':');
    connection.query(GET_PASSWORD_HASH + ` WHERE username="${username}"`, (err: any, res: any) => {
        if (res.length > 0) {
            const fromDb = res[0].password_hash.toString();

            verify(password, fromDb, valid => {
                if (valid) {
                    const hash = crypto.randomBytes(16).toString('hex');
                    connection.query(`UPDATE Settings SET login_hash="${hash}"`, () => {
                        return callback({code: 200, body: hash});
                    });
                } else {
                    return callback({code: 403});
                }
            });
        } else {
            return callback({code: 403});
        }
    });
}

export function authenticate(authHeader: string, callback: (response: any) => any) {
    connection.query(GET_LOGIN_HASH, (err: any, res: any) => {
        if (res.length > 0) {
            connection.query(GET_USERNAME, (err1: any, res2: any) => {
                const username = res2[0].username
                const decoded = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
                const fromDb = res[0].login_hash.toString();
                if (fromDb === decoded) {
                    return callback({code: 200, body: username});
                } else {
                    return callback({code: 403});
                }
            });
        } else {
            return callback({code: 500});
        }

    });
}

export function isSetupAvailable(callback: (exists: any) => void) {
    doesSettingsEntryExists(exists => {
        if (exists) {
            callback({code: 200, body: false});
        } else {
            callback({code: 200, body: true});
        }
    });
}


// Gallery

export function addGallery(gallery: IGallery, callback: (arg0: any) => any) {
    getMaxOrderGalleries(max => {
        max++;
        connection.query(`INSERT INTO Galleries (title, description, order_nr) VALUES ("${gallery.title}", "${gallery.description}", ${max})`, (err: any) => {
            if (err !== null) {
                console.log(err.message);
                return callback(null);
            } else {
                return callback({code: 200});
            }
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
                connection.query(`UPDATE Galleries SET title="${galleryByTitle.title}", description="${galleryByTitle.description}", order_nr="${updatedGallery.order_nr}" WHERE gallery_id=${galleryByTitle.gallery_id}`, (err: any) => {
                    if (err !== null) {
                        console.log(err.message);
                        return callback(null);
                    } else {
                        return callback({code: 200});
                    }
                });
            });
        } else {
            console.log("General update");
            connection.query(`UPDATE Galleries SET title="${updatedGallery.title}", description="${updatedGallery.description}", order_nr="${updatedGallery.order_nr}" WHERE gallery_id=${updatedGallery.gallery_id}`, (err: any) => {
                if (err !== null) {
                    console.log(err.message);
                    return callback(null);
                } else {
                    return callback({code: 200});
                }
            });
        }
    });
}

export function setGalleryThumbnailById(galleryId: string, sentImage: IImage, callback: (response: any) => any) {
    getFullImageById(sentImage.image_id, image => {
        connection.query(`UPDATE Galleries SET base64_medium="${image.base64_medium}", base64_small="${image.base64_small}" WHERE gallery_id=${galleryId}`, (err: any) => {
            if (err !== null) {
                console.log(err.message);
                return callback(null);
            } else {
                return callback({code: 200});
            }
        });
    });
}

export function deleteGalleryById(id: number, callback: (arg0: any) => any) {
    getGalleryById(id, gallery => {
        const prefix = `UPDATE Galleries
                        SET order_nr = CASE order_nr `;
        let command = '';
        const suffix = `ELSE order_nr END`;
        getMaxOrderGalleries(max => {
            connection.query(DELETE_IMAGE_ROW + ` WHERE gallery_id=${id}`, (err0: any) => {
                if (err0 != null) {
                    console.log(err0);
                }
                connection.query(DELETE_GALLERY_ROW + ` WHERE gallery_id=${id}`, (err1: any, res1: any) => {
                    if (err1 != null) {
                        console.log(err1);
                    }

                    for (let counter = gallery.order_nr; counter < max; counter++) {
                        command += `WHEN ${counter + 1} THEN ${counter} `;
                    }

                    if (command.length > 0) {
                        connection.query(prefix + command + suffix, (err2: any) => {
                            if (err2 != null) {
                                console.log(err2);
                            }
                            return callback(res1);
                        });
                    } else {
                        return callback(res1);
                    }
                });
            });
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
        } else {
            return callback(null);
        }
    });
}

export function getImageById(id: number, callback: (image: IImage) => any) {
    connection.query(GET_ALL_IMAGES_LARGE + ` WHERE image_id=${id}`, (err: any, res: any) => {
        return callback(res[0]);
    });
}

export function getMediumImagesByGalleryId(id: number, callback: (images: IImage[]) => any) {
    connection.query(GET_ALL_IMAGES_MEDIUM + ` WHERE gallery_id=${id} ORDER BY order_nr DESC`, (err: any, res: any) => {
        return callback(res);
    });
}

export function getSmallImagesByGalleryId(id: number, callback: (images: IImage[]) => any) {
    connection.query(GET_ALL_IMAGES_SMALL + ` WHERE gallery_id=${id} ORDER BY order_nr DESC`, (err: any, res: any) => {
        return callback(res);
    });
}

export function uploadImageToGallery(image: IImage, callback: (arg0: any) => any) {
    getMaxOrderImages(String(image.gallery_id), max => {
        max++;
        connection.query(`INSERT INTO Images (title, description, gallery_id, base64_large, base64_medium, base64_small, order_nr) VALUES ("${image.title}", "${image.description}", "${image.gallery_id}", "${image.base64_large}", "${image.base64_medium}", "${image.base64_small}", "${max}")`, (err: any) => {
            if (err !== null) {
                console.log(err.message);
                return callback(null);
            } else {
                return callback({code: 200});
            }
        });
    });
}

export function updateImageById(id: string, updatedImage: IImage, callback: (arg0: any) => any) {
    const newOrderNr = updatedImage.order_nr;
    getImageByOrderNrAndGalleryId(newOrderNr, String(updatedImage.gallery_id), swapImage => {
        if (swapImage.image_id !== updatedImage.image_id) {
            console.log("Changed order");
            getImageById(updatedImage.image_id, imageByTitle => {
                const oldNr = imageByTitle.order_nr;
                connection.query(`UPDATE Images SET title="${swapImage.title}", description="${swapImage.description}", order_nr="${oldNr}" WHERE image_id=${swapImage.image_id}`);
                connection.query(`UPDATE Images SET title="${imageByTitle.title}", description="${imageByTitle.description}", order_nr="${updatedImage.order_nr}" WHERE image_id=${imageByTitle.image_id}`, (err: any) => {
                    if (err !== null) {
                        console.log(err.message);
                        return callback(null);
                    } else {
                        return callback({code: 200});
                    }
                });
            });
        } else {
            console.log("General update");
            connection.query(`UPDATE Images SET title="${updatedImage.title}", description="${updatedImage.description}", order_nr="${updatedImage.order_nr}" WHERE image_id=${updatedImage.image_id}`, (err: any) => {
                if (err !== null) {
                    console.log(err.message);
                    return callback(null);
                } else {
                    return callback({code: 200});
                }
            });
        }
    });
}

export function deleteImageById(id: number, callback: (arg0: any) => any) {
    getImageById(id, image => {
        const prefix = `UPDATE Images
                        SET order_nr = CASE order_nr `;
        let command = '';
        const suffix = `ELSE order_nr END WHERE gallery_id=${image.gallery_id};`;
        getMaxOrderImages(String(image.gallery_id), max => {
            connection.query(DELETE_IMAGE_ROW + ` WHERE image_id=${id}`, (err1: any) => {
                if (err1 != null) {
                    console.log(err1);
                }

                for (let counter = image.order_nr; counter < max; counter++) {
                    command += `WHEN ${counter + 1} THEN ${counter} `;
                }

                if (command.length > 0) {
                    connection.query(prefix + command + suffix, (err2: any) => {
                        if (err2 != null) {
                            console.log(err2);
                        }
                        return callback({code: 200});
                    });
                } else {
                    return callback({code: 200});
                }
            });
        });
    });
}


