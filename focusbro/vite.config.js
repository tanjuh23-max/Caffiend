import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), viteSingleFile()],
    build: {
      target: 'esnext',
      assetsInlineLimit: 100000000,
      cssCodeSplit: false,
    },
    define: {
      // Expose only VITE_ prefixed vars to the client bundle
      __STRIPE_PK__:        JSON.stringify(env.VITE_STRIPE_PUBLISHABLE_KEY || ''),
      __STRIPE_YEARLY__:    JSON.stringify(env.VITE_STRIPE_LINK_YEARLY     || ''),
      __STRIPE_MONTHLY__:   JSON.stringify(env.VITE_STRIPE_LINK_MONTHLY    || ''),
      __STRIPE_WEEKLY__:    JSON.stringify(env.VITE_STRIPE_LINK_WEEKLY     || ''),
      __SUPABASE_URL__:     JSON.stringify(env.VITE_SUPABASE_URL           || ''),
      __SUPABASE_ANON_KEY__:JSON.stringify(env.VITE_SUPABASE_ANON_KEY      || ''),
    },
  };
});
