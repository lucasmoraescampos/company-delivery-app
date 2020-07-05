import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SessionHelpPage } from './session-help.page';

describe('SessionHelpPage', () => {
  let component: SessionHelpPage;
  let fixture: ComponentFixture<SessionHelpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionHelpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SessionHelpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
