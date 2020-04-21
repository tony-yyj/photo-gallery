import {Component, OnInit} from '@angular/core';
import {PhotoService} from "../service/photo.service";
import {ActionSheetController} from "@ionic/angular";

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

    constructor(
        public photoService: PhotoService,
        private actionSheetController: ActionSheetController,
    ) {
    }

    ngOnInit(): void {
        this.photoService.loadSaved();
    }

    public async showActionSheet(photo, position) {
        const actionSheet = await this.actionSheetController.create({
            header: 'photos',
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.photoService.deletePictrue(photo, position);
                    },
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'close',
                    handler: () => {
                        console.log('cancel');
                    }
                }
            ],
        });
        await actionSheet.present();
    }

}
