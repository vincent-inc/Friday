import { Component, Input, SimpleChanges, forwardRef } from '@angular/core';
import { MatFormFieldComponent } from '../mat-form-field/mat-form-field.component';
import { MatFromFieldInputDynamicItem, MatItemSetting, MatItemSettingType, MatOption } from '../../model/Mat.model';

@Component({
  selector: 'app-mat-form-field-input-dynamic',
  templateUrl: './mat-form-field-input-dynamic.component.html',
  styleUrls: ['./mat-form-field-input-dynamic.component.scss'],
  providers: [{ provide: MatFormFieldComponent, useExisting: forwardRef(() => MatFormFieldInputDynamicComponent) }],
})
export class MatFormFieldInputDynamicComponent extends MatFormFieldComponent {

  @Input()
  isPassword: boolean = false;

  @Input()
  isEmail: boolean = false;

  // mat option
  options: MatOption[] = [
    {
      value: true,
      valueLabel: "TRUE"
    },
    {
      value: false,
      valueLabel: "FALSE"
    }
  ];

  //dynamic type
  @Input()
  blankObject?: any;

  @Input()
  objectLabel?: string;

  items: MatFromFieldInputDynamicItem[] = [];

  constructor() {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    this.init();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  init() {
    if(this.isValueObject() && this.blankObject && !this.isValueArray())
      this.parseItems();
  }

  //dynamic object
  parseItems () {
    this.items = [];
    let defaultIndex = 100;
    for (const [key, value] of Object.entries(this.value)) {
      this.items.push(new MatFromFieldInputDynamicItem(this.value, this.blankObject[key], key, value, this.getSetting(key), this.getIndex(key, defaultIndex)));
      defaultIndex++;
    }
    this.items = this.items.sort((a, b) => a.index! - b.index!);
  }

  private getIndex(key: string, defaultIndex: number): number {
    let prototype = Object.getPrototypeOf(this.blankObject!);
    let name = key + MatItemSettingType.INDEX.toString();
    if (Object.hasOwn(prototype, name))
      return prototype[name];
    else
      return defaultIndex;
  }

  private getSetting(key: string): MatItemSetting[] {
    let prototype = Object.getPrototypeOf(this.blankObject!);
    let settings: MatItemSetting[] = [];
    let name = key + MatItemSettingType.DISABLE.toString();
    if (Object.hasOwn(prototype, name) && !!prototype[name]) {
      settings.push(new MatItemSetting(MatItemSettingType.DISABLE));
    }

    name = key + MatItemSettingType.REQUIRE.toString();
    if (Object.hasOwn(prototype, name) && !!prototype[name]) {
      settings.push(new MatItemSetting(MatItemSettingType.REQUIRE));
    }

    return settings;
  }
}