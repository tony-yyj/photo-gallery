import {Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({
    selector: '[passwordToggle]',
})
export class PasswordToggleDirective {
    @Input('appTargetInput') targetInput: HTMLInputElement;

    @HostListener('click') onMouseEnter() {
        const inType = (this.targetInput.type === 'text') ? 'password' : 'text';
        this.targetInput.type = inType;
    }

    constructor(
        private el: ElementRef,
    ) {
    }

}
