import { renderFavorites } from "../favorites.js";
import { updateFavoritesCount } from "../app.js";

jest.mock("../app.js", () => ({
  updateFavoritesCount: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: { videoId: "1" } }, { id: { videoId: "2" } }]),
  })
);

describe("Favorites", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="drawer" class="drawer"></div><div id="content"></div>';
    fetch.mockClear();
    updateFavoritesCount.mockClear();
  });

  test("should render favorites", async () => {
    const content = document.getElementById("content");
    await renderFavorites(content);
    expect(content.innerHTML).toContain("<span class='title'>MF_VIDEOS FAVORITOS</span>");
    expect(content.innerHTML).toContain('<iframe width="100%" height="200"');
  });

  test("should handle favorite button click", async () => {
    const content = document.getElementById("content");
    await renderFavorites(content);
    const favoriteButton = content.querySelector(".favorite-button");
    favoriteButton.click();
    expect(fetch).toHaveBeenCalledWith("http://localhost:3001/favorites/1", {
      method: "DELETE",
    });
  });
});
