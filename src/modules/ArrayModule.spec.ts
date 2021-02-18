import { ArrayModule } from './ArrayModule';

const pets = [
  {
    id: 1,
    name: 'ポチ'
  },
  {
    id: 2,
    name: 'タマ'
  },
  {
    id: 3,
    name: '太郎'
  }
];

describe('Test the ArrayModule.', () => {
  test('Test the removeByIdFromArray method response to spliced.', () => {
    const _pets = pets.slice()
    const resp = ArrayModule.removeByIdFromArray(_pets, 2);
    expect(resp).toEqual({ id: 2, name: 'タマ' });
    expect(_pets).toEqual([{ id: 1, name: 'ポチ' }, { id: 3, name: '太郎' }]);
  });
})
