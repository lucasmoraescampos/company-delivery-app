import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddComplementPage } from './add-complement.page';

describe('AddComplementPage', () => {
  let component: AddComplementPage;
  let fixture: ComponentFixture<AddComplementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddComplementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddComplementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
