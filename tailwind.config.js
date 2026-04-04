module.exports = {
  content: [
    "./templates/**/*.twig",
    "./templates/**/*.html",
    "./src/**/*.php",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
