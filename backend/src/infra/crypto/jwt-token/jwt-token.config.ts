export const JWT_TOKEN_CONFIG = {
  SECRET: 'JWT_SECRET',
  EXPIRES_IN: 'JWT_EXPIRES_IN',
  REFRESH_EXPIRES_IN: 'JWT_REFRESH_EXPIRES_IN',
};

export const jwtTokenConfig = () => ({
  [JWT_TOKEN_CONFIG.SECRET]: process.env.JWT_SECRET || 'default_jwt_secret',
  [JWT_TOKEN_CONFIG.EXPIRES_IN]: process.env.JWT_EXPIRES_IN || '1h',
  [JWT_TOKEN_CONFIG.REFRESH_EXPIRES_IN]:
    process.env.JWT_REFRESH_EXPIRES_IN || '7d',
});
