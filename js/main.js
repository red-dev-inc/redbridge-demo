// Import constants
import {
  DEFAULT_AMOUNT,
  CURRENCIES,
  BRIDGING_FEE,
} from "../utils/constants.js";

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  setTimeout(() => {
    updateInitialMaxBalance();
  }, 100);
});

// Function to attach event listeners to various UI elements
function setupEventListeners() {
  // Help buttons - Show help popup when clicked
  document
    .getElementById("mbHelpButton")
    ?.addEventListener("click", showHelpPopup);
  document
    .getElementById("dsHelpButton")
    ?.addEventListener("click", showHelpPopup);

  // Help popup close button - Hide help popup when clicked
  document
    .getElementById("helpPopupCloseButton")
    ?.addEventListener("click", hideHelpPopup);

  // Continue button - Redirect to transaction page when clicked
  document
    .getElementById("continueButton")
    ?.addEventListener("click", redirectToTransaction);

  // Swap currency buttons - Swap selected currencies when clicked
  document
    .getElementById("dsSwapButton")
    ?.addEventListener("click", swapCurrencies);
  document
    .getElementById("mbSwapButton")
    ?.addEventListener("click", swapCurrencies);

  // Max balance button - Set the maximum available balance when clicked
  document
    .getElementById("maxButton")
    ?.addEventListener("click", updateMaxBalance);

  // Progress popup button - Show progress popup when clicked
  document
    .getElementById("progressPopupButton")
    ?.addEventListener("click", showPopup);

  // Progress popup close button - Hide progress popup when clicked
  document
    .getElementById("progressPopupCloseButton")
    ?.addEventListener("click", hidePopup);

  // Cancel button - Redirect user to the previous page when clicked
  document
    .getElementById("cancelButton")
    ?.addEventListener("click", redirectTobeforePage);

  // Bridge again button - Redirect user to the home page when clicked
  document
    .getElementById("bridgeAgainButton")
    ?.addEventListener("click", redirectToHome);

  // Get input fields for sending and receiving amounts
  const sendAmount = document.getElementById("sendAmount");
  const receiveAmount = document.getElementById("receiveAmount");

  sendAmount?.addEventListener("input", () => updateAmount("send"));
  sendAmount?.addEventListener("keydown", blockNegative);
  receiveAmount?.addEventListener("input", () => updateAmount("receive"));
  receiveAmount?.addEventListener("keydown", blockNegative);
}

// Function to update the initial max balance for Zcash and Avalanche
function updateInitialMaxBalance() {

  // Check if AvailableZcash is not already stored in sessionStorage
  if (!sessionStorage.getItem("AvailableZcash")) {
    // If not, set AvailableZcash to the current Zcash balance from CURRENCIES object
    sessionStorage.setItem("AvailableZcash", CURRENCIES.ZCASH.balance);
  }

  // Check if AvailableAvalanche is not already stored in sessionStorage
  if (!sessionStorage.getItem("AvailableAvalanche")) {
    // If not, set AvailableAvalanche to the current Avalanche balance from CURRENCIES object
    sessionStorage.setItem("AvailableAvalanche", CURRENCIES.AVALANCHE.balance);
  }

  // Retrieve the available Zcash balance from sessionStorage
  const availableZcash = sessionStorage.getItem("AvailableZcash");

  // Update the displayed available balance in the UI with the retrieved value
  // If AvailableZcash is found, display it rounded to 4 decimal places; otherwise, use the current balance from CURRENCIES
  document.getElementById("availableBalanceAmount").textContent = availableZcash
    ? parseFloat(availableZcash).toFixed(4)
    : CURRENCIES.ZCASH.balance.toFixed(4);
}

// Function to set the state of the continue button (disabled or enabled)
function setContinueButtonState(isDisabled) {
  const continueButton = document.getElementById("continueButton");
  continueButton.disabled = isDisabled;
  continueButton.style.opacity = isDisabled ? "40%" : "100%";
  continueButton.style.cursor = isDisabled ? "not-allowed" : "pointer";
}

