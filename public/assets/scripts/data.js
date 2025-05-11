const BASE_URL = "http://localhost:3000";

export const placesRepository = {
  async getAllPlaces() {
    try {
      const response = await fetch(`${BASE_URL}/places`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching all places:", error);
      throw error;
    }
  },

  async getPlaceBySlug(slug) {
    try {
      const response = await fetch(
        `${BASE_URL}/places?slug=${slug}&_embed=reviews&_embed=images`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error(`Error fetching place with slug ${slug}:`, error);
      throw error;
    }
  },

  async getPlacesByName(name) {
    try {
      const response = await fetch(`${BASE_URL}/places?name=${name}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching places with name ${name}:`, error);
      throw error;
    }
  },

  async getHighlightedPlaces() {
    try {
      const response = await fetch(`${BASE_URL}/places?highlight=true`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching highlighted places:", error);
      throw error;
    }
  },
};
