import { HORIZONTAL, VERTICAL } from "../../config/FlowAxis";
import { NEGATIVE, POSITIVE } from "../../config/FlowDirection";
import { L_BREAKPOINT, S_BREAKPOINT, XL_BREAKPOINT, XS_BREAKPOINT, XXL_BREAKPOINT } from "../../config/ScreenSizeBreakpoints";
import {
  PROPERTY,
  DURATION,
  TIMING_FUNCTION
} from "../../config/SlideTransition";
import { showButton } from "../../utils";

const setTrackLength = (
  { carouselTrack, slides },
  { flowAxis, slidesInView }
) => {
  const totalSlides = slides.length;
  const itemPercentage = 100 / slidesInView

  if (flowAxis === HORIZONTAL) {
    carouselTrack.style.width = `${totalSlides * itemPercentage}%`;
    [...slides].forEach(
      slide => slide.style.width = `${100 / slidesInView}`
    )
  } else if (flowAxis === VERTICAL) {
    carouselTrack.style.height = `${totalSlides * itemPercentage}%`;
    [...slides].forEach(
      slide => slide.style.height = `${100 / slidesInView}`
    )
  }
}

const initTrackPosition = (
  { carouselTrack, slides },
  { flowAxis, maxItemsOnView }
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

  setTrackLength({ carouselTrack, slides }, { flowAxis, slidesInView });

  carouselTrack.insertAdjacentElement("afterbegin", slides[slides.length - 1])
  carouselTrack.style.transform =
    `translate${flowAxis}(-${(100 / totalSlides)}%)`;
}

const adjustTrackPosition = (
  { carouselTrack, slides, prevButton, nextButton },
  { flowAxis, flowDirection }
) => {
  let trackAdjustTimeout = setTimeout(() => {
    const nextSlideInsertionPlace =
      flowDirection === NEGATIVE ? "beforeend" : "afterbegin";
    const totalSlides = slides.length;
    const slideToInsert =
      flowDirection === NEGATIVE ? slides[0] : slides[slides.length - 1]

    carouselTrack.style.transition = 'none';
    carouselTrack.insertAdjacentElement(nextSlideInsertionPlace, slideToInsert);
    if (totalSlides > 2) {
      carouselTrack.style.transform =
        `translate${flowAxis}(-${100 / totalSlides}%)`;
    } else {
      carouselTrack.style.transform = `translate${flowAxis}(0%)`;
    }

    prevButton.disabled = false
    nextButton.disabled = false
  }, DURATION)

  return trackAdjustTimeout
}

const nextSlide = (
  { carouselTrack, slides, prevButton, nextButton },
  { flowAxis, flowDirection }
) => {
  const totalSlides = slides.length;

  prevButton.disabled = true
  nextButton.disabled = true

  carouselTrack.style.transition =
    `${PROPERTY} ${DURATION}ms ${TIMING_FUNCTION}`;

  if (totalSlides > 2) {
    carouselTrack.style.transform =
      `translate${flowAxis}(${flowDirection}${flowDirection === NEGATIVE
        ? (100 / totalSlides) * 2
        : 0
      }%)`;
  } else {
    carouselTrack.style.transform =
      `translate${flowAxis}(${flowDirection}${flowDirection === NEGATIVE
        ? (100 / totalSlides)
        : 0
      }%)`;
  }

  const trackAdjustTimeout = adjustTrackPosition(
    { carouselTrack, slides, prevButton, nextButton }, { flowAxis, flowDirection }
  );

  return trackAdjustTimeout
}

const handleInfiniteTrack = (
  { carouselTrack, slides, prevButton, nextButton },
  { flowAxis, flowDirection, maxItemsOnView, autoSlideDelay, pauseOnView }
) => {
  let trackObserver;
  let carouselInterval;
  let trackAdjustTimeout;

  initTrackPosition(
    { carouselTrack, slides }, { flowAxis, flowDirection, maxItemsOnView }
  );

  const slidePass = flowDirection => (
    trackAdjustTimeout = nextSlide(
      { carouselTrack, slides, prevButton, nextButton }, { flowAxis, flowDirection }
    )
  )
  const toPrevSlide = () => (
    slidePass(flowDirection === NEGATIVE ? POSITIVE : NEGATIVE)
  )
  const toNextSlide = () => (
    slidePass(flowDirection === NEGATIVE ? NEGATIVE : POSITIVE)
  )

  prevButton.addEventListener("click", toPrevSlide)
  nextButton.addEventListener("click", toNextSlide)

  prevButton.hasAttribute("data-show") || showButton(prevButton)
  nextButton.hasAttribute("data-show") || showButton(nextButton)

  const setCarouselInterval = () => {
    carouselInterval = setInterval(() => {
      slidePass(flowDirection === NEGATIVE ? NEGATIVE : POSITIVE)
    }, autoSlideDelay)
  }

  if (pauseOnView) {
    const options = window.innerWidth <= 1008
      ? {
        root: null,
        rootMargin: `-10% 0px 10% 0px`,
        threshold: 0.12,
      }
      : window.innerWidth <= 1300 ?
        {
          root: null,
          rootMargin: `0px 0px 10% 0px`,
          threshold: 0.4,
        }
        : {
          root: null,
          rootMargin: `0px 0px 10% 0px`,
          threshold: 0.45,
        };

    trackObserver = new IntersectionObserver(
      (entries, observer) => {
        entries[0].isIntersecting
          ? clearInterval(carouselInterval)
          : setCarouselInterval()
      }
      , options
    )

    trackObserver.observe(carouselTrack)
  }

  return function autoSlideCleanup() {
    trackObserver instanceof IntersectionObserver
      && trackObserver.unobserve(carouselTrack)
    clearInterval(carouselInterval)
    clearTimeout(trackAdjustTimeout)
    prevButton.removeEventListener("click", toPrevSlide)
    nextButton.removeEventListener("click", toNextSlide)
  }
}

export default handleInfiniteTrack