import { calculateEtag } from './voting-etag';
describe('etag', () => {
  test('should calculate hash', () => {
    const hash1 = calculateEtag({
      gameName: 'name',
      players: [
        { player: '1', score: 10 },
        { player: '2', score: 12 },
      ],
    });
    const hash2 = calculateEtag({
      gameName: 'name',
      players: [
        { player: '1', score: 14 },
        { player: '2', score: 12 },
      ],
    });

    expect(hash1).not.toEqual(hash2);
  });
});
