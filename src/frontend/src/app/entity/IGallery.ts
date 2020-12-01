import {IImage} from './IImage';

export interface IGallery {
    gallery_id: number;
    title: string;
    description: string;
    base64: string;
    order_nr: number;
    images: IImage[];
}
