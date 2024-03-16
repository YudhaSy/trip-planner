import { Component, Input } from '@angular/core';
import { DisplayType } from '../../enums/displayType';
import { DisplayData } from '../../models/displayData';

@Component({
  selector: 'app-information-display',
  templateUrl: './information-display.component.html',
  styleUrl: './information-display.component.css'
})
export class InformationDisplayComponent {
  @Input() data: DisplayData | undefined;

  displayTypeEnum = DisplayType;
}
