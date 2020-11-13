import express from 'express';
import bodyParser from 'body-parser';
import {
    addImage,
    checkIfAllTablesExist,
    connect, deleteImageById,
    getAllGalleries,
    getAllImages,
    getGalleryByTitle,
    getImagesByGalleryId,
    uploadImageToGallery
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



app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({
    limit: '50mb'
}));

app.listen(port, () => console.log(`${process.env.npm_package_name} ${process.env.npm_package_version} running on http://localhost:${port}/`));

function logIncoming(req: any){
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    console.log(`${time} - ${req.method} request on ${req.originalUrl} from ${req.hostname}`);
}

app.get('/gallery', (req, res) => {
    logIncoming(req);
    getAllGalleries(response => {
        res.send(response);
    });
});

app.get('/gallery/:title', (req, res) => {
    logIncoming(req);
    getGalleryByTitle(req.params.title, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.status(404).send('Not found');
        }

    });
});

app.get('/image', (req, res) => {
    logIncoming(req);
    getAllImages(response => {
        res.send(response);
    });
});

app.post('/image', jsonParser, (req, res) => {
    logIncoming(req);
    uploadImageToGallery(req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(505);
        }
    });
});

app.get('/image/:id', (req, res) => {
    logIncoming(req);
    getImagesByGalleryId(+req.params.id, response => {
        res.send(response);
    });
});

app.delete('/image/:id', jsonParser, (req, res) => {
    logIncoming(req);
    deleteImageById(+req.params.id, response => {
        res.send(response);
    });
});


