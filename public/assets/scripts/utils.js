/**
 * Generates a Google Maps embed URL for a given latitude and longitude.
 * @param {number} lat - The latitude of the location.
 * @param {number} lng - The longitude of the location.
 * @returns {string} The Google Maps embed URL.
 */
export function googleEmbedUrl(lat, lng) {
  return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
}

/**
 * Creates an iframe element with the specified URL and options.
 * @param {string} url - The URL to embed in the iframe.
 * @param {Object} [options] - Optional settings for the iframe.
 * @param {number} [options.width=600] - The width of the iframe.
 * @param {number} [options.height=450] - The height of the iframe.
 * @returns {HTMLIFrameElement} The created iframe element.
 */
export function iframe(url, options) {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.width = options?.width ?? 600;
  iframe.height = options?.height ?? 450;
  iframe.allowFullscreen = true;
  iframe.loading = "lazy";

  return iframe;
}

/**
 * Creates a div element with the specified class name and optional content.
 * @param {string} className - The class name to add to the div.
 * @param {string} [content] - Optional content to set as the inner HTML of the div.
 * @returns {HTMLDivElement} The created div element.
 */
export function div(className, content) {
  const div = document.createElement("div");
  div.classList.add(...className.split(" "));
  if (content) {
    div.innerHTML = content;
  }
  return div;
}

/**
 * Creates an img element with the specified source and alt text.
 * @param {string} src - The source URL of the image.
 * @param {string} alt - The alt text for the image.
 * @returns {HTMLImageElement} The created img element.
 */
export function img(src, alt) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;

  return img;
}

/**
 * Creates a map container with an embedded Google Map iframe.
 * @param {number} lat - The latitude of the location.
 * @param {number} lng - The longitude of the location.
 * @param {Object} [options] - Optional settings for the iframe.
 * @param {number} [options.width=600] - The width of the iframe.
 * @param {number} [options.height=450] - The height of the iframe.
 * @returns {HTMLDivElement} The created map container element.
 */
export function createMap(lat, lng, options) {
  const mapContainer = document.createElement("div");
  mapContainer.classList.add("map-container");

  const mapUrl = googleEmbedUrl(lat, lng);
  const mapIframe = iframe(mapUrl, options);

  mapContainer.appendChild(mapIframe);
  return mapContainer;
}

/**
 * Gets the value of a specific URL search parameter.
 * @param {string} param - The name of the search parameter to retrieve.
 * @returns {string|null} The value of the search parameter, or null if not found.
 */
export function getSearchParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Creates a carousel caption element for a place.
 * @param {Object} options - The place object containing name and description.
 * @param {string} options.name - The name of the place.
 * @param {string} options.description - The description of the place.
 * @returns {HTMLDivElement} The created carousel caption element.
 */
export function createCarouselCaption(options) {
  const $carouselCaption = div("carousel-caption");
  $carouselCaption.classList.add("d-none", "d-md-block");

  const $caption = document.createElement("h3");
  $caption.textContent = options.name;
  $carouselCaption.appendChild($caption);

  const $description = document.createElement("p");
  $description.textContent = options.description;
  $carouselCaption.appendChild($description);

  return $carouselCaption;
}

/**
 * Creates a carousel indicator button for a place.
 * @param {Object} options - The place object containing name and index.
 * @param {string} options.carouselId - The ID of the carousel.
 * @param {number} options.index - The index of the place in the carousel.
 * @param {string} options.label - The label for the indicator button.
 * @returns {HTMLButtonElement} The created carousel indicator button.
 */
export function createCarouselIndicator(options) {
  const $button = document.createElement("button");
  $button.setAttribute("type", "button");
  $button.setAttribute("data-bs-target", options.carouselId);
  $button.setAttribute("data-bs-slide-to", options.index);
  if (options.index === 0) {
    $button.classList.add("active");
    $button.setAttribute("aria-current", "true");
  }
  $button.setAttribute("aria-label", options.label);
  return $button;
}

/**
 * Creates a carousel item for a place.
 * @param {Object} options - The place object containing name and index.
 * @param {string} options.image - The image URL of the place.
 * @param {string} options.href - The URL to navigate to when the item is clicked.
 * @param {string} [options.name] - The name of the place.
 * @param {string} [options.description] - The description of the place.
 * @param {number} options.index - The index of the place in the carousel.
 * @returns {HTMLDivElement} The created carousel item element.
 */
export function createCarouselItem(options) {
  const $carouselItem = div("carousel-item");
  if (options.index === 0) $carouselItem.classList.add("active");

  const $img = img(options.image, options.name);
  $img.classList.add("d-block", "w-100");
  $carouselItem.appendChild($img);

  const $link = document.createElement("a");
  $link.setAttribute("href", options.href);
  $link.classList.add("stretched-link");
  $carouselItem.appendChild($link);

  if (options.name && options.description) {
    const $carouselCaption = createCarouselCaption({ name: options.name, description: options.description });
    $carouselItem.appendChild($carouselCaption);
  }

  return $carouselItem;
}

export function createRatingIndicator(rating, { max = 5 } = {}) {
  const $rating = div("d-flex gap-1");

  for (let i = 0; i < max; i++) {
    const $circle = document.createElement("span");
    $circle.classList.add("rounded-circle", "border", "border-primary");
    $circle.style.width = "1rem";
    $circle.style.height = "1rem";

    if (Math.round(i + 1) <= rating) {
      $circle.classList.add("bg-primary");
    }

    $rating.appendChild($circle);
  }

  return $rating;
}

export function createPlaceCard(place) {
  const $img = img(place.thumbnail, place.name);
  $img.classList.add("card-img-top");

  const $cardTitle = document.createElement("h5");
  $cardTitle.classList.add("card-title");
  $cardTitle.textContent = place.name;

  const $cardText = document.createElement("p");
  $cardText.classList.add("card-text");
  $cardText.textContent = place.description.substring(0, 100) + "...";

  const $cardLink = document.createElement("a");
  $cardLink.setAttribute("href", `/detalhe.html?slug=${place.slug}`);
  $cardLink.textContent = "Ver mais";

  const $cardBody = div("card-body");
  $cardBody.appendChild($cardTitle);
  $cardBody.appendChild($cardText);
  $cardBody.appendChild($cardLink);

  const $card = div("card");
  $card.appendChild($img);
  $card.appendChild($cardBody);

  return $card;
}

export function createReviewCard(review) {
  const $review = div("card mb-3");
  const $reviewBody = div("card-body");

  const $header = div("d-flex justify-content-between align-items-center");
  const $reviewTitle = document.createElement("h5");
  $reviewTitle.classList.add("card-title");
  $reviewTitle.textContent = review.reviewer;
  $header.appendChild($reviewTitle);

  const $reviewRating = createRatingIndicator(review.rating);
  $header.appendChild($reviewRating);
  $reviewBody.appendChild($header);

  const $reviewText = document.createElement("p");
  $reviewText.classList.add("card-text");
  $reviewText.textContent = review.review;
  $reviewBody.appendChild($reviewText);

  $review.appendChild($reviewBody);

  return $review;
}
