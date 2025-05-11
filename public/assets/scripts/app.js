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

// Funções para manipulação do carrossel de destaques
async function loadHighlightedPlaces() {
  try {
    const highlightedPlaces = await placesRepository.getHighlightedPlaces();
    const $highlightCarousel = document.querySelector("#hightlight-carousel");

    for (const [index, place] of highlightedPlaces.entries()) {
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

      const $indicator = createCarouselIndicator({
        carouselId: "#hightlight-carousel",
        label: place.name,
        index,
      });
      $highlightCarousel
        .querySelector(".carousel-indicators")
        .appendChild($indicator);
    }
  } catch (error) {
    console.error("Error loading highlighted places:", error);
    const $highlightCarousel = document.querySelector("#hightlight-carousel");
    $highlightCarousel.innerHTML =
      '<div class="alert alert-danger">Erro ao carregar destaques. Por favor, tente novamente mais tarde.</div>';
  }
}

// Funções para manipulação da lista de lugares
async function loadAllPlaces() {
  try {
    const allPlaces = await placesRepository.getAllPlaces();
    const $placeCardContainer = document.querySelector("#places");

    for (const place of allPlaces) {
      const $placeCard = createPlaceCard(place);
      const $wrapper = div("col-12 col-sm-6 col-md-4 col-lg-3 mb-3");
      $wrapper.appendChild($placeCard);
      $placeCardContainer.appendChild($wrapper);
    }
  } catch (error) {
    console.error("Error loading all places:", error);
    const $placeCardContainer = document.querySelector("#places");
    $placeCardContainer.innerHTML =
      '<div class="alert alert-danger">Erro ao carregar lugares. Por favor, tente novamente mais tarde.</div>';
  }
}

// Funções para manipulação da página de detalhes
function updatePlaceBasicInfo(place) {
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
}

function loadPlaceHighlights(highlights) {
  const $highlightList = document.querySelector("#place-highlights");
  for (const highlight of highlights) {
    const $highlightItem = div("list-group-item");
    $highlightItem.textContent = highlight;
    $highlightList.appendChild($highlightItem);
  }
}

function loadPlaceAmenities(amenities) {
  const $amenitiesList = document.querySelector("#place-amenities");
  for (const amenity of amenities) {
    const $amenityItem = div("list-group-item");
    $amenityItem.textContent = amenity;
    $amenitiesList.appendChild($amenityItem);
  }
}

function loadPlaceActivities(activities) {
  const $activitiesList = document.querySelector("#place-activities");
  for (const activity of activities) {
    const $activityItem = div("list-group-item");
    $activityItem.textContent = activity;
    $activitiesList.appendChild($activityItem);
  }
}

function loadPlaceLocation(location) {
  const $map = document.querySelector("#place-map");
  $map.appendChild(createMap(location.latitude, location.longitude));
}

function loadPlacePhotos(images) {
  const $photosCarousel = document.querySelector("#photos-carousel");
  for (const [index, photo] of images.entries()) {
    const $carouselItem = createCarouselItem({
      image: photo.src,
      index,
      name: photo.description,
    });
    $photosCarousel.querySelector(".carousel-inner").appendChild($carouselItem);

    const $indicator = createCarouselIndicator({
      carouselId: "#photos-carousel",
      label: photo.description,
      index,
    });
    $photosCarousel
      .querySelector(".carousel-indicators")
      .appendChild($indicator);
  }
}

function loadPlaceReviews(reviews) {
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const $ratingIndicator = createRatingIndicator(averageRating);

  document.querySelector("#rating-average").textContent =
    averageRating.toFixed(1);
  document.querySelector("#rating-indicator").appendChild($ratingIndicator);
  document.querySelector("#rating-count").textContent = reviews.length;

  const $reviewsContainer = document.querySelector("#reviews");
  for (const review of reviews) {
    const $review = createReviewCard(review);
    $reviewsContainer.appendChild($review);
  }
}

async function loadDetailPage() {
  try {
    const slug = getSearchParam("slug");
    const place = await placesRepository.getPlaceBySlug(slug);

    if (!place) {
      window.location.href = "/";
      return;
    }

    updatePlaceBasicInfo(place);
    loadPlaceHighlights(place.highlights);
    loadPlaceAmenities(place.info.amenities);
    loadPlaceActivities(place.info.activities);
    loadPlaceLocation(place.location);
    loadPlacePhotos(place.images);
    loadPlaceReviews(place.reviews);
  } catch (error) {
    console.error("Error loading place details:", error);
    const $mainContent = document.querySelector("main");
    $mainContent.innerHTML =
      '<div class="alert alert-danger">Erro ao carregar detalhes do lugar. Por favor, tente novamente mais tarde.</div>';
  }
}

async function loadHomePage() {
  await Promise.all([loadHighlightedPlaces(), loadAllPlaces()]);
}

// Inicialização da aplicação
async function initializeApp() {
  try {
    switch (window.location.pathname) {
      case "/":
      case "/index.html":
        await loadHomePage();
        break;
      case "/detalhe.html":
        await loadDetailPage();
        break;
    }
  } catch (error) {
    console.error("Error initializing application:", error);
    const $mainContent = document.querySelector("main");
    $mainContent.innerHTML =
      '<div class="alert alert-danger">Erro ao inicializar a aplicação. Por favor, tente novamente mais tarde.</div>';
  }
}

// Inicia a aplicação
initializeApp();
