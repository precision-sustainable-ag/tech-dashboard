import { fetchGrowerByLastName, format_AM_PM, statesHash, ucFirst } from './constants';

describe('ucFirst Function', () => {
  test('Function exists', () => {
    expect(ucFirst).toBeDefined();
  });

  test('Function capitalizes strings', () => {
    expect(ucFirst('hello world')).toEqual('Hello world');
    expect(ucFirst('do3s !t work?')).toEqual('Do3s !t work?');
    expect(ucFirst('Auburn Farms LLC')).toEqual('Auburn Farms LLC');
  });

  test('Returns empty string for no parameters', () => {
    expect(ucFirst()).toEqual('');
  });

  test('Handles non strings', () => {
    expect(ucFirst(3)).toEqual(3);
  });

  test('Handles Regex', () => {
    expect(ucFirst(/[^\w]/g)).toEqual(/[^\w]/g);
  });
});

describe('format_AM_PM Function', () => {
  test('Function exists', () => {
    expect(format_AM_PM).toBeDefined();
  });

  test('Accepts Date', () => {
    expect(format_AM_PM(new Date('2020-02-23 12:00:00'))).toEqual('12:00 PM');
  });
  test('Gracefully return other params', () => {
    expect(format_AM_PM('test')).toEqual('test');
  });
});

describe('statesHash Object', () => {
  test('Object exists', () => {
    expect(statesHash).toBeInstanceOf(Object);
  });
  test('Integrity check', () => {
    expect(statesHash.AK).toEqual('Alaska');
  });
});

describe('Fetch growers by last name', () => {
  test('Function exists', () => {
    expect(fetchGrowerByLastName).toBeDefined();
  });
});
