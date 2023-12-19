import { isDomElementNode } from "../../../utils/pure";
import { PROPERTY, DURATION, TIMING_FUNCTION } from "../config/SlideTransition";

const setTrackLength = ({ carouselTrack, slides }, direction) => {
  const totalSlides = slides.length;

  if (direction === "to top" || direction === "to bottom") {
    carouselTrack.style.height = `${totalSlides * 100}%`;
  } else if (direction === "to left" || direction === "to right") {
    carouselTrack.style.width = `${totalSlides * 100}%`;
  }
}

const initTrackPosition = (
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
    ? "-" : "";

  initTrackPosition({ carouselTrack, slides }, { flowAxis, flowDirection });

  let carouselInterval = setInterval(() => {
    nextAutoSlide({ carouselTrack, slides }, { flowAxis, flowDirection })
  }, delay)

  return function autoSlideCleanup() {
    return clearInterval(carouselInterval)
  }
}

const isDisplayed = (element) => {
  if (element.parentElement == null) return true;
  if (window.getComputedStyle(element).display === "none") return false;

  return isDisplayed(element.parentElement)
}

const handleCarousel = (carousel) => {
  if (!isDomElementNode(carousel)) {
    console.warn("Expected a DOM Element to use as Carousel.");
    return
  }

  if (!isDisplayed(carousel)) return;

  const carouselTrack = [...carousel.children].filter(
    child => child.tagName !== "BUTTON" && child.tagName === "DIV"
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
  const autoSlideDelay = carousel.getAttribute("data-auto-slide-delay");

  setTrackLength({ carouselTrack, slides }, direction);
  if (autoSlideDelay) {
    return handleAutoSlide(
      { carouselTrack, slides }, { direction, delay: autoSlideDelay }
    );
  }
}

export default handleCarousel