const redAccentToggle = document.querySelector("#printersRedAccentToggle");
const blueAccentToggle = document.querySelector("#dodgerBlueAccentToggle");
const accentToggles = [redAccentToggle, blueAccentToggle];

// Default button settings
if (!("accent" in localStorage)) {
  redAccentToggle.classList.add("active");
} else if (localStorage.accent === "dodgerBlue") {
  blueAccentToggle.classList.add("active");
} else if (localStorage.accent === "printersRed") {
  redAccentToggle.classList.add("active");
} else {
  redAccentToggle.classList.add("active");
}

accentToggles.forEach((button) => {
  button.addEventListener("click", () => {
    switch (button.id) {
      case "printersRedAccentToggle":
        redAccentToggle.classList.add("active");
        blueAccentToggle.classList.remove("active");
        localStorage.setItem("accent", "printersRed");
        document.documentElement.setAttribute("data-accent", "printers-red");
        console.log("new accent", localStorage.getItem("accent"));
        break;
      case "dodgerBlueAccentToggle":
        redAccentToggle.classList.remove("active");
        blueAccentToggle.classList.add("active");
        localStorage.setItem("accent", "dodgerBlue");
        document.documentElement.setAttribute("data-accent", "dodger-blue");
        console.log("new accent", localStorage.getItem("accent"));
        break;
    }
  });
});
