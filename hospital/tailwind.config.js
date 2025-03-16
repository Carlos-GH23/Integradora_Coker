/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Asegúrate de que esta ruta es correcta para tus archivos
  ],
  theme: {
    extend: {
      colors: {
        'nurse-color': '#99CCFF',  // Asegúrate de que el color tenga el prefijo '#' para ser un valor hexadecimal válido
      },
    },
  },
  plugins: [],
}
