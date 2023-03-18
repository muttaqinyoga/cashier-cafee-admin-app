import routing from "./components/routing.js";

window.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        if (location.href != e.target.href) {
            history.pushState("", "", e.target.href);
            routing.run(e.target.getAttribute("href"));
        }
        return;
    }
});
window.addEventListener("popstate", function () {
    routing.run(this.location.pathname);
});
window.addEventListener("DOMContentLoaded", routing.run(location.pathname));
