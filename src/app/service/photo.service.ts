import {Injectable} from '@angular/core';
import {CameraPhoto, CameraResultType, CameraSource, Capacitor, FilesystemDirectory, Plugins} from "@capacitor/core";
import {PhotoInterface} from "../interface/photo.interface";
import {Platform} from "@ionic/angular";

const {Camera, Filesystem, Storage} = Plugins;
@Injectable({
    providedIn: 'root'
})
export class PhotoService {

    public photos: PhotoInterface[] = [];
    private PHOTO_STORAGE: string = 'photos';

    constructor(
        private platform: Platform,
    ) {
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
            value: this.platform.is("hybrid")
                ? JSON.stringify(this.photos)
                : JSON.stringify(this.photos.map(p => {
                const photoCopy = {...p};
                delete photoCopy.base64;
                return photoCopy;
            })),
        })
    }

    public async loadSaved() {
        const photos = await Storage.get({key: this.PHOTO_STORAGE});
        this.photos = JSON.parse(photos.value) || [];
        if (!this.platform.is("hybrid")) {

            for (let photo of this.photos) {
                const readFile = await Filesystem.readFile({
                    path: photo.filePath,
                    directory: FilesystemDirectory.Data,
                });
                photo.base64 = `data:image/jpeg;base64,${readFile.data}`;
            }
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
        if (this.platform.is("hybrid")) {
            return {
                filePath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
            };
        } else {
            return {
                filePath: fileName,
                webviewPath: cameraPhoto.webPath,
            }
        }

    }

    private async readyAsBase64(cameraPhoto: CameraPhoto): Promise<string> {
        if (this.platform.is("hybrid")) {
            const file = await Filesystem.readFile({
                path: cameraPhoto.path,
            });
            return file.data;
        } else {
            const response = await fetch(cameraPhoto.webPath);
            const blob = await response.blob();
            return await this.convertBlobToBase64(blob) as string;
        }
    }

    convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        }
        reader.readAsDataURL(blob);
    });

    public async deletePictrue(photo: PhotoInterface, position: number) {
        this.photos.splice(position, 1);
        Storage.set({
            key: this.PHOTO_STORAGE,
            value: JSON.stringify(this.photos),
        });
        const fileName = photo.filePath.substr(photo.filePath.lastIndexOf('/') + 1);
        await Filesystem.deleteFile({
            path: fileName,
            directory: FilesystemDirectory.Data,
        });
    }

}
