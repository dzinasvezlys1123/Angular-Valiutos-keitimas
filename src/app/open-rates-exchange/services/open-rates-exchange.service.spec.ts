import { TestBed } from '@angular/core/testing';

import { OpenRatesExchangeService } from './open-rates-exchange.service';

describe('OpenRatesExchangeService', () => {
  let service: OpenRatesExchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenRatesExchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
