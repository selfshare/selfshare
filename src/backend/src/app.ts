import express, {response} from 'express';
import bodyParser from 'body-parser';
import {
    addGallery,
    addImage,
    checkIfAllTablesExist,
    connect,
    getAllGalleries,
    getAllImages, getGalleryByTitle,
    getImageById,
    getImagesByGalleryId
} from './database';
import {IImage} from './entity/IImage';
import {IGallery} from './entity/IGallery';
import path from 'path';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
const jsonParser = bodyParser.json();
connect();
checkIfAllTablesExist();
console.log();


app.listen(port, () => console.log(`${process.env.npm_package_name} ${process.env.npm_package_version} running on http://localhost:${port}/`));

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/addimage', (req, res) => {
    const gallery: IGallery = {description: '', order_nr: 0, thumbnail_id: 0, title: '', gallery_id: 2};
    const image: IImage = {base64: '', gallery_id: gallery, image_id: 0, upload_timestamp: 0, title: 'asd', description: 'test', tag: '#nice'};

    addImage(image, gallery);
    res.send();
});

app.get('/gallery', (req, res) => {
    // const gallery: IGallery = {gallery_id: 0, order_nr: 0, thumbnail_id: 0, title: 'asd', description: 'test'};
    // addGallery(gallery);
    getAllGalleries( response => {
        res.send(response);
    });
});

app.get('/gallery/:title', (req, res) => {
    getGalleryByTitle(req.params.title, response => {
        if(response != null){
            res.send(response);
        }else{
            res.status(404).send('Not found');
        }

    });
});

app.get('/image', (req, res) => {
    getAllImages(response => {
        res.send(response);
    });
});

app.get('/image/:id', (req, res) => {
    getImagesByGalleryId(+req.params.id, response => {
        res.send(response);
    });
});


