import { updateFavoritesCount } from "./app.js";

const BASE_BFF_URL = "http://localhost:3001";

export function renderVideos(element) {
  element.innerHTML = `
    <header>        
            <div class="container-input">
                <button id="hamburguer-button" class="hamburguer-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 18H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 12H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 6H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <span class="title">MF_VIDEOS</span>
            </div>
            <div class="container-input">
                <input type="text" id="search-input" placeholder="Buscar vídeos">
                <button id="search-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21.0004 21L16.6504 16.65" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

            </div>        
    </header>  
        <div id="video-list">
            
        </div>
    `;

  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const videoList = document.getElementById("video-list");

  const hamburguerButton = document.getElementById("hamburguer-button");
  const drawer = document.getElementById("drawer");

  hamburguerButton.addEventListener("click", () => {
    drawer.classList.toggle("toggle-menu");
  });

  searchButton.addEventListener("click", () => {
    const query = searchInput.value;
    fetch(`${BASE_BFF_URL}/videos?q=${query}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        videoList.innerHTML = "";
        data.forEach((item) => {
          const isFavorite = checkIfFavorite(item);
          const video = document.createElement("div");
          video.innerHTML = `                       
                        <iframe width="100%" height="200" src="https://www.youtube.com/embed/${
                          item.id.videoId
                        }" allowfullscreen></iframe>
                        <button class="favorite-button" id="favorite-button">${
                          isFavorite
                            ? `<svg width="25" height="25" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 0L22.0413 12.4377H35.119L24.5389 20.1246L28.5801 32.5623L18 24.8754L7.41987 32.5623L11.4611 20.1246L0.880983 12.4377H13.9587L18 0Z" fill="#fff459"/>
</svg>
`
                            : `<svg
                              width="25"
                              height="25"
                              viewBox="0 0 36 36"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18 0L22.0413 12.4377H35.119L24.5389 20.1246L28.5801 32.5623L18 24.8754L7.41987 32.5623L11.4611 20.1246L0.880983 12.4377H13.9587L18 0Z"
                                fill="#ffffff"
                              />
                            </svg>`
                        }</button>
                    `;
          video
            .querySelector(".favorite-button")
            .addEventListener("click", () => {
              toggleFavorite(item, video.querySelector(".favorite-button"));
            });
          videoList.appendChild(video);
        });
      });
  });
}

function toggleFavorite(video, button) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex(
    (fav) => fav.id.videoId === video.id.videoId
  );

  if (index >= 0) {
    fetch(`${BASE_BFF_URL}/favorites`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: video.id }),
    })
      .then((response) => response.json())
      .then((updatedFavorites) => {
        favorites = updatedFavorites;
        button.innerHTML = `<svg
                              width="25"
                              height="25"
                              viewBox="0 0 36 36"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18 0L22.0413 12.4377H35.119L24.5389 20.1246L28.5801 32.5623L18 24.8754L7.41987 32.5623L11.4611 20.1246L0.880983 12.4377H13.9587L18 0Z"
                                fill="#ffffff"
                              />
                            </svg>`;
        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavoritesCount();
      });
  } else {
    fetch(`${BASE_BFF_URL}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(video),
    })
      .then((response) => response.json())
      .then((updatedFavorites) => {
        favorites = updatedFavorites;
        button.innerHTML = `<svg width="25" height="25" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 0L22.0413 12.4377H35.119L24.5389 20.1246L28.5801 32.5623L18 24.8754L7.41987 32.5623L11.4611 20.1246L0.880983 12.4377H13.9587L18 0Z" fill="#fff459"/>
</svg>
`;
        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavoritesCount();
      });
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function checkIfFavorite(video) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.some((fav) => fav.id.videoId === video.id.videoId);
}
