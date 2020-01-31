import { greet } from './index';

describe('index', () => {
  it('should not throw with a string', () => {
    expect(() => greet('anything')).not.toThrow();
  });
  it('should not throw with an empty string', () => {
    expect(() => greet('')).not.toThrow();
  });

  it('should return the correct greeting', () => {
    const name = 'testName';
    expect(greet(name)).toEqual('Hello testName!');
  });
});