// Function to update the send/receive amount based on the input type
function updateAmount(inputType) {

  // Get elements related to currency names and input fields
  const fromCurrencyName = document.querySelector("#fromCurrencyName");
  const toCurrencyName = document.querySelector("#toCurrencyName");
  const sendAmountInput = document.getElementById("sendAmount");
  const receiveAmountInput = document.getElementById("receiveAmount");
  const currencyName = document.getElementsByClassName("currency-name");

  // Retrieve available balances for Zcash and Avalanche from sessionStorage
  const availableZcash = sessionStorage.getItem("AvailableZcash");
  const availableAvalanche = sessionStorage.getItem("AvailableAvalanche");

  // Determine if the Zcash currency is involved based on the input type (send or receive)
  const isZcash =
    inputType === "send"
      ? fromCurrencyName.textContent === CURRENCIES.ZCASH.symbol
      : toCurrencyName.textContent === CURRENCIES.ZCASH.symbol;

  // Choose the correct input and output elements based on the input type (send or receive)
  const inputElement =
    inputType === "send" ? sendAmountInput : receiveAmountInput;
  const outputElement =
    inputType === "send" ? receiveAmountInput : sendAmountInput;

  // Get the input value and parse it to a float
  const inputValue = parseFloat(inputElement.value);

  // If the input is empty, reset the currency names and output field
  if (inputElement.value === "") {
    currencyName[0].style.color = "#c0c0c0";
    currencyName[1].style.color = "#c0c0c0";
    outputElement.value = "";
    return;
  }

  // Change currency name colors to active state when input is not empty
  currencyName[0].style.color = "#6e6e6e";
  currencyName[1].style.color = "#6e6e6e";

  // If input value is a valid number, proceed with the calculation
  if (!isNaN(inputValue)) {

    // If the input is "send" and the value is negative, reset it to 0
    if (inputType === "send" && inputValue < 0) {
      inputElement.value = "0";
    }

    // Calculate the amount to be sent or received, considering the bridging fee
    const calculatedAmount =
      inputType === "send"
        ? (inputValue - BRIDGING_FEE).toFixed(4)
        : (inputValue + BRIDGING_FEE).toFixed(4);

    // If the calculated amount is greater than 0, update the output value
    if (calculatedAmount > 0) {
      outputElement.value = calculatedAmount;

      // Determine the maximum allowable amount for the transaction (Zcash or Avalanche)
      const maxAmount = isZcash
        ? availableZcash ? availableZcash : CURRENCIES.ZCASH.balance
        : availableAvalanche ? availableAvalanche : CURRENCIES.AVALANCHE.balance;

      // Check if the input value exceeds the available balance
      const isExceedingLimit = inputValue > maxAmount;

      // Enable or disable the continue button based on the limit check
      setContinueButtonState(isExceedingLimit);
    } else {
      // If the calculated amount is 0 or less, reset the output field and disable the continue button
      outputElement.value = "0";
      setContinueButtonState(true);
    }
  } else {
    // If input is not a valid number, reset the output field
    outputElement.value = "";
  }
}

// Function to block negative sign input
function blockNegative(event) {
  if (event.key === "-") {
    event.preventDefault();
  }
}

// Function to update the maximum balance in the send amount field
function updateMaxBalance() {
  const sendAmount = document.getElementById("sendAmount");
  const fromCurrencyName = document.querySelector("#fromCurrencyName")?.textContent;

  // Retrieve the available Zcash and Avalanche balances from sessionStorage
  const availableZcash = sessionStorage.getItem("AvailableZcash");
  const availableAvalanche = sessionStorage.getItem("AvailableAvalanche");

  const isZcash = fromCurrencyName === CURRENCIES.ZCASH.symbol;

  sendAmount.value = isZcash
    ? availableZcash ? parseFloat(availableZcash).toFixed(4) : CURRENCIES.ZCASH.balance.toFixed(4)
    : availableAvalanche ? parseFloat(availableAvalanche).toFixed(4) : CURRENCIES.AVALANCHE.balance.toFixed(4);
  
  // Call the updateAmount function to update the corresponding output field
  updateAmount("send");
}

// Function to swap currencies in the UI and update related elements
function swapCurrencies() {
  // Create an object to store references to DOM elements and balances
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

  elements.sendAmountNode.value = DEFAULT_AMOUNT.toFixed(4);

  // Determine if the "from" currency is Zcash (based on the currency name)
  const isZcash =
    elements.fromCurrencyGroup.textContent.trim() === CURRENCIES.ZCASH.name;

  // Set the "from" and "to" currencies based on the selected "from" currency
  const fromCurrency = isZcash ? CURRENCIES.AVALANCHE : CURRENCIES.ZCASH;
  const toCurrency = isZcash ? CURRENCIES.ZCASH : CURRENCIES.AVALANCHE;

  // Update the "from" currency group with the new currency information (icon and name)
  elements.fromCurrencyGroup.innerHTML = `
      <img src="./img/${fromCurrency.icon}" class="icon-coin-sm currency-icon-circle" />
      ${fromCurrency.name}
    `;

  // Update the "to" currency group with the new currency information (icon and name)
  elements.toCurrencyGroup.innerHTML = ` 
      <img src="./img/${toCurrency.icon}" class="icon-coin-sm currency-icon-circle" />
      ${toCurrency.name}
    `;

  // Set the icons for the "from" and "to" amounts based on the selected currencies
  elements.fromAmountIcon.src = `./img/${fromCurrency.icon}`;
  elements.toAmountIcon.src = `./img/${toCurrency.icon}`;

  // Update the "from" and "to" currency symbols
  elements.fromCurrencyName.textContent = fromCurrency.symbol;
  elements.toCurrencyName.textContent = toCurrency.symbol;

  // Update the available balance amount and text based on the "from" currency
  elements.availableBalanceAmount.textContent =
    fromCurrency.symbol === CURRENCIES.AVALANCHE.symbol
      ? parseFloat(elements.availableAvalanche).toFixed(4)
      : parseFloat(elements.availableZcash).toFixed(4);
  elements.availableBalanceText.textContent = fromCurrency.symbol;

  // Set the receive amount based on the default amount and the bridging fee
  elements.receiveAmountNode.value = (DEFAULT_AMOUNT - BRIDGING_FEE).toFixed(4);
}

