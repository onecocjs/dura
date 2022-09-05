import { shallowEqual } from './shallowEqual';

it('should to be defined shallowEqual', () => {
  expect(shallowEqual).toBeDefined();
});

it('should to be false if args is two functional', () => {
  const noopFn = () => () => {};
  expect(shallowEqual(noopFn(), noopFn())).toBeFalsy();
});

it('should to be false if args is two deep object', () => {
  const getObj = () => ({
    a: {},
    b: {
      name: 'xx',
    },
  });
  expect(shallowEqual(getObj(), getObj())).toBeFalsy();
});

it('should to be true if args is flat object', () => {
  const getObj = () => ({
    a: 12,
    b: 'zs',
  });
  expect(shallowEqual(getObj(), getObj())).toBeTruthy();
});

it('should to be true if args is some one object', () => {
  const obj = {
    a: 12,
    b: 'zs',
  };
  expect(shallowEqual(obj, obj)).toBeTruthy();
});

it('should to be false if args flat keys is diff', () => {
  expect(shallowEqual({ a: 12 }, { a: 12, b: 'xx' })).toBeFalsy();
});
