import { mergeConfig, defineConfig } from 'vite';
import viteConfig from './vite.config';
import path from 'path';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      setupFiles: './test/setup.js'
    },
    resolve: {
      alias: {
        $routes: path.resolve(__dirname, 'src/routes')
      }
    }
  })
);
