import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

const { secret } = authConfig;

export default function generateToken(params = {}) {
  return jwt.sign({ params }, secret, {
    expiresIn: 86400,
  });
}
