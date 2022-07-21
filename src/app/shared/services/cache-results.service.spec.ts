import { TestBed } from '@angular/core/testing';

import { CacheResultsService } from './cache-results.service';

describe('CacheResultsService', () => {
  let service: CacheResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
