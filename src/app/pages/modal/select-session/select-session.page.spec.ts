import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectSessionPage } from './select-session.page';

describe('SelectSessionPage', () => {
  let component: SelectSessionPage;
  let fixture: ComponentFixture<SelectSessionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSessionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectSessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