function showHelpPopup() {
  document.getElementById("helpPopupOverlay").style.display = "flex";
}

function hideHelpPopup() {
  document.getElementById("helpPopupOverlay").style.display = "none";
}

function showPopup() {
  document.getElementById("popupOverlay").style.display = "flex";
  document.querySelector(".main-container").classList.add("blur-background");
  startProgress();
}

function hidePopup() {
  document.getElementById("popupOverlay").style.display = "none";
  document.querySelector(".main-container").classList.remove("blur-background");
  stopProgress();
}

let progressInterval;

function updateProgressElements(progress, opacity) {
  document.getElementById("progressText").textContent = `${progress}%`;
  document.getElementById("progressBarFill").style.width = `${progress}%`;
  document.getElementById("logo_loading").style.opacity = opacity;

  // Hide close button when progress reaches 30%
  document.querySelector("#progressPopupCloseButton").style.visibility =
    progress >= 30 ? "hidden" : "visible";
  document.querySelector("#progressPopupCloseButton").style.pointerEvents =
    progress >= 30 ? "none" : "auto";

  // Change Popup Description when progress reaches 50%
  document.getElementById("popupDescription").textContent =
    progress < 50
      ? "You will be asked to approve the bridge transaction using MetaMask or Core, and then bridging will begin."
      : "The actual bridging time will be ~30 minutes for version 1.0 and much faster in future versions.";
}

function startProgress() {
  let progress = 10; // Starting progress
  const totalTime = 12000; // 12 seconds
  const interval = totalTime / (100 - progress); // Adjusted interval time

  progressInterval = setInterval(() => {
    if (progress < 100) {
      progress += 1;
      updateProgressElements(progress, progress / 100);
    } else {
      clearInterval(progressInterval);
      stopProgress();
      redirectToNextPage();
    }
  }, interval);
}

function stopProgress() {
  clearInterval(progressInterval);
  document.getElementById("progressText").textContent = "100%";
  document.getElementById("progressBarFill").style.width = "100%";
}

// Function to redirect to the transaction page and update sessionStorage with new balances
function redirectToTransaction() {
  // Retrieve the sending and receiving currencies, and amounts from the DOM
  const sendingCurrency =
    document.getElementById("fromCurrencyName")?.textContent;
  const sendAmount = document.getElementById("sendAmount")?.value;

  const receivingCurrency =
    document.getElementById("toCurrencyName")?.textContent;
  const receiveAmount = document.getElementById("receiveAmount")?.value;

  // Check if both send and receive amounts are provided; if not, show an alert
  if (!sendAmount || !receiveAmount)
    return alert("Please enter a valid amount.");

  // Retrieve the previous available balance for both Zcash and Avalanche from sessionStorage (or use default balance)
  const prevAvailableZcash = sessionStorage.getItem("AvailableZcash") ? sessionStorage.getItem("AvailableZcash") : CURRENCIES.ZCASH.balance;
  const prevAvailableAvalanche = sessionStorage.getItem("AvailableAvalanche") ? sessionStorage.getItem("AvailableAvalanche") : CURRENCIES.AVALANCHE.balance;
  
  // Check if the sending currency is Zcash, and update the sessionStorage accordingly
  if (sendingCurrency === CURRENCIES.ZCASH.symbol) {
    
    sessionStorage.setItem("AvailableZcash", parseFloat(prevAvailableZcash) - parseFloat(sendAmount));
    sessionStorage.setItem("AvailableAvalanche", parseFloat(prevAvailableAvalanche) + parseFloat(receiveAmount));
  } else {
    
    sessionStorage.setItem(
      "AvailableAvalanche",
      parseFloat(prevAvailableAvalanche) - parseFloat(sendAmount)
    );
    sessionStorage.setItem(
      "AvailableZcash",
      parseFloat(prevAvailableZcash) + parseFloat(receiveAmount)
    );
  }

  // Redirect to the transaction page, passing the send and receive amounts along with currency names
  window.location.href = `transaction.html?send=${encodeURIComponent(
    sendAmount
  )} ${encodeURIComponent(sendingCurrency)}&receive=${encodeURIComponent(
    receiveAmount
  )} ${encodeURIComponent(receivingCurrency)}`;
}

// Function to redirect to the next page
function redirectToNextPage() {
  const sendAmount = document.getElementById("sendingAmount").textContent;
  const receiveAmount = `${
    document.getElementById("receivingAmount").textContent
  }`;

  const url = `transaction-status.html?send=${encodeURIComponent(
    sendAmount
  )}&receive=${encodeURIComponent(receiveAmount)}`;
  window.location.href = url;
}

// Function to redirect to the previous page
function redirectTobeforePage() {
  window.location.href = "index.html";
}

// Function to redirect to the home page
function redirectToHome() {
  window.location.href = "index.html";
}
