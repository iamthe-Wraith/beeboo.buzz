import { HASH_SALT_ROUNDS } from '$lib/constants/auth';
import { HttpStatus } from '$lib/constants/error';
import { ApiError } from '$lib/utils/api-error';
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
              const error = new ApiError('An error occurred while processing password.', HttpStatus.INTERNAL_SERVER_ERROR);
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
          const error = new ApiError('An error occurred while validating password.', HttpStatus.INTERNAL_SERVER_ERROR);
          reject(error);
        } else {
          if (authenticated) {
            resolve();
          } else {
            reject(new ApiError('Invalid email or password.', HttpStatus.AUTHENTICATION));
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
