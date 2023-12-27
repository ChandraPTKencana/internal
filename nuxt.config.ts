// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';
export default defineNuxtConfig({
  // rootDir : "",
  app:{
    baseURL:process.env.MY_NODE_ENV === 'production' ? '/stok' : '/stok/dist',
  },
  ssr: true,
  devtools: { enabled: true },
  alias: {
    '@': resolve(__dirname, '/'),
  },
  css: [
    '~/assets/main.scss'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },
  modules: [
    // ...
    '@pinia/nuxt',
  ],
  nitro: {
    routeRules: {
      "/api/**": { proxy: 'http://127.0.0.1:8000/api/internal/**' }
      // '/proxy/example': { proxy: 'http://39.98.58.238:8594' },
      // "/proxy/**": { proxy: '/api/**' },
    }
  },
  // proxy: {
  //   '/api/': {
  //     target: process.env.API_URL,
  //     pathRewrite: { '^/api/': '/' },
  //     // changeOrigin:true 
  //   }
  // },
})
