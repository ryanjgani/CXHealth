// Select the button
const btntoggle = document.querySelector(".btn-toggle");
// Select the stylesheet <link>
const theme_boilerplate = document.querySelector(".theme-link1");
const theme_style = document.querySelector(".theme-link2");

const selectedTheme = localStorage.getItem("selected-theme");

const getCurrentTheme = () => {
    return theme_boilerplate.href.includes("dark") ? "dark" : "light";
};

if (selectedTheme) {
    if (selectedTheme == "dark") {
        theme_boilerplate.href = "/css/boilerplate_dark.css";
        theme_style.href = "/css/style_dark.css";
    } else {
        theme_boilerplate.href = "/css/boilerplate.css";
        theme_style.href = "/css/style.css";
    }
}
let table = "light";
// Listen for a click on the button
btntoggle.addEventListener("click", function () {
    // If the current URL contains "ligh-theme.css"
    if (getCurrentTheme() == "light") {
        // ... then switch it to "dark-theme.css"
        theme_boilerplate.href = "/css/boilerplate_dark.css";
        theme_style.href = "/css/style_dark.css";
        table = "dark";
        // Otherwise...
    } else {
        // ... switch it to "light-theme.css"
        theme_boilerplate.href = "/css/boilerplate.css";
        theme_style.href = "/css/style.css";
        table = "light";
    }
    localStorage.setItem("selected-theme", getCurrentTheme());
});
