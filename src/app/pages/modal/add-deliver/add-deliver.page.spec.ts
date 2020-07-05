import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddDeliverPage } from './add-deliver.page';

describe('AddDeliverPage', () => {
  let component: AddDeliverPage;
  let fixture: ComponentFixture<AddDeliverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDeliverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddDeliverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
