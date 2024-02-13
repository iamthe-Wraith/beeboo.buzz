import { HASH_SALT_ROUNDS } from '../constants/auth';
import { HttpStatus } from '../constants/error';
import { ApiError } from '../utils/api-error';
import bcrypt from 'bcrypt';

export const generatePasswordHash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (password) {
      bcrypt.genSalt(HASH_SALT_ROUNDS, (err: Error | undefined, salt: string) => {
        if (err) {
          reject(err);
        } else {
          bcrypt.hash(password, salt, (err: Error | undefined, hash: string) => {
            if (err) {
              const error = new ApiError('An error occurred while processing password.', HttpStatus.SERVER);
              reject(error);
            } else {
              resolve(hash);
            }
          });
        }
      });
    } else {
      reject(new ApiError('Password is required.', HttpStatus.INVALID_ARG, 'password'));
    }
  });
};

export const isValidPassword = (providedPassword: string, encryptedPassword: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (providedPassword && encryptedPassword) {
      bcrypt.compare(providedPassword, encryptedPassword, (err: Error | undefined, authenticated: boolean) => {
        if (err) {
          const error = new ApiError('An error occurred while validating password.', HttpStatus.SERVER);
          reject(error);
        } else {
          if (authenticated) {
            resolve();
          } else {
            reject(new ApiError('Invalid credentials.', HttpStatus.AUTHENTICATION));
          }
        }
      });
    } else if (!providedPassword) {
      reject(new ApiError('Password is required.', HttpStatus.INVALID_ARG, 'password'));
    } else {
      reject(new ApiError('Encrypted password is required.', HttpStatus.INVALID_ARG, 'encryptedPassword'));
    }
  });
}
