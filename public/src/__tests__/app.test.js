import { renderDrawer } from "../drawer.js";
import { renderVideos } from "../videos.js";
import { renderFavorites } from "../favorites.js";
import { navigateTo, updateFavoritesCount, loadPage } from "../app.js";

jest.mock("../drawer.js", () => ({
  renderDrawer: jest.fn(),
}));

jest.mock("../videos.js", () => ({
  renderVideos: jest.fn(),
}));

jest.mock("../favorites.js", () => ({
  renderFavorites: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: "1" }, { id: "2" }]),
  })
);

beforeEach(() => {
  document.body.innerHTML = `
    <div id="drawer"></div>
    <div id="content"></div>
  `;
  renderDrawer.mockClear();
  renderVideos.mockClear();
  renderFavorites.mockClear();
  fetch.mockClear();

  // Mock window.history.pushState
  jest.spyOn(window.history, 'pushState').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("App", () => {
  test("should render drawer on load", () => {
    require("../app.js");
    expect(renderDrawer).toHaveBeenCalled();
  });

  test("should navigate to videos page", () => {
    navigateTo("/videos");
    expect(window.history.pushState).toHaveBeenCalledWith(null, null, "/videos");
    expect(renderVideos).toHaveBeenCalled();
  });

  test("should navigate to favorites page", () => {
    navigateTo("/favoritos");
    expect(window.history.pushState).toHaveBeenCalledWith(null, null, "/favoritos");
    expect(renderFavorites).toHaveBeenCalled();
  });

  test("should update favorites count", async () => {
    document.body.innerHTML = '<span id="favorites-count"></span>';
    await updateFavoritesCount();
    expect(document.getElementById("favorites-count").textContent).toBe("2");
  });
});
