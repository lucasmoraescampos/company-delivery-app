import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeliverySettingsPage } from './delivery-settings.page';

describe('DeliverySettingsPage', () => {
  let component: DeliverySettingsPage;
  let fixture: ComponentFixture<DeliverySettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverySettingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeliverySettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
