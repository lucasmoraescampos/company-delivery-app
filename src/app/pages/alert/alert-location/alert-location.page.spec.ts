import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertLocationPage } from './alert-location.page';

describe('AlertLocationPage', () => {
  let component: AlertLocationPage;
  let fixture: ComponentFixture<AlertLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertLocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
