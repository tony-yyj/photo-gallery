import {Injectable} from '@angular/core';
import {CameraPhoto, CameraResultType, CameraSource, FilesystemDirectory, Plugins} from "@capacitor/core";
import {PhotoInterface} from "../interface/photo.interface";

const {Camera, Filesystem, Storage} = Plugins;
@Injectable({
    providedIn: 'root'
})
export class PhotoService {

    public photos: PhotoInterface[] = [];
    private PHOTO_STORAGE: string = 'photos';

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
        Storage.set({
            key: this.PHOTO_STORAGE,
            value: JSON.stringify(this.photos.map(p => {
                const photoCopy = {...p};
                delete photoCopy.base64;
                return photoCopy;
            }))
        })
    }

    public async loadSaved() {
        const photos = await Storage.get({key: this.PHOTO_STORAGE});
        this.photos = JSON.parse(photos.value) || [];
        for (let photo of this.photos) {
            const readFile = await Filesystem.readFile({
                path: photo.filePath,
                directory: FilesystemDirectory.Data,
            });
            console.log(readFile.data);
            photo.base64 = `data:image/jpeg;base64,${readFile.data}`;
        }
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
