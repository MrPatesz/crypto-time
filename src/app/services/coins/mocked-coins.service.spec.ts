import { TestBed } from '@angular/core/testing';

import { MockedCoinsService } from './mocked-coins.service';

describe('CoinsService', () => {
  let service: MockedCoinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockedCoinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
