import { ObjectModule } from './ObjectModule';

const user = {
  lastName: 'hanetsuki',
  firstName: 'touka',
  berthDay: '1995-04-10',
  age: 25
};

describe('Test the ObjectModule.', () => {
  test('Test the accessByBracket method response to select the firstName from user.', () => {
    const resp = ObjectModule.accessByBracket(user, 'firstName');
    expect(resp).toBe('touka');
  });

  test('Test the pick method response to select the firstName and lastName from user.', () => {
    const resp = ObjectModule.pick(user, 'firstName', 'lastName');
    expect(resp).toEqual({ lastName: 'hanetsuki', firstName: 'touka' });
  });

  test('Test the omit method response to exclude the firstName and lastName from user.', () => {
    const resp = ObjectModule.omit(user, 'firstName', 'lastName');
    expect(resp).toEqual({ berthDay: '1995-04-10', age: 25 });
  });
})