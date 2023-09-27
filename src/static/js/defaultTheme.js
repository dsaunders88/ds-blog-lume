// Default theme set
const savedTheme = localStorage.getItem("theme");
console.log("saved theme", savedTheme);
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
