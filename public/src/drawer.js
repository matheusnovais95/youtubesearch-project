import { navigateTo, updateFavoritesCount } from "./app.js";

export function renderDrawer(element) {
  element.innerHTML = `
        <div class="container-close-button"> 
            <span class="close-button" id="close-button">X</span>
        </div>
        <h1 class="title">MF_DRAWER</h1>
        <nav>            
            <ul>
                <li><a href="/videos" id="link-videos">VÍDEOS</a></li>
                <li><a href="/favoritos" id="link-favorites">FAVORITOS <span id="favorites-count">0</span></a></li>
            </ul>
        </nav>
    `;

  const closeButton = document.getElementById("close-button");
  const drawer = document.getElementById("drawer");

  closeButton.addEventListener("click", () => {
    drawer.classList.remove("toggle-menu");
  });


  document.getElementById("link-videos").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/videos");
  });

  document.getElementById("link-favorites").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/favoritos");
  });

  updateFavoritesCount();
}
