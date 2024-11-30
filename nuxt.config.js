export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      title: 'Simple Isometric Game',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      script: [
        { 
          src: '/js/band.min.js',
          defer: false,
          async: false,
          body: true
        }
      ]
    }
  }
}) 