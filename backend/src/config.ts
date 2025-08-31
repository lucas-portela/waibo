export const APP_CONFIG = {
  PORT: 'PORT',
};

export const appConfig = () => ({
  [APP_CONFIG.PORT]: process.env.PORT ? parseInt(process.env.PORT) : 3001,
});
