import { TestBed } from '@angular/core/testing';

import { GetCurrenciesResolver } from './get-currencies.resolver';

describe('GetCurrenciesResolver', () => {
  let resolver: GetCurrenciesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GetCurrenciesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
