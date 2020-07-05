import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertErrorPage } from './alert-error.page';

describe('AlertErrorPage', () => {
  let component: AlertErrorPage;
  let fixture: ComponentFixture<AlertErrorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertErrorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
