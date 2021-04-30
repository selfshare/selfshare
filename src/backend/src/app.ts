import express from 'express';
import bodyParser from 'body-parser';
import {
    addGallery,
    authenticate,
    connectDB,
    deleteGalleryById,
    deleteImageById,
    getAboutInfos,
    getAllGalleriesMedium,
    getAllGalleriesSmall,
    getDisclaimerInfos,
    getGalleryByTitle,
    getGeneralInfos,
    getImageById,
    getMediumImagesByGalleryId,
    getSmallImagesByGalleryId,
    isSetupAvailable,
    loginAndGetHash,
    setGalleryThumbnailById,
    updateAboutInfos,
    updateDisclaimerInfos,
    updateGalleryById,
    updateGeneralInfos,
    updateImageById,
    updateSecurityInfo,
    uploadImageToGallery
} from './database';
import path from 'path';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

const app = express();
const port = process.env.PORT || 3000;
const backendPath = process.env.backend_path || "";
const jsonParser = bodyParser.json();

export = app;

connectDB();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({
    limit: '50mb'
}));

if(process.env.activate_swagger === "true" || process.env.backend_path == null){
    const swaggerFile = yaml.load('swagger.yaml');
    swaggerFile.host = `localhost:${port}${backendPath}`;
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
}

app.listen(port, () => console.log(`${process.env.npm_package_name} ${process.env.npm_package_version} running on http://localhost:${port}${backendPath}`));

function logIncoming(req: any) {
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    console.log(`${time} - ${req.method} request on ${req.originalUrl} from ${req.hostname}`);
}

// General

app.get(backendPath + '/general', (req, res) => {
    logIncoming(req);
    getGeneralInfos(response => {
        res.send(response);
    });
});

app.put(backendPath + '/general', (req, res) => {
    logIncoming(req);
    updateGeneralInfos(req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(500);
        }
    });
});

app.get(backendPath + '/about', (req, res) => {
    logIncoming(req);
    getAboutInfos(response => {
        res.send(response);
    });
});

app.put(backendPath + '/about', (req, res) => {
    logIncoming(req);
    updateAboutInfos(req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(500);
        }
    });
});

app.get(backendPath + '/disclaimer', (req, res) => {
    logIncoming(req);
    getDisclaimerInfos(response => {
        res.send(response);
    });
});

app.put(backendPath + '/disclaimer', (req, res) => {
    logIncoming(req);
    updateDisclaimerInfos(req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(500);
        }
    });
});

app.put(backendPath + '/security', (req, res) => {
    logIncoming(req);
    updateSecurityInfo(req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(500);
        }
    });
});

app.get(backendPath + '/security/login', (req, res) => {
    logIncoming(req);
    loginAndGetHash(req.headers.authorization, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(500);
        }
    });
});

app.get(backendPath + '/security/auth', (req, res) => {
    logIncoming(req);
    authenticate(req.headers.authorization, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(500);
        }
    });
});

app.get(backendPath + '/security/setup', (req, res) => {
    logIncoming(req);
    isSetupAvailable(response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(500);
        }
    });
});


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
            res.sendStatus(500);
        }
    });
});

app.put(backendPath + '/gallery/:id', (req, res) => {
    logIncoming(req);
    updateGalleryById(req.params.id, req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(500);
        }
    });
});

app.put(backendPath + '/gallery/thumbnail/:id', (req, res) => {
    logIncoming(req);
    setGalleryThumbnailById(req.params.id, req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(500);
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
            res.sendStatus(500);
        }
    });
});

app.put(backendPath + '/image/:id', (req, res) => {
    logIncoming(req);
    updateImageById(req.params.id, req.body, response => {
        if (response != null) {
            res.send(response);
        } else {
            res.sendStatus(500);
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
    logIncoming(req);
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


