import express from 'express';
import bodyParser from 'body-parser';
import {
    addImage,
    checkIfAllTablesExist,
    connect, deleteImageById,
    getAllGalleriesMedium, getAllGalleriesSmall,
    getGalleryByTitle, getImageById,
    getMediumImagesByGalleryId,
    getSmallImagesByGalleryId,
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

// Galleries

app.get('/gallery/m', (req, res) => {
    logIncoming(req);
    getAllGalleriesMedium(response => {
        res.send(response);
    });
});

app.get('/gallery/s', (req, res) => {
    logIncoming(req);
    getAllGalleriesSmall(response => {
        res.send(response);
    });
});

app.get('/gallery/info/:title', (req, res) => {
    logIncoming(req);
    getGalleryByTitle(req.params.title, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.status(404).send('Not found');
        }

    });
});

// Images

app.get('/image/l/:id', (req, res) => {
    logIncoming(req);
    getImageById(+req.params.id, response => {
        res.send(response);
    });
});

app.get('/image/m/:id', (req, res) => {
    logIncoming(req);
    getMediumImagesByGalleryId(+req.params.id, response => {
        res.send(response);
    });
});

app.get('/image/s/:id', (req, res) => {
    logIncoming(req);
    getSmallImagesByGalleryId(+req.params.id, response => {
        res.send(response);
    });
});

app.post('/image', jsonParser, (req, res) => {
    logIncoming(req);
    console.log(req.body);
    uploadImageToGallery(req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(505);
        }
    });
});

app.delete('/image/:id', jsonParser, (req, res) => {
    logIncoming(req);
    deleteImageById(+req.params.id, response => {
        res.send(response);
    });
});


