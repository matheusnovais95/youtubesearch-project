const BASE_BFF_URL = "http://localhost:3001";

import { updateFavoritesCount } from "./app.js";

export function renderFavorites(element) {
  fetch(`${BASE_BFF_URL}/favorites`)
    .then((response) => response.json())
    .then((favorites) => {
      element.innerHTML = `<header>
            <div class="container-input">
                <button id="hamburguer-button-favorite" class="hamburguer-button" >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 18H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 12H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 6H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <span class="title">MF_VIDEOS FAVORITOS</span>
            </div>
         </header>
        <div id="favorites-list"></div>`;

      const hamburguerButton = document.getElementById(
        "hamburguer-button-favorite"
      );
      const drawer = document.getElementById("drawer");

      hamburguerButton.addEventListener("click", () => {
        drawer.classList.toggle("toggle-menu");
      });
      
      const favoritesList = document.getElementById("favorites-list");

      favorites.forEach((video) => {
        const videoElem = document.createElement("div");
        videoElem.innerHTML = `
                    <iframe width="100%" height="200" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
                    <button class="favorite-button"><svg width="25" height="25" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 0L22.0413 12.4377H35.119L24.5389 20.1246L28.5801 32.5623L18 24.8754L7.41987 32.5623L11.4611 20.1246L0.880983 12.4377H13.9587L18 0Z" fill="#fff459"/>
</svg>
</button>
                `;
        videoElem
          .querySelector(".favorite-button")
          .addEventListener("click", () => {
            removeFavorite(video, videoElem);
          });
        favoritesList.appendChild(videoElem);
      });
    });
}

function removeFavorite(video, element) {
  fetch(`${BASE_BFF_URL}/favorites`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: video.id }),
  })
    .then((response) => response.json())
    .then((updatedFavorites) => {
      element.remove();
      updateFavoritesCount();
    });
}
