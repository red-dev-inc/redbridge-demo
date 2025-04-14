export const themes = ["red", "dark", "light", "zebra"];

export function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") || "red";
}

export function getNextThemes(current) {
  const index = themes.indexOf(current);
  return {
    next: themes[(index + 1) % themes.length],
    preview: themes[(index + 2) % themes.length],
  };
}

export function updateThemeTooltip(previewTheme) {
  const dstooltip = document.getElementById("dsThemeInfo");
  const mbtooltip = document.getElementById("mbThemeInfo");
  const label =
    previewTheme === "red"
      ? `<b>red</b> Mode`
      : `${capitalize(previewTheme)} Mode`;

  if (dstooltip) {
    dstooltip.innerHTML = label;
  }
  if (mbtooltip) {
    mbtooltip.innerHTML = label;
  }
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function setTheme(theme) {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  // Gradient color map
  const gradientThemes = {
    red: { stop1: "#ef1a1a", stop2: "#780d0d" },
    dark: { stop1: "#ef1a1a", stop2: "#780d0d" },
    light: { stop1: "#171717", stop2: "#d2c9c9" },
    zebra: { stop1: "#f4b728", stop2: "#342c0a" },
  };

  // Icon map for dynamic theming
  const iconMap = {
    red: {
      help: "./img/help_icon.svg",
      swap: "./img/arrows.svg",
      cancel: "./img/cancel_icon.svg",
      check: "./img/iconcheck.svg",
      chevron: "./img/chevron-down.svg",
      avaxIcon: "./img/avax.svg",
      bridgeLogo: "./img/zavax-icon.png",
    },
    dark: {
      help: "./img/help_icon.svg",
      swap: "./img/arrows.svg",
      cancel: "./img/cancel_icon.svg",
      check: "./img/iconcheck.svg",
      chevron: "./img/chevron-down.svg",
      avaxIcon: "./img/avax.svg",
      bridgeLogo: "./img/zavax-icon.png",
    },
    light: {
      help: "./img/help_icon_light.svg",
      swap: "./img/arrow_light.svg",
      cancel: "./img/cancel_light.svg",
      check: "./img/icon_check_light.svg",
      chevron: "./img/chevron_light.svg",
      avaxIcon: "./img/avax.svg",
      bridgeLogo: "./img/zavax-icon.png",
    },
    zebra: {
      help: "./img/help_icon_zebra.svg",
      swap: "./img/arrow_zebra.svg",
      cancel: "./img/cancel_zebra.svg",
      check: "./img/icon_check_zebra.svg",
      chevron: "./img/chevron-down.svg",
      avaxIcon: "./img/avax_white.svg",
      bridgeLogo: "./img/zavax_bw.svg",
    },
  };

  // Apply SVG gradient stops
  const stops = {
    leftstop1: document.getElementById("gradientLeftStop1"),
    bottomstop1: document.getElementById("gradientBottomStop1"),
    leftstop2: document.getElementById("gradientLeftStop2"),
    bottomstop2: document.getElementById("gradientBottomStop2"),
  };

  const gradient = gradientThemes[theme];
  if (gradient) {
    stops.leftstop1?.setAttribute("stop-color", gradient.stop1);
    stops.bottomstop1?.setAttribute("stop-color", gradient.stop1);
    stops.leftstop2?.setAttribute("stop-color", gradient.stop2);
    stops.bottomstop2?.setAttribute("stop-color", gradient.stop2);
  }

  // Swap icons based on theme
  const icons = {
    dsHelpButton: document.getElementById("dsHelpButton"),
    mbHelpButton: document.getElementById("mbHelpButton"),
    dsSwapIcon: document.getElementById("dsSwapIcon"),
    mbSwapIcon: document.getElementById("mbSwapIcon"),
    cancelIcon: document.getElementById("cancelIcon"),
    checkIcon: document.getElementById("checkIcon"),
    toAmountIcon: document.getElementById("toAmountIcon"),
    fromAmountIcon: document.getElementById("fromAmountIcon"),
    loadingLogo: document.getElementById("logo_loading"),
  };

  const assets = iconMap[theme] || iconMap.red;
  if (icons.dsHelpButton) icons.dsHelpButton.src = assets.help;
  if (icons.mbHelpButton) icons.mbHelpButton.src = assets.help;
  if (icons.dsSwapIcon) icons.dsSwapIcon.src = assets.swap;
  if (icons.mbSwapIcon) icons.mbSwapIcon.src = assets.swap;
  if (icons.cancelIcon) icons.cancelIcon.src = assets.cancel;
  if (icons.checkIcon) icons.checkIcon.src = assets.check;
  if (icons.toAmountIcon && icons.toAmountIcon.src.includes("avax"))
    icons.toAmountIcon.src = assets.avaxIcon;
  if (icons.fromAmountIcon && icons.fromAmountIcon.src.includes("avax"))
    icons.fromAmountIcon.src = assets.avaxIcon;
  if (icons.loadingLogo) icons.loadingLogo.src = assets.bridgeLogo;
  // Update ALL chevron icons
  const chevronIcons = document.querySelectorAll(".dropdown-arrow");
  chevronIcons.forEach((icon) => {
    icon.src = assets.chevron;
  });
  // Currency icon
  const toCurrencyIcon = document.querySelector("#toCurrencyGroup img");
  if (toCurrencyIcon && toCurrencyIcon.src.includes("avax")) {
    toCurrencyIcon.src = assets.avaxIcon;
  }

  const fromCurrencyIcon = document.querySelector("#fromCurrencyGroup img");
  if (fromCurrencyIcon && fromCurrencyIcon.src.includes("avax")) {
    fromCurrencyIcon.src = assets.avaxIcon;
  }

  const toNetworkIcon = document.querySelector("#toNetwork img");
  if (toNetworkIcon && toNetworkIcon.src.includes("avax")) {
    toNetworkIcon.src = assets.avaxIcon;
  }

  const fromNetworkIcon = document.querySelector("#fromNetwork img");
  if (fromNetworkIcon && fromNetworkIcon.src.includes("avax")) {
    fromNetworkIcon.src = assets.avaxIcon;
  }
  const avaxIcons = document.querySelectorAll(".avax-currency");
  avaxIcons.forEach((icon) => {
    if (icon.src.includes("avax")) {
      icon.src = assets.avaxIcon;
    }
  });

  const bridgeLogos = document.querySelectorAll(".header-icon");
  bridgeLogos.forEach((icon) => {
    icon.src = assets.bridgeLogo;
  });
}
