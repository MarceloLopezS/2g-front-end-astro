import { HORIZONTAL, VERTICAL } from "../../config/FlowAxis";
import { NEGATIVE } from "../../config/FlowDirection";
import {
  PROPERTY,
  DURATION,
  TIMING_FUNCTION
} from "../../config/SlideTransition";

const setTrackLength = ({ carouselTrack, slides }, flowAxis) => {
  const totalSlides = slides.length;

  if (flowAxis === HORIZONTAL) {
    carouselTrack.style.width = `${totalSlides * 100}%`;
  } else if (flowAxis === VERTICAL) {
    carouselTrack.style.height = `${totalSlides * 100}%`;
  }
}

const initTrackPosition = (
  { carouselTrack, slides },
  { flowAxis, flowDirection }
) => {
  const totalSlides = slides.length;

  setTrackLength({ carouselTrack, slides }, flowAxis);

  carouselTrack.style.transform =
    `translate${flowAxis}(${flowDirection}${100 / totalSlides}%)`;
}

const adjustTrackPosition = (
  { carouselTrack, slides },
  { flowAxis, flowDirection }
) => {
  let trackAdjustTimeout = setTimeout(() => {
    const nextSlideInsertionPlace =
      flowDirection === NEGATIVE ? "beforeend" : "afterbegin";
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

const nextSlide = (
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
  adjustTrackPosition(
    { carouselTrack, slides }, { flowAxis, flowDirection }
  );
}

const handleInfiniteTrack = (
  { carouselTrack, slides },
  { flowAxis, flowDirection, autoSlideDelay }
) => {
  initTrackPosition(
    { carouselTrack, slides }, { flowAxis, flowDirection }
  );

  let carouselInterval = setInterval(() => {
    nextSlide({ carouselTrack, slides }, { flowAxis, flowDirection })
  }, autoSlideDelay)

  return function autoSlideCleanup() {
    return clearInterval(carouselInterval)
  }
}

export default handleInfiniteTrack