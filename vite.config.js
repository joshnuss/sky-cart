import { sveltekit } from '@sveltejs/kit/vite'
import path from 'path'

const config = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $config: path.resolve(__dirname, 'config.js'),
    }
  }
}

export default config
