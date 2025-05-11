const BASE_URL = "http://localhost:3000";

export const placesRepository = {
  async getAllPlaces() {
    const response = await fetch(`${BASE_URL}/places`);
    const data = await response.json();

    return data;
  },

  async getPlaceBySlug(slug) {
    const response = await fetch(
      `${BASE_URL}/places?slug=${slug}&_embed=reviews&_embed=images`
    );
    const data = await response.json();

    return data[0];
  },

  async getPlacesByName(name) {
    const response = await fetch(`${BASE_URL}/places?name=${name}`);
    const data = await response.json();

    return data;
  },

  async getHighlightedPlaces() {
    const response = await fetch(`${BASE_URL}/places?highlight=true`);
    const data = await response.json();

    return data;
  },
};
