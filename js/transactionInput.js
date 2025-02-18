import {
  DEFAULT_AMOUNT,
  CURRENCIES,
  BRIDGING_FEE,
} from "../utils/constants.js";

// Function to get query parameter value from the URL
function getQueryParam(param) {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sendingAmount").textContent = getQueryParam("send");
  document.getElementById("receivingAmount").textContent =
    getQueryParam("receive");

  if (getQueryParam("send").split(" ")[1] === CURRENCIES.ZCASH.symbol) {
    document.getElementById("fromNetwork").innerHTML = `
        <img src="./img/zcash.svg" class="icon-coin-md" />
          <span>Zcash Network</span>
      `;
    document.getElementById("toNetwork").innerHTML = `
        <img src="./img/avax.svg" class="icon-coin-md" />
          <span>Avalanche Network</span>
      `;
  } else {
    document.getElementById("fromNetwork").innerHTML = `
      <img src="./img/avax.svg" class="icon-coin-md" />
        <span>Avalanche Network</span>
    `;
    document.getElementById("toNetwork").innerHTML = `
      <img src="./img/zcash.svg" class="icon-coin-md" />
        <span>Zcash Network</span>
    `;
  }
});
