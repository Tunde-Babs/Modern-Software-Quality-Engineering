import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://msqe.dev',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
