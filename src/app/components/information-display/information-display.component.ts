import { Component, Input } from '@angular/core';
import { DisplayType } from '../../enums/displayType';
import { DisplayDataWrapper } from '../../models/displayDataWrapper';

@Component({
  selector: 'app-information-display',
  templateUrl: './information-display.component.html',
  styleUrl: './information-display.component.css'
})
export class InformationDisplayComponent {
  @Input() data: DisplayDataWrapper | undefined;

  displayTypeEnum = DisplayType;
}
