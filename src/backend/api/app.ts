import express from 'express';
import bodyParser from 'body-parser';
import {addGallery, addImage, checkIfAllTablesExist, connect, getAllImages, getImageById, getImagesByGalleryId} from './database';
import {IImage} from './entity/IImage';
import {IGallery} from './entity/IGallery';

const app = express();
const port = process.env.PORT || 3000;
const jsonParser = bodyParser.json();
connect();
checkIfAllTablesExist();
console.log();


app.listen(port, () => console.log(`${process.env.npm_package_name} ${process.env.npm_package_version} running on http://localhost:${port}/`));

app.get('/', (req, res) =>
{
   res.send("hello world");
});


app.get('/addimage', (req, res) =>
{
   const gallery: IGallery = {description: '', order_nr: 0, thumbnail_id: 0, title: '', gallery_id: 2};
   const image: IImage = {gallery_id: gallery, image_id: 0, upload_timestamp: 0, title: 'asd', description: 'test', tag: '#nice'};

   addImage(image, gallery);
   res.send();
});

app.get('/gallery', (req, res) =>
{
   const gallery: IGallery = {gallery_id: 0, order_nr: 0, thumbnail_id: 0, title: 'asd', description: 'test'};

   addGallery(gallery);
   res.send();
});

app.get('/images', (req, res) =>
{
   getAllImages(response => {
      res.send(response);
   });
});

app.get('/images/:id', (req, res) =>
{

   getImageById(+req.params.id, response => {
      res.send(response);
   })
});

app.get('/gallery/images/:id', (req, res) =>
{
   getImagesByGalleryId(+req.params.id, response => {
      res.send(response);
   })
});


