// Import constants
import {
  DEFAULT_AMOUNT,
  CURRENCIES,
  BRIDGING_FEE,
} from "../utils/constants.js";

let currentTheme = localStorage.getItem("theme") || "red";


// Function to set the state of the continue button (disabled or enabled)
function setContinueButtonState(isDisabled) {
  const continueButton = document.getElementById("continueButton");
  continueButton.disabled = isDisabled;
  continueButton.style.opacity = isDisabled ? "40%" : "100%";
  continueButton.style.cursor = isDisabled ? "not-allowed" : "pointer";
}

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
    currencyName: document.getElementsByClassName("currency-name"),
    availableBalanceAmount: document.querySelector("#availableBalanceAmount"),
    availableBalanceText: document.querySelector("#availableBalanceText"),
    receiveAmountNode: document.getElementById("receiveAmount"),
    sendAmountNode: document.getElementById("sendAmount"),
    availableZcash: sessionStorage.getItem("AvailableZcash")
      ? sessionStorage.getItem("AvailableZcash")
      : CURRENCIES.ZCASH.balance,
    availableAvalanche: sessionStorage.getItem("AvailableAvalanche")
      ? sessionStorage.getItem("AvailableAvalanche")
      : CURRENCIES.AVALANCHE.balance,
  };

  // Toggle dropdown visibility
  trigger.addEventListener("click", () => {
    select.classList.toggle("open");
    currentTheme = localStorage.getItem("theme") || "red";
  });

  // Function to update UI for currency selection
  function updateCurrencyUI(selectedCurrency, isFromOption) {
    const {
      fromCurrencyGroup,
      toCurrencyGroup,
      fromAmountIcon,
      fromCurrencyName,
      toAmountIcon,
      toCurrencyName,
      currencyName,
      availableBalanceAmount,
      availableBalanceText,
      receiveAmountNode,
      sendAmountNode,
    } = elements;

    const isZcash = selectedCurrency === CURRENCIES.ZCASH.name;
    const selectedCurrencyDetails = isZcash
      ? CURRENCIES.ZCASH
      : CURRENCIES.AVALANCHE;
    const oppositeCurrencyDetails = isZcash
      ? CURRENCIES.AVALANCHE
      : CURRENCIES.ZCASH;

    // Set selected currency UI
    if (isFromOption) {
      fromCurrencyGroup.innerHTML = createCurrencyHTML(selectedCurrencyDetails);
      toCurrencyGroup.innerHTML = createCurrencyHTML(oppositeCurrencyDetails);
      fromAmountIcon.src = createIconHTML(selectedCurrencyDetails.getIcon(currentTheme));
      toAmountIcon.src = createIconHTML(oppositeCurrencyDetails.getIcon(currentTheme));
      fromCurrencyName.textContent = selectedCurrencyDetails.symbol;
      toCurrencyName.textContent = oppositeCurrencyDetails.symbol;
      availableBalanceAmount.textContent =
        selectedCurrencyDetails.symbol === CURRENCIES.ZCASH.symbol
          ? parseFloat(elements.availableZcash).toFixed(4)
          : parseFloat(elements.availableAvalanche).toFixed(4);
      availableBalanceText.textContent = selectedCurrencyDetails.symbol;
    } else {
      toCurrencyGroup.innerHTML = createCurrencyHTML(selectedCurrencyDetails);
      fromCurrencyGroup.innerHTML = createCurrencyHTML(oppositeCurrencyDetails);
      fromAmountIcon.src = createIconHTML(oppositeCurrencyDetails.getIcon(currentTheme));
      toAmountIcon.src = createIconHTML(selectedCurrencyDetails.getIcon(currentTheme));
      fromCurrencyName.textContent = oppositeCurrencyDetails.symbol;
      toCurrencyName.textContent = selectedCurrencyDetails.symbol;
      availableBalanceAmount.textContent =
        oppositeCurrencyDetails.symbol === CURRENCIES.ZCASH.symbol
          ? parseFloat(elements.availableZcash).toFixed(4)
          : parseFloat(elements.availableAvalanche).toFixed(4);
      availableBalanceText.textContent = oppositeCurrencyDetails.symbol;
    }

    // Change currency name colors to active state when input is not empty
    elements.currencyName[0].style.color = "#6e6e6e";
    elements.currencyName[1].style.color = "#6e6e6e";

    if (parseFloat(availableBalanceAmount.textContent) === 0) {
      setContinueButtonState(true);
    } else if (
      parseFloat(elements.sendAmountNode.value) >
      parseFloat(availableBalanceAmount.textContent)
    ) {
      setContinueButtonState(true);
    } else {
      setContinueButtonState(false);
    }

    sendAmountNode.value = DEFAULT_AMOUNT.toFixed(4);
    receiveAmountNode.value = (DEFAULT_AMOUNT - BRIDGING_FEE).toFixed(4);
  }

  // Create HTML for currency display
  function createCurrencyHTML(currency) {
    return `
      <img src="./img/${currency.getIcon(currentTheme)}" class="icon-coin-sm currency-icon-circle" />
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
