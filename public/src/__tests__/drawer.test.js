import { renderDrawer } from "../drawer.js";
import { navigateTo, updateFavoritesCount } from "../app.js";

jest.mock("../app.js", () => ({
  navigateTo: jest.fn(),
  updateFavoritesCount: jest.fn(),
}));

describe("Drawer", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="drawer"></div>`;
  });

  test("should render drawer", () => {
    const drawer = document.getElementById("drawer");
    renderDrawer(drawer);
    expect(drawer.innerHTML).toContain("VÍDEOS");
    expect(drawer.innerHTML).toContain("FAVORITOS");
  });

  test("should handle link clicks", () => {
    const drawer = document.getElementById("drawer");
    renderDrawer(drawer);
    document.getElementById("link-videos").click();
    expect(navigateTo).toHaveBeenCalledWith("/videos");
    document.getElementById("link-favorites").click();
    expect(navigateTo).toHaveBeenCalledWith("/favoritos");
  });

  test("should update favorites count on render", () => {
    const drawer = document.getElementById("drawer");
    renderDrawer(drawer);
    expect(updateFavoritesCount).toHaveBeenCalled();
  });
});
