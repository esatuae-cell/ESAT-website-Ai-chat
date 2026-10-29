import { TestBed } from '@angular/core/testing';

import { TawkChat } from './tawk-chat';

describe('TawkChat', () => {
  let service: TawkChat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TawkChat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
