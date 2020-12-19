import {IGallery} from './IGallery';

export interface IImage {
    image_id: number;
    gallery_id: IGallery;
    title: string;
    description: string;
    upload_timestamp: number;
    base64_large: string;
    base64_medium: string;
    base64_small: string;
    order_nr: number;
}
