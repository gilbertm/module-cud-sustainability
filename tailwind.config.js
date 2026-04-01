module.exports = {
  content: [
    "./templates/**/*.twig",
    "./src/**/*.php",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
