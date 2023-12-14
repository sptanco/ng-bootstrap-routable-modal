import { TestBed } from '@angular/core/testing';

import { RoutingInterceptorService } from './routing-interceptor.service';

describe('RoutingInterceptorService', () => {
  let service: RoutingInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutingInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
