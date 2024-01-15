// Default theme set
const savedTheme = localStorage.getItem("theme");
const savedAccent = localStorage.getItem("accent");
console.log("saved theme", savedTheme);
console.log("saved accent", savedAccent);

switch (savedTheme) {
  case "light":
    document.documentElement.setAttribute("data-theme", "light");
    break;
  case "dark":
    document.documentElement.setAttribute("data-theme", "dark");
    break;
  case null:
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    break;
  default:
    document.documentElement.setAttribute("data-theme", "light");
}

switch (savedAccent) {
  case "printersRed":
    document.documentElement.setAttribute("data-accent", "printers-red");
    break;
  case "dodgerBlue":
    document.documentElement.setAttribute("data-accent", "dodger-blue");
    break;
  case "sunGold":
    document.documentElement.setAttribute("data-accent", "sun-gold");
    break;
  case "malachiteGreen":
    document.documentElement.setAttribute("data-accent", "malachite-green");
    break;
  case "mallowPurple":
    document.documentElement.setAttribute("data-accent", "mallow-purple");
    break;
  default:
    document.documentElement.setAttribute("data-accent", "printers-red");
}
