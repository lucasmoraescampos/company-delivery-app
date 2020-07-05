import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeComplementPage } from './change-complement.page';

describe('ChangeComplementPage', () => {
  let component: ChangeComplementPage;
  let fixture: ComponentFixture<ChangeComplementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeComplementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeComplementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
