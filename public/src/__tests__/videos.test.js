import { renderVideos } from "../videos.js";
import { updateFavoritesCount } from "../app.js";

jest.mock("../app.js", () => ({
  updateFavoritesCount: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: { videoId: "1" } }, { id: { videoId: "2" } }]),
  })
);

describe("Videos", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="content"></div><div id="drawer"></div>';
    fetch.mockClear();
    updateFavoritesCount.mockClear();
  });

  test("should render videos", () => {
    const content = document.getElementById("content");
    renderVideos(content);
    expect(content.innerHTML).toContain("MF_VIDEOS");
  });

  test("should handle search button click", async () => {
    const content = document.getElementById("content");
    renderVideos(content);
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    searchInput.value = "test";
    searchButton.click();
    expect(fetch).toHaveBeenCalledWith("http://localhost:3001/videos?q=test");
  });

  test("should handle favorite button click", async () => {
    const content = document.getElementById("content");
    renderVideos(content);
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    searchInput.value = "test";
    await searchButton.click();
    
    // Mock the localStorage
    const localStorageMock = (function() {
      let store = {};
      return {
        getItem(key) {
          return store[key] || null;
        },
        setItem(key, value) {
          store[key] = value.toString();
        },
        clear() {
          store = {};
        },
        removeItem(key) {
          delete store[key];
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    const videoList = document.getElementById("video-list");
    videoList.innerHTML = `
      <div>
        <iframe width="100%" height="200" src="https://www.youtube.com/embed/1" allowfullscreen></iframe>
        <button class="favorite-button">
          <svg width="25" height="25" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0L22.0413 12.4377H35.119L24.5389 20.1246L28.5801 32.5623L18 24.8754L7.41987 32.5623L11.4611 20.1246L0.880983 12.4377H13.9587L18 0Z" fill="#fff459"/>
          </svg>
        </button>
      </div>
    `;

    const favoriteButton = videoList.querySelector(".favorite-button");
    favoriteButton.click();
    expect(fetch).toHaveBeenCalledWith("http://localhost:3001/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: { videoId: "1" } }),
    });
  });
});
