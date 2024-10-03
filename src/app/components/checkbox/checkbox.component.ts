import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({selector:'checkbox',template:`<div class="cb">
    <input [checked]="checked" type="checkbox" id="customCheckbox" (change)="onCheckedChange($event.target)" >
    <label for="customCheckbox">{{text}}</label>
  </div>`,standalone: true, styleUrls:['./checkbox.component.scss']})
export class CheckboxComponent{
    @Input() public checked = false;
    @Input() public text =''
    @Output() checkedChange = new EventEmitter<boolean>();

    onCheckedChange(event$: any) {
        this.checked = !this.checked
        this.checkedChange.emit(this.checked); 
    }
}