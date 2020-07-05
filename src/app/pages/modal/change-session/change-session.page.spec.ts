import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeSessionPage } from './change-session.page';

describe('ChangeSessionPage', () => {
  let component: ChangeSessionPage;
  let fixture: ComponentFixture<ChangeSessionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeSessionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeSessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
