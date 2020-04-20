import {Injectable} from '@angular/core';
import {CameraPhoto, CameraResultType, CameraSource, FilesystemDirectory, Plugins} from "@capacitor/core";
import {PhotoInterface} from "../interface/photo.interface";

const {Camera, Filesystem, Storage} = Plugins;
@Injectable({
    providedIn: 'root'
})
export class PhotoService {

    public photos: PhotoInterface[] = [];

    constructor() {
    }

    public async addNewToGallery() {
        const capturePhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });
        const saveImageFile = await this.savePicture(capturePhoto);
        this.photos.unshift(saveImageFile);
    }

    private async savePicture(cameraPhoto: CameraPhoto): Promise<PhotoInterface> {
        const base64Data = await this.readyAsBase64(cameraPhoto);
        const fileName = new Date().getTime() + '.jpeg';
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: FilesystemDirectory.Data,
        });
        return {
            filePath: fileName,
            webviewPath: cameraPhoto.webPath,
        }
    }

    private async readyAsBase64(cameraPhoto: CameraPhoto): Promise<string> {
        const response = await fetch(cameraPhoto.webPath);
        const blob = await response.blob();
        return await this.convertBlobToBase64(blob) as string;
    }

    convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        }
        reader.readAsDataURL(blob);
    });

}
