import mysql, {OkPacket} from 'mysql';
import {IImage} from './entity/IImage';
import {IGallery} from './entity/IGallery';

let connection: any;
const GET_ALL_IMAGES = 'SELECT * from Images';
const GET_ALL_GALLERIES = 'SELECT * from Galleries';
const GET_ALL_SETTINGS = 'SELECT * from Settings';
const CREATE_IMAGES_TABLE = 'CREATE TABLE Images (image_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, gallery_id INT UNSIGNED, CONSTRAINT fk_gallery FOREIGN KEY (gallery_id) REFERENCES Galleries(gallery_id), title VARCHAR(64), description VARCHAR(512), tag VARCHAR(32), upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, base64 LONGTEXT not null)';
const CREATE_GALLERIES_TABLE = 'CREATE TABLE Galleries (gallery_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(64), description VARCHAR(512), thumbnail_base64 LONGTEXT, order_nr INT)';
const CREATE_SETTINGS_TABLE = 'CREATE TABLE Settings (settings_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, username VARCHAR(32) NOT NULL, password_hash BINARY(64) NOT NULL, author_name VARCHAR(64), author_description VARCHAR(2058), author_pic_base64 LONGTEXT, site_background_base64 LONGTEXT, site_color VARCHAR(32), allow_download BIT, water_mark_base64 LONGTEXT, login_hash BINARY(64))';
const DELETE_IMAGE_ROW = 'DELETE from Images';


export function connect() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'selfshare',
        password: 'xs6HZKdc5YEi6',
        database: 'selfshare'
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

export function addGallery(gallery: IGallery) {
    connection.query(`INSERT INTO Galleries (title, description) VALUES ("${gallery.title}", "${gallery.description}")`, (err: any, res: any) => {
        console.log('Added gallery entity successfully!');
    });
}

export function addImage(image: IImage, gallery: IGallery) {
    connection.query(`INSERT INTO Images (title, description, tag, gallery_id) VALUES ("${image.title}", "${image.description}", "${image.tag}", "${gallery.gallery_id}")`, (err: any, res: any) => {
        console.log('Added image entity successfully!');
    });
}

export function getAllGalleries(callback: (arg0: any) => any) {
    connection.query(GET_ALL_GALLERIES, (err: any, res: IGallery[]) => {
        return callback(res);
    });
}

export function getGalleryByTitle(title: string, callback: (arg0: any) => any) {
    connection.query(GET_ALL_GALLERIES + ` WHERE title="${title}"`, (err: any, res: any) => {
        if(res.length > 0){
            return callback(res[0] as IGallery);
        }
        return callback(null);
    });
}


export function getAllImages(callback: (arg0: any) => any) {
    connection.query(GET_ALL_IMAGES, (err: any, res: any) => {
        return callback(res);
    });
}

export function getImageById(id: number, callback: (arg0: any) => any) {
    connection.query(GET_ALL_IMAGES + ` WHERE image_id=${id}`, (err: any, res: any) => {
        return callback(res[0]);
    });
}

export function getImagesByGalleryId(id: number, callback: (arg0: any) => any) {
    connection.query(GET_ALL_IMAGES + ` WHERE gallery_id=${id}`, (err: any, res: any) => {
        return callback(res);
    });
}

export function uploadImageToGallery(image: IImage, callback: (arg0: any) => any) {
    connection.query(`INSERT INTO Images (title, description, tag, gallery_id, base64) VALUES ("${image.title}", "${image.description}", "${image.tag}", "${image.gallery_id}", "${image.base64}")`, (err: any, res: any) => {
        if(err !== null){
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


