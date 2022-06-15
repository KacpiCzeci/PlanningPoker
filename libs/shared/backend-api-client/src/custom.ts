import customInstance from './custom-instance';
import { PlayerDto, RestartRequest, UserDTO } from './schemas';

export const authControllerGetProfile = (authToken: string) => {
  return customInstance<UserDTO>({
    url: `/api/auth/profile`,
    method: 'get',
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const votingControllerStartNew = (
  roomID: string,
  restartRequest: RestartRequest,
  authToken: string
) => {
  return customInstance<void>({
    url: `/api/voting/${roomID}/startNew`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    data: restartRequest,
  });
};

export const votingControllerVote = (
  roomID: string,
  playerDto: PlayerDto,
  authToken: string
) => {
  return customInstance<void>({
    url: `/api/voting/${roomID}/vote`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    data: playerDto,
  });
};
