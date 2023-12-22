import {
  showButton,
  hideButton
} from "../../utils";
import { HORIZONTAL, VERTICAL } from "../../config/FlowAxis";
import { POSITIVE, NEGATIVE } from "../../config/FlowDirection";
import {
  XS_BREAKPOINT,
  S_BREAKPOINT,
  L_BREAKPOINT,
  XL_BREAKPOINT,
  XXL_BREAKPOINT
} from "../../config/ScreenSizeBreakpoints";

const setTrackLength = (
  { carouselTrack, slides },
  { flowAxis, slidesInView }
) => {
  const totalSlides = slides.length;
  const itemPercentage = 100 / slidesInView;

  if (flowAxis === HORIZONTAL) {
    carouselTrack.style.width = `${totalSlides * itemPercentage}%`;
    [...slides].forEach(
      slide => slide.style.width = `${100 / slidesInView}%`
    );
  } else if (flowAxis === VERTICAL) {
    carouselTrack.style.height = `${totalSlides * itemPercentage}%`;
    [...slides].forEach(
      slide => slide.style.height = `${100 / slidesInView}%`
    );
  }
}

const initTrack = (
  { carouselTrack, slides, prevButton },
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
  else if (isScreenS) slidesInView = maxItemsOnView < 2 ? maxItemsOnView : 2;
  else if (isScreenL) slidesInView = maxItemsOnView < 3 ? maxItemsOnView : 3;
  else if (isScreenXL) slidesInView = maxItemsOnView < 4 ? maxItemsOnView : 4;
  else if (isScreenXXL) slidesInView = maxItemsOnView;

  setTrackLength(
    { carouselTrack, slides }, { flowAxis, slidesInView }
  );

  if (flowDirection === POSITIVE) {
    carouselTrack.style.transform =
      `translate${flowAxis}(-${100 / totalSlides - slidesInView}%)`;
  } else {
    carouselTrack.style.transform = `translate${flowAxis}(0%)`
  }

  hideButton(prevButton)

  return slidesInView
}

const handleLinearTrack = (
  { carouselTrack, slides, prevButton, nextButton },
  { flowAxis, flowDirection, maxItemsOnView }
) => {
  let currentIndex = 0;

  const totalSlides = slides.length;
  const slidesInView = initTrack(
    { carouselTrack, slides, prevButton },
    { flowAxis, flowDirection, maxItemsOnView }
  )

  const goToSlide = (targetIndex) => {
    if (targetIndex < 0) return;
    if (targetIndex > totalSlides - slidesInView) return;

    const requiredTranslate = 100 / totalSlides * targetIndex;

    carouselTrack.style.transform =
      `translate${flowAxis}(${flowDirection}${requiredTranslate}%)`;
    currentIndex = targetIndex

    const hasPrevSlide = currentIndex !== 0;
    const hasNextSlide = currentIndex !== totalSlides - slidesInView;

    !hasPrevSlide
      ? hideButton(prevButton)
      : prevButton.hasAttribute("data-show") || showButton(prevButton);
    !hasNextSlide
      ? hideButton(nextButton)
      : nextButton.hasAttribute("data-show") || showButton(nextButton);
  }

  const prevSlide = () => goToSlide(currentIndex - 1);
  const nextSlide = () => goToSlide(currentIndex + 1);

  flowDirection === NEGATIVE ? showButton(nextButton) : showButton(prevButton);
  prevButton.addEventListener("click", prevSlide);
  nextButton.addEventListener("click", nextSlide);

  return function manualSlideCleanup() {
    prevButton.removeEventListener("click", prevSlide);
    nextButton.removeEventListener("click", nextSlide);
  }
}

export default handleLinearTrack