import { sha1 } from 'object-hash';
import { GetResultSuccessDto } from '../schemas';

export const calculateEtag = (voting: GetResultSuccessDto) => {
  return sha1({
    ...voting,
  });
};
