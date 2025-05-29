import { CropData } from "@/app/interfaces";

export interface CropResponse {
    croppedImage: string;
}

//Интерфейс для доступа к Cropper
export interface CropperExposed {
    cropImage: (ImageData: string) => Promise<CropResponse>;
    $cropZone: {
        getCropData: (magnificRate: number) => CropData;
    };
    model: {
        value: string;
    };
}
