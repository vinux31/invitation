import { createGalleryState } from '../js/gallery.js';

describe('Gallery state', () => {
  const photos = ['a.jpg', 'b.jpg', 'c.jpg'];
  let state;
  beforeEach(() => { state = createGalleryState(photos); });

  test('opens lightbox at correct index', () => {
    state.open(1);
    expect(state.isOpen()).toBe(true);
    expect(state.current()).toBe(1);
  });

  test('next() wraps around to 0 from last', () => {
    state.open(2);
    state.next();
    expect(state.current()).toBe(0);
  });

  test('prev() wraps around to last from 0', () => {
    state.open(0);
    state.prev();
    expect(state.current()).toBe(2);
  });

  test('close() marks lightbox as closed', () => {
    state.open(0);
    state.close();
    expect(state.isOpen()).toBe(false);
  });

  test('currentPhoto() returns correct path', () => {
    state.open(1);
    expect(state.currentPhoto()).toBe('b.jpg');
  });
});
