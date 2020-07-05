import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeSubcomplementPage } from './change-subcomplement.page';

describe('ChangeSubcomplementPage', () => {
  let component: ChangeSubcomplementPage;
  let fixture: ComponentFixture<ChangeSubcomplementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeSubcomplementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeSubcomplementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
