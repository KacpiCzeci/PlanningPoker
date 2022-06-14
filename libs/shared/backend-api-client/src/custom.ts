import customInstance from './custom-instance';
import { UserDTO } from './schemas';

export const authControllerGetProfile = (authToken: string) => {
  return customInstance<UserDTO>({
    url: `/api/auth/profile`,
    method: 'get',
    headers: { Authorization: `Bearer ${authToken}` },
  });
};
