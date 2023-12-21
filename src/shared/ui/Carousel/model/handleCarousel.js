import { isDomElementNode } from "../../../utils/pure";
import { isDisplayed } from "../utils";
import { PROPERTY, DURATION, TIMING_FUNCTION } from "../config/SlideTransition";
import {
  XS_BREAKPOINT,
  S_BREAKPOINT,
  L_BREAKPOINT,
  XL_BREAKPOINT,
  XXL_BREAKPOINT
} from "../config/ScreenSizeBreakpoints";

const setTrackLength = ({ carouselTrack, slides }, direction) => {
  const totalSlides = slides.length;

  if (direction === "to top" || direction === "to bottom") {
    carouselTrack.style.height = `${totalSlides * 100}%`;
  } else if (direction === "to left" || direction === "to right") {
    carouselTrack.style.width = `${totalSlides * 100}%`;
  }
}

const initInfiniteTrackPosition = (
  { carouselTrack, slides },
  { flowAxis, flowDirection }
) => {
  const totalSlides = slides.length;

  carouselTrack.style.transform =
    `translate${flowAxis}(${flowDirection}${100 / totalSlides}%)`;
}

const adjustAutoTrackPosition = (
  { carouselTrack, slides },
  { flowAxis, flowDirection }
) => {
  let trackAdjustTimeout = setTimeout(() => {
    const nextSlideInsertionPlace =
      flowDirection === "-" ? "beforeend" : "afterbegin";
    const totalSlides = slides.length;
    const firstSlide = slides[0];

    carouselTrack.style.transition = 'none';
    carouselTrack.insertAdjacentElement(nextSlideInsertionPlace, firstSlide);
    if (totalSlides > 2) {
      carouselTrack.style.transform =
        `translate${flowAxis}(${flowDirection}${100 / totalSlides}%)`;
    } else {
      carouselTrack.style.transform = `translate${flowAxis}(0%)`;;
    }
  }, DURATION)

  return trackAdjustTimeout
}

const nextAutoSlide = (
  { carouselTrack, slides },
  { flowAxis, flowDirection }
) => {
  const totalSlides = slides.length;

  carouselTrack.style.transition =
    `${PROPERTY} ${DURATION}ms ${TIMING_FUNCTION}`;
  if (totalSlides > 2) {
    carouselTrack.style.transform =
      `translate${flowAxis}(${flowDirection}${(100 / totalSlides) * 2}%)`;
  } else {
    carouselTrack.style.transform =
      `translate${flowAxis}(${flowDirection}${(100 / totalSlides)}%)`;
  }
  adjustAutoTrackPosition(
    { carouselTrack, slides }, { flowAxis, flowDirection }
  );
}

const handleAutoSlide = (
  { carouselTrack, slides },
  { direction, delay }
) => {
  const flowAxis = direction === "to top" || direction === "to bottom"
    ? "Y" : "X";
  const flowDirection = direction === "to top" || direction === "to left"
    ? "-" : "+";

  initInfiniteTrackPosition(
    { carouselTrack, slides }, { flowAxis, flowDirection }
  );

  let carouselInterval = setInterval(() => {
    nextAutoSlide({ carouselTrack, slides }, { flowAxis, flowDirection })
  }, delay)

  return function autoSlideCleanup() {
    return clearInterval(carouselInterval)
  }
}

const setMultiItemTrackLength = (
  { carouselTrack, slides },
  { flowAxis, slidesInView }
) => {
  const totalSlides = slides.length;
  const itemPercentage = 100 / slidesInView;

  if (flowAxis === "X") {
    carouselTrack.style.width = `${totalSlides * itemPercentage}%`;
    [...slides].forEach(
      slide => slide.style.width = `${100 / slidesInView}%`
    );
  } else if (flowAxis === "Y") {
    carouselTrack.style.height = `${totalSlides * itemPercentage}%`;
    [...slides].forEach(
      slide => slide.style.height = `${100 / slidesInView}%`
    );
  }
}

const initMultiItemTrackPosition = (
  { carouselTrack, slides },
  { flowAxis, flowDirection, maxItemsOnView }
) => {
  let slidesInView;
  const totalSlides = slides.length;

  const isScreenXS = window.matchMedia(XS_BREAKPOINT).matches;
  const isScreenS = window.matchMedia(S_BREAKPOINT).matches;
  const isScreenL = window.matchMedia(L_BREAKPOINT).matches;
  const isScreenXL = window.matchMedia(XL_BREAKPOINT).matches;
  const isScreenXXL = window.matchMedia(XXL_BREAKPOINT).matches;

  if (isScreenXS) slidesInView = 1;
  else if (isScreenS) slidesInView = 2;
  else if (isScreenL) slidesInView = 3;
  else if (isScreenXL) slidesInView = 4;
  else if (isScreenXXL) slidesInView = maxItemsOnView;

  setMultiItemTrackLength(
    { carouselTrack, slides }, { flowAxis, slidesInView }
  );

  if (flowDirection === "+") {
    carouselTrack.style.transform =
      `translate${flowAxis}(-${100 / totalSlides - slidesInView}%)`
  }
}

const handleManualSlide = (
  { carouselTrack, slides },
  { direction, maxItemsOnView }
) => {
  const flowAxis = direction === "to top" || direction === "to bottom"
    ? "Y" : "X";
  const flowDirection = direction === "to top" || direction === "to left"
    ? "-" : "+";

  initMultiItemTrackPosition(
    { carouselTrack, slides }, { flowAxis, flowDirection, maxItemsOnView }
  )
  // const prevButton = getDomElement("button[data-previous]", carousel);
  // const nextButton = getDomElement("button[data-next]", carousel);

  // prevButton.addEventListener("click", prevSlide);
  // nextButton.addEventListener("click", nextSlide);
}

const handleCarousel = (carousel) => {
  if (!isDomElementNode(carousel)) {
    console.warn("Expected a DOM Element to use as Carousel.");
    return
  }

  if (!isDisplayed(carousel)) return;

  const carouselTrack = [...carousel.children].filter(
    child => child.hasAttribute("data-carousel-track")
  )[0];
  if (!isDomElementNode(carouselTrack)) {
    console.warn("Selected Carousel has no valid track.");
    return
  }

  const slides = carouselTrack.children;
  if (slides.length < 0) {
    console.warn("There are no slides in the selected Carousel.")
    return
  }

  const direction = carousel.getAttribute("data-direction");
  const maxItemsOnView = carousel.getAttribute("data-max-items-on-view") ?? 1;
  const autoSlideDelay = carousel.getAttribute("data-auto-slide-delay");

  if (autoSlideDelay) {
    setTrackLength({ carouselTrack, slides }, direction);
    return handleAutoSlide(
      { carouselTrack, slides }, { direction, delay: autoSlideDelay }
    );
  } else {
    handleManualSlide(
      { carouselTrack, slides }, { direction, maxItemsOnView }
    )
  }
}

export default handleCarousel