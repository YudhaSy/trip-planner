import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-information-display',
  templateUrl: './information-display.component.html',
  styleUrl: './information-display.component.css'
})
export class InformationDisplayComponent {
  @Input() templateOutlet!: TemplateRef<any>;
  @Input() errorMsg!: string;
  @Input() fetchingData!: boolean;  
}
