const lightThemeToggle = document.querySelector("#lightThemeToggle");
const darkThemeToggle = document.querySelector("#darkThemeToggle");
const systemThemeToggle = document.querySelector("#systemThemeToggle");
const toggles = [lightThemeToggle, darkThemeToggle, systemThemeToggle];
const themeDisclosure = document.querySelector(".toggles .theme");

// Default button settings
if (!("theme" in localStorage)) {
  systemThemeToggle.classList.add("active");
} else if (localStorage.theme === "dark") {
  darkThemeToggle.classList.add("active");
} else {
  lightThemeToggle.classList.add("active");
}

toggles.forEach((button) => {
  button.addEventListener("click", () => {
    // const savedTheme = localStorage.getItem("theme");
    // console.log("saved theme", savedTheme);
    // Toggle buttons
    switch (button.id) {
      case "lightThemeToggle":
        lightThemeToggle.classList.add("active");
        darkThemeToggle.classList.remove("active");
        systemThemeToggle.classList.remove("active");
        localStorage.setItem("theme", "light");
        document.documentElement.setAttribute("data-theme", "light");
        console.log("new theme", localStorage.getItem("theme"));
        break;
      case "darkThemeToggle":
        lightThemeToggle.classList.remove("active");
        darkThemeToggle.classList.add("active");
        systemThemeToggle.classList.remove("active");
        localStorage.setItem("theme", "dark");
        document.documentElement.setAttribute("data-theme", "dark");
        console.log("new theme", localStorage.getItem("theme"));
        break;
      case "systemThemeToggle":
        lightThemeToggle.classList.remove("active");
        darkThemeToggle.classList.remove("active");
        systemThemeToggle.classList.add("active");
        localStorage.removeItem("theme");
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.setAttribute("data-theme", "dark");
          console.log(
            "removed theme, restored system preference to dark",
            localStorage.getItem("theme")
          );
        } else {
          document.documentElement.setAttribute("data-theme", "light");
          console.log(
            "removed theme, restored system prefernce to light",
            localStorage.getItem("theme")
          );
        }
        break;
    }

    themeDisclosure.removeAttribute("open");
  });
});
