import { placesRepository } from "./data.js";
import {
  createMap,
  div,
  getSearchParam,
  createCarouselIndicator,
  createCarouselItem,
  createPlaceCard,
  createRatingIndicator,
  createReviewCard,
} from "./utils.js";

async function loadHomePage() {
  /**
   * Highlight Carousel
   */
  const highlightedPlaces = await placesRepository.getHighlightedPlaces();
  const $highlightCarousel = document.querySelector("#hightlight-carousel");

  for (const [index, place] of highlightedPlaces.entries()) {
    // Create the carousel item
    const $carouselItem = createCarouselItem({
      name: place.name,
      image: place.thumbnail,
      description: place.description,
      href: `detalhe.html?slug=${place.slug}`,
      index,
    });
    $highlightCarousel
      .querySelector(".carousel-inner")
      .appendChild($carouselItem);

    // Create the indicator
    const $indicator = createCarouselIndicator({
      carouselId: "#hightlight-carousel",
      label: place.name,
      index,
    });
    $highlightCarousel
      .querySelector(".carousel-indicators")
      .appendChild($indicator);
  }

  const allPlaces = await placesRepository.getAllPlaces();
  const $placeCardContainer = document.querySelector("#places");

  for (const place of allPlaces) {
    // Create the card
    const $placeCard = createPlaceCard(place);
    const $wrapper = div("col-12 col-sm-6 col-md-4 col-lg-3 mb-3");
    $wrapper.appendChild($placeCard);

    $placeCardContainer.appendChild($wrapper);
  }
}

async function loadDetailPage() {
  const slug = getSearchParam("slug");
  const place = await placesRepository.getPlaceBySlug(slug);

  if (!place) {
    window.location.href = "/";
  }

  document.querySelector("#place-name").textContent = place.name;
  document.querySelector("#place-description").textContent = place.description;
  document
    .querySelector("#place-thumbnail")
    .setAttribute("src", place.thumbnail);
  document.querySelector("#place-opening-hours").textContent =
    place.info.openingHours;
  document.querySelector("#place-address").textContent = place.info.address;
  document.querySelector("#place-phone").textContent = place.info.contact;
  document.querySelector("#place-price-range").textContent =
    place.info.priceRange;
  document.querySelector("#place-website").textContent = place.info.website;

  // Detaques
  const $highlightList = document.querySelector("#place-highlights");
  for (const highlight of place.highlights) {
    const $highlightItem = div("list-group-item");
    $highlightItem.textContent = highlight;
    $highlightList.appendChild($highlightItem);
  }

  // Comodidades
  const $amenitiesList = document.querySelector("#place-amenities");
  for (const amenitie of place.info.amenities) {
    const $amenitieItem = div("list-group-item");
    $amenitieItem.textContent = amenitie;
    $amenitiesList.appendChild($amenitieItem);
  }

  // Comodidades
  const $activitiesList = document.querySelector("#place-activities");
  for (const activity of place.info.activities) {
    const $amenitieItem = div("list-group-item");
    $amenitieItem.textContent = activity;
    $activitiesList.appendChild($amenitieItem);
  }

  // Localização
  const $map = document.querySelector("#place-map");
  $map.appendChild(
    createMap(place.location.latitude, place.location.longitude)
  );

  // Fotos
  const $photosCarousel = document.querySelector("#photos-carousel");
  for (const [index, photo] of place.images.entries()) {
    // Create the carousel item
    const $carouselItem = createCarouselItem({
      image: photo.src,
      index,
      name: photo.description,
    });
    $photosCarousel.querySelector(".carousel-inner").appendChild($carouselItem);

    // Create the indicator
    const $indicator = createCarouselIndicator({
      carouselId: "#photos-carousel",
      label: photo.description,
      index,
    });
    $photosCarousel
      .querySelector(".carousel-indicators")
      .appendChild($indicator);
  }

  // Resumo avaliações
  const averageRating =
    place.reviews.reduce((acc, review) => acc + review.rating, 0) /
    place.reviews.length;
  const $ratingIndicator = createRatingIndicator(averageRating);
  document.querySelector("#rating-average").textContent =
    averageRating.toFixed(1);
  document.querySelector("#rating-indicator").appendChild($ratingIndicator);
  document.querySelector("#rating-count").textContent = place.reviews.length;

  // Lista de avaliações
  const $reviewsContainer = document.querySelector("#reviews");
  for (const review of place.reviews) {
    const $review = createReviewCard(review);
    $reviewsContainer.appendChild($review);
  }
}

switch (window.location.pathname) {
  /**
   * Código para a página inicial
   */
  case "/":
  case "/index.html":
    loadHomePage();
    break;
  /**
   * Código para a página de detalhes
   */
  case "/detalhe.html":
    loadDetailPage();
    break;
}
