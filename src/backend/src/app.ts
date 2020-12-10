import express from 'express';
import bodyParser from 'body-parser';
import {
    addGallery,
    addImage,
    checkIfAllTablesExist,
    connect, deleteGalleryById, deleteImageById,
    getAllGalleriesMedium, getAllGalleriesSmall,
    getGalleryByTitle, getImageById,
    getMediumImagesByGalleryId,
    getSmallImagesByGalleryId, setGalleryThumbnailById, updateGalleryById,
    uploadImageToGallery
} from './database';
import {IImage} from './entity/IImage';
import {IGallery} from './entity/IGallery';
import path from 'path';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
const backendPath = process.env.backend_path || "";
const jsonParser = bodyParser.json();
connect();
checkIfAllTablesExist();



app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({
    limit: '50mb'
}));

app.listen(port, () => console.log(`${process.env.npm_package_name} ${process.env.npm_package_version} running on http://localhost:${port}${backendPath}`));

function logIncoming(req: any){
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    console.log(`${time} - ${req.method} request on ${req.originalUrl} from ${req.hostname}`);
}

// Galleries

app.get(backendPath + '/gallery/m', (req, res) => {
    logIncoming(req);
    getAllGalleriesMedium(response => {
        res.send(response);
    });
});

app.get(backendPath + '/gallery/s', (req, res) => {
    logIncoming(req);
    getAllGalleriesSmall(response => {
        res.send(response);
    });
});

app.get(backendPath + '/gallery/info/:title', (req, res) => {
    logIncoming(req);
    getGalleryByTitle(req.params.title, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.status(404).send('Not found');
        }

    });
});

app.post(backendPath + '/gallery', (req, res) => {
   logIncoming(req);
   addGallery(req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(505);
        }
    });
});

app.put(backendPath + '/gallery/:id', (req, res) => {
    logIncoming(req);
    updateGalleryById(req.params.id, req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(505);
        }
    });
});

app.put(backendPath + '/gallery/thumbnail/:id', (req, res) => {
    logIncoming(req);
    setGalleryThumbnailById(req.params.id, req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(505);
        }
    });
});

app.delete(backendPath + '/gallery/:id', jsonParser, (req, res) => {
    logIncoming(req);
    deleteGalleryById(+req.params.id, response => {
        res.send(response);
    });
});

// Images

app.get(backendPath + '/image/l/:id', (req, res) => {
    logIncoming(req);
    getImageById(+req.params.id, response => {
        res.send(response);
    });
});

app.get(backendPath + '/image/m/:id', (req, res) => {
    logIncoming(req);
    getMediumImagesByGalleryId(+req.params.id, response => {
        res.send(response);
    });
});

app.get(backendPath + '/image/s/:id', (req, res) => {
    logIncoming(req);
    getSmallImagesByGalleryId(+req.params.id, response => {
        res.send(response);
    });
});

app.post(backendPath + '/image', jsonParser, (req, res) => {
    logIncoming(req);
    uploadImageToGallery(req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(505);
        }
    });
});

app.delete(backendPath + '/image/:id', jsonParser, (req, res) => {
    logIncoming(req);
    deleteImageById(+req.params.id, response => {
        res.send(response);
    });
});

// Redirect to frontend

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


