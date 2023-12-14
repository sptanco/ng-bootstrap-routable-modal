import { TestBed } from '@angular/core/testing';

import { RoutableModalService } from './routable-modal.service';

describe('RoutableModalService', () => {
  let service: RoutableModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutableModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
