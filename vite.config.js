import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

const page = (p) => fileURLToPath(new URL(p, import.meta.url))

// Static multi-page site (no framework). Each route is a real HTML file so the
// landing page and the legal/support pages build and deploy as plain files.
export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        privacyArcheum: page('./privacy/archeum/index.html'),
        privacySocial: page('./privacy/social/index.html'),
        deleteAccount: page('./delete-account/index.html'),
        deleteData: page('./delete-data/index.html'),
        aiHelp: page('./ai-help/index.html'),
      },
    },
  },
})
