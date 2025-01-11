import { TestBed } from '@angular/core/testing';

import { ItenerarysService } from './itenerarys.service';

describe('ItenerarysService', () => {
  let service: ItenerarysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItenerarysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
