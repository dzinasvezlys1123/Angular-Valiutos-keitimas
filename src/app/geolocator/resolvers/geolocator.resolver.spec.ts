import { TestBed } from '@angular/core/testing';

import { GeolocatorResolver } from './geolocator.resolver';

describe('GeolocatorResolver', () => {
  let resolver: GeolocatorResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GeolocatorResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
