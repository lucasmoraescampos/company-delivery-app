import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertSuccessPage } from './alert-success.page';

describe('AlertSuccessPage', () => {
  let component: AlertSuccessPage;
  let fixture: ComponentFixture<AlertSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertSuccessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
