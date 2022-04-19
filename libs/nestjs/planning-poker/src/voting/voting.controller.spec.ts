import { Test, TestingModule } from '@nestjs/testing';
import { VotingController } from './voting.controller';

describe('VotingController', () => {
  let controller: VotingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotingController],
    }).compile();

    controller = module.get<VotingController>(VotingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be', () => {
    expect.assertions(1);

    controller.vote({ name: 'player1', score: 1 });
    controller.getResult().then((x) => expect(x).toStrictEqual([5, 2]));
    controller.vote({ name: 'player2', score: 2 });
    controller.vote({ name: 'player1', score: 5 });
    controller.finish();
  });
});
