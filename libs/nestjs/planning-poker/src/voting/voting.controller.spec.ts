import { calculateEtag } from '@planning-poker/shared/backend-api-client';
import { HttpException, HttpCode, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DatastoreService } from '../datastore/datastore.service';
import { VotingController } from './voting.controller';

describe('VotingController', () => {
  let controller: VotingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotingController],
      providers: [DatastoreService],
    }).compile();

    controller = module.get<VotingController>(VotingController);
  });

  afterEach(() => console.log('END'));

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 409 (conflict) error code when voting is not started', async () => {
    expect.assertions(2);
    try {
      await controller.getResult({});
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      const ex: HttpException = e;
      expect(ex.getStatus()).toBe(409);
    }
  });

  test('should return info about voting', async () => {
    controller.startNew({ name: 'voting' });

    expect(await controller.getResult({})).toMatchObject({
      gameName: 'voting',
      players: [],
    });
  });

  test('should return info about voting when someone has voted', () => {
    controller.startNew({ name: 'voting' });
    controller.vote({ player: '2', score: 10 });

    return expect(controller.getResult({})).resolves.toMatchObject({
      gameName: 'voting',
      players: [{ player: '2', score: 10 }],
    });
  });

  test('should be suspended until new vote', async () => {
    controller.startNew({ name: 'voting123' });
    controller.vote({ player: 'p1', score: undefined });

    const p = expect(
      controller.getResult({
        etag: calculateEtag({
          gameName: 'voting123',
          players: [{ player: 'p1', score: undefined }],
        }),
      })
    ).resolves.toMatchObject({
      gameName: 'voting123',
      players: [{ player: 'p1', score: 10 }],
    });

    controller.vote({ player: 'p1', score: 10 });
    await p;
  });

  test('should be suspended until start of new voting', async () => {
    controller.startNew({ name: 'voting123' });
    controller.vote({ player: 'p1', score: undefined });

    const p = expect(
      controller.getResult({
        etag: calculateEtag({
          gameName: 'voting123',
          players: [{ player: 'p1', score: undefined }],
        }),
      })
    ).resolves.toMatchObject({
      gameName: 'voting2',
      players: [],
    });

    controller.startNew({ name: 'voting2' });
    await p;
  });
});
