import { renderDrawer } from "./drawer.js";
import { renderVideos } from "./videos.js";
import { renderFavorites } from "./favorites.js";

const BASE_BFF_URL = "http://localhost:3001";

const drawer = document.getElementById("drawer");
const content = document.getElementById("content");

renderDrawer(drawer);
loadPage("/videos");

window.onpopstate = function () {
  loadPage(location.pathname);
};

function loadPage(route) {
  if (route === "/videos") {
    renderVideos(content);
  } else if (route === "/favoritos") {
    renderFavorites(content);
  }
}

export function navigateTo(route) {
  history.pushState(null, null, route);
  loadPage(route);
}

export function updateFavoritesCount() {
  fetch(`${BASE_BFF_URL}/favorites`)
    .then((response) => response.json())
    .then((favorites) => {
      document.getElementById("favorites-count").textContent = favorites.length;
    });
}
