import { TestBed } from '@angular/core/testing';

import { MockedLoginService } from './mocked-login.service';

describe('LoginService', () => {
  let service: MockedLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockedLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
