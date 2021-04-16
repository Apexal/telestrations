/*
  Manages the color of the game's background.
*/

/* Generate color as array */
const getColorCombo = () => {
  return [360 * Math.random(), 50 + 50 * Math.random(), 80 + 15 * Math.random()]
}

/* Generate CSS color based off of array */
const getColor = (cc) => {
  return 'hsl(' + cc[0] + ',' +
  cc[1] + '%,' +
  cc[2] + '%)'
}

export default function configureBackgroundColors() {
  const cc = getColorCombo()
  document.body.style.backgroundColor = getColor(cc)
};