// tailwind.config.js (özet)
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#e30613', // Kırmızı ana renk
        secondary: '#161616', // Örneğin koyu gri ikincil renk
        background: '#f5f5f5' // Açık gri arkaplan örneği
      },
      borderRadius: {
        'lg': '0.5rem' // 8px, MUI tema ile tutarlı (isteğe bağlı)
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms') // Form elementleri için varsayılan stiller
  ]
}
