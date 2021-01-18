import { $MODULE_NAME } from './$MODULE_NAME';

describe('Test the $MODULE_NAME.', () => {
  test('Test the example method response to undefined.', () => {
    const resp = $MODULE_NAME.example();
    expect(resp).toBe(undefined);
  });
})
