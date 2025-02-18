// Import constants
import { DEFAULT_AMOUNT, CURRENCIES, BRIDGING_FEE } from "../utils/constants.js";

// Update the dropdown
document.querySelectorAll(".custom-select").forEach((select) => {
  const trigger = select.querySelector(".custom-select-trigger");
  const fromOptions = select.querySelectorAll("#fromOptions");
  const toOptions = select.querySelectorAll("#toOptions");
  const nodeOptions = select.querySelectorAll("#nodeOptions");

  const elements = {
    fromCurrencyGroup: document.querySelector("#fromCurrencyGroup"),
    toCurrencyGroup: document.querySelector("#toCurrencyGroup"),
    fromAmountIcon: document.querySelector("#fromAmountIcon"),
    fromCurrencyName: document.querySelector("#fromCurrencyName"),
    toAmountIcon: document.querySelector("#toAmountIcon"),
    toCurrencyName: document.querySelector("#toCurrencyName"),
    availableBalanceAmount: document.querySelector("#availableBalanceAmount"),
    availableBalanceText: document.querySelector("#availableBalanceText"),
    receiveAmountNode: document.getElementById("receiveAmount"),
    sendAmountNode: document.getElementById("sendAmount"),
    availableZcash: sessionStorage.getItem("AvailableZcash") ? sessionStorage.getItem("AvailableZcash") : CURRENCIES.ZCASH.balance,
    availableAvalanche: sessionStorage.getItem("AvailableAvalanche") ? sessionStorage.getItem("AvailableAvalanche") : CURRENCIES.AVALANCHE.balance,
  };

  // Toggle dropdown visibility
  trigger.addEventListener("click", () => select.classList.toggle("open"));

  // Function to update UI for currency selection
  function updateCurrencyUI(selectedCurrency, isFromOption) {
    const { fromCurrencyGroup, toCurrencyGroup, fromAmountIcon, fromCurrencyName, 
            toAmountIcon, toCurrencyName, availableBalanceAmount, 
            availableBalanceText, receiveAmountNode, sendAmountNode } = elements;

    const isZcash = selectedCurrency === CURRENCIES.ZCASH.name;
    const selectedCurrencyDetails = isZcash ? CURRENCIES.ZCASH : CURRENCIES.AVALANCHE;
    const oppositeCurrencyDetails = isZcash ? CURRENCIES.AVALANCHE : CURRENCIES.ZCASH;

    // Set selected currency UI
    if (isFromOption) {
      fromCurrencyGroup.innerHTML = createCurrencyHTML(selectedCurrencyDetails);
      toCurrencyGroup.innerHTML = createCurrencyHTML(oppositeCurrencyDetails);
      fromAmountIcon.src = createIconHTML(selectedCurrencyDetails.icon);
      toAmountIcon.src = createIconHTML(oppositeCurrencyDetails.icon);
      fromCurrencyName.textContent = selectedCurrencyDetails.symbol;
      toCurrencyName.textContent = oppositeCurrencyDetails.symbol;
      availableBalanceAmount.textContent = selectedCurrencyDetails.symbol === CURRENCIES.ZCASH.symbol ? parseFloat(elements.availableZcash).toFixed(4) : parseFloat(elements.availableAvalanche).toFixed(4);
      availableBalanceText.textContent = selectedCurrencyDetails.symbol;
    } else {
      toCurrencyGroup.innerHTML = createCurrencyHTML(selectedCurrencyDetails);
      fromCurrencyGroup.innerHTML = createCurrencyHTML(oppositeCurrencyDetails);
      fromAmountIcon.src = createIconHTML(oppositeCurrencyDetails.icon);
      toAmountIcon.src = createIconHTML(selectedCurrencyDetails.icon);
      fromCurrencyName.textContent = oppositeCurrencyDetails.symbol;
      toCurrencyName.textContent = selectedCurrencyDetails.symbol;
      availableBalanceAmount.textContent = oppositeCurrencyDetails.symbol === CURRENCIES.ZCASH.symbol ? parseFloat(elements.availableZcash).toFixed(4) : parseFloat(elements.availableAvalanche).toFixed(4);
      availableBalanceText.textContent = oppositeCurrencyDetails.symbol;
    }
    
    sendAmountNode.value = DEFAULT_AMOUNT.toFixed(4);
    receiveAmountNode.value = (DEFAULT_AMOUNT - BRIDGING_FEE).toFixed(4);
  }

  // Create HTML for currency display
  function createCurrencyHTML(currency) {
    return `
      <img src="./img/${currency.icon}" class="icon-coin-sm currency-icon-circle" />
      ${currency.name}
    `;
  }

  function createIconHTML(icon) {
    return `./img/${icon}`;
  }

  // Event Listener for From Options
  fromOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      const selectedOption = e.target.closest("div");
      if (!selectedOption) return;

      const currencyName = selectedOption.textContent.trim();
      updateCurrencyUI(currencyName, true);
      select.classList.remove("open");
    });
  });

  // Event Listener for To Options
  toOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      const selectedOption = e.target.closest("div");
      if (!selectedOption) return;

      const currencyName = selectedOption.textContent.trim();
      updateCurrencyUI(currencyName, false);
      select.classList.remove("open");
    });
  });

  nodeOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
        let value = e.target.textContent.trim();
        if (window.innerWidth < 1200 && value.length >= 35) {
            value = `${value.slice(0, 6)}...${value.slice(-4)}`;
        }
        trigger.querySelector("span").textContent = value;
        select.classList.remove("open");
    });
});

  // Close dropdown if clicked outside
  document.addEventListener("click", (e) => {
    if (!select.contains(e.target)) {
      select.classList.remove("open");
    }
  });
});
