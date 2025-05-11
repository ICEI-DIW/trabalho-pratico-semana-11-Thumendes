import { data } from "./public/assets/scripts/data.js";
import { writeFile } from "node:fs/promises";

async function dataToJson() {
  const json = {
    places: [],
    reviews: [],
    images: [],
  };

  for (const item of data) {
    const { reviews, images, ...place } = item;

    json.places.push(place);

    for (const review of reviews) {
      json.reviews.push({ ...review, placeId: place.id });
    }

    for (const image of images) {
      json.images.push({ ...image, placeId: place.id });
    }
  }

  await writeFile("./db/db.json", JSON.stringify(json, null, 2));
}

dataToJson();
