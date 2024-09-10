import { TestBed } from '@angular/core/testing';

import { FindSecondUserOfRoomService } from './find-second-user-of-room.service';

describe('FindSecondUserOfRoomService', () => {
  let service: FindSecondUserOfRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindSecondUserOfRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
