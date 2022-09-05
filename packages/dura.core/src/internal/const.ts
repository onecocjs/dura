export const __COMMIT__ = 'COMMIT.';

const randomString = () =>
  Math.random().toString(36).substring(7).split('').join('.');
export const RESTORE = `RESTORE.${randomString()}`;

export const ActionTypes = {
  REFRESH: `@@__AK__/REPLACE.${randomString()}`,
};
