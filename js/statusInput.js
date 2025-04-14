import {
  DEFAULT_AMOUNT,
  CURRENCIES,
  BRIDGING_FEE,
} from "../utils/constants.js";

import {
  getCurrentTheme,
  getNextThemes,
  updateThemeTooltip,
  setTheme
} from './themeManager.js';

// Function to get query parameter value from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const sentAmount = getQueryParam("send");
  const receivedAmount = getQueryParam("receive");
  const sendingNetwork = sentAmount?.split(" ")[1];
  const currentTheme = getCurrentTheme();

  if (sendingNetwork === CURRENCIES.ZCASH.symbol) {
    document.getElementById("fromNetwork").innerHTML = `
          <img src="./img/${CURRENCIES.ZCASH.getIcon(currentTheme)}" class="icon-coin-md" />
          <span>Zcash Network</span>
        `;
    document.getElementById("toNetwork").innerHTML = `
          <img src="./img/${CURRENCIES.AVALANCHE.getIcon(currentTheme)}" class="icon-coin-md" />
          <span>Avalanche Network</span>
        `;
  } else {
    document.getElementById("toNetwork").innerHTML = `
        <img src="./img/${CURRENCIES.ZCASH.getIcon(currentTheme)}" class="icon-coin-md" />
        <span>Zcash Network</span>
      `;
    document.getElementById("fromNetwork").innerHTML = `
        <img src="./img/${CURRENCIES.AVALANCHE.getIcon(currentTheme)}" class="icon-coin-md" />
        <span>Avalanche Network</span>
        `;
  }

  document.getElementById("sentAmount").textContent = sentAmount;
  document.getElementById("receivedAmount").textContent = receivedAmount;
  document.getElementById(
    "receivedMessage"
  ).textContent = `You have successfully received ${receivedAmount}!`;
});
