import {IGallery} from './IGallery';

export interface IImage {
    image_id: number;
    gallery_id: IGallery;
    title: string;
    description: string;
    tag: string;
    upload_timestamp: number;
}
