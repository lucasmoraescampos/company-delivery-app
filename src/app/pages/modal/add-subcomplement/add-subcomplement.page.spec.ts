import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSubcomplementPage } from './add-subcomplement.page';

describe('AddSubcomplementPage', () => {
  let component: AddSubcomplementPage;
  let fixture: ComponentFixture<AddSubcomplementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubcomplementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSubcomplementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
