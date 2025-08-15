// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',  // Choose the output mode for your project
  integrations: [
    react()  // Integrating React into Astro
  ],
  adapter: vercel({
    edgeMiddleware: true,  // Enabling edge middleware for Vercel
  }),
});