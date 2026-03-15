import { mergeConfig } from 'vite';

export default (config) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  });
};


