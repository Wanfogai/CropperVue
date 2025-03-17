import { SelectionModel } from "@/components";
import { CropData } from "@/components/ui/Croper/interfaces";

export interface CropResponse {
    croppedImage: string;
}


//Интерфейс для доступа к Croper
export interface CropperExposed {
    cropImage: (imageData: string, selectorData: CropData) => Promise<CropResponse>;
    getCropData: () => CropData;
    croppedImage: any;
    imageSrc: any;
    selection: any;
}