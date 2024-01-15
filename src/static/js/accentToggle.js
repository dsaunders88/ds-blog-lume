const redAccentToggle = document.querySelector("#printersRedAccentToggle");
const blueAccentToggle = document.querySelector("#dodgerBlueAccentToggle");
const goldAccentToggle = document.querySelector("#sunGoldAccentToggle");
const greenAccentToggle = document.querySelector("#malachiteGreenAccentToggle");
const purpleAccentToggle = document.querySelector("#mallowPurpleAccentToggle");
const accentToggles = [
  redAccentToggle,
  blueAccentToggle,
  goldAccentToggle,
  greenAccentToggle,
  purpleAccentToggle,
];

// Default button settings
if (!("accent" in localStorage)) {
  redAccentToggle.classList.add("active");
} else if (localStorage.accent === "dodgerBlue") {
  blueAccentToggle.classList.add("active");
} else if (localStorage.accent === "sunGold") {
  goldAccentToggle.classList.add("active");
} else if (localStorage.accent === "malachiteGreen") {
  greenAccentToggle.classList.add("active");
} else if (localStorage.accent === "mallowPurple") {
  purpleAccentToggle.classList.add("active");
} else if (localStorage.accent === "printersRed") {
  redAccentToggle.classList.add("active");
} else {
  redAccentToggle.classList.add("active");
}

accentToggles.forEach((button) => {
  button.addEventListener("click", () => {
    switch (button.id) {
      case "printersRedAccentToggle":
        accentToggles.forEach((toggle) => toggle.classList.remove("active"));
        redAccentToggle.classList.add("active");
        // blueAccentToggle.classList.remove("active");
        localStorage.setItem("accent", "printersRed");
        document.documentElement.setAttribute("data-accent", "printers-red");
        console.log("new accent", localStorage.getItem("accent"));
        break;
      case "dodgerBlueAccentToggle":
        accentToggles.forEach((toggle) => toggle.classList.remove("active"));
        // redAccentToggle.classList.remove("active");
        blueAccentToggle.classList.add("active");
        localStorage.setItem("accent", "dodgerBlue");
        document.documentElement.setAttribute("data-accent", "dodger-blue");
        console.log("new accent", localStorage.getItem("accent"));
        break;
      case "sunGoldAccentToggle":
        accentToggles.forEach((toggle) => toggle.classList.remove("active"));
        goldAccentToggle.classList.add("active");
        localStorage.setItem("accent", "sunGold");
        document.documentElement.setAttribute("data-accent", "sun-gold");
        console.log("new accent", localStorage.getItem("accent"));
        break;
      case "malachiteGreenAccentToggle":
        accentToggles.forEach((toggle) => toggle.classList.remove("active"));
        greenAccentToggle.classList.add("active");
        localStorage.setItem("accent", "malachiteGreen");
        document.documentElement.setAttribute("data-accent", "malachite-green");
        console.log("new accent", localStorage.getItem("accent"));
        break;
      case "mallowPurpleAccentToggle":
        accentToggles.forEach((toggle) => toggle.classList.remove("active"));
        purpleAccentToggle.classList.add("active");
        localStorage.setItem("accent", "mallowPurple");
        document.documentElement.setAttribute("data-accent", "mallow-purple");
        console.log("new accent", localStorage.getItem("accent"));
        break;
    }
  });
});
