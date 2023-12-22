import { isDomElementNode, getDomElement } from "../../../utils/pure";
import { PREV_BUTTON, NEXT_BUTTON } from "../config/DOMSelectors";
import { NEGATIVE } from "../config/FlowDirection";
import { isDisplayed, getFlowAxis, getFlowDirection } from "../utils";
import handleLinearTrack from "./trackHandlers/handleLinearTrack";
import handleInfiniteTrack from "./trackHandlers/handleInfiniteTrack";

const handleCarousel = (carousel) => {
  if (!isDomElementNode(carousel)) {
    console.warn("Expected a DOM Element to use as Carousel.");
    return
  }

  if (!isDisplayed(carousel)) return;

  const trackType = carousel.getAttribute("data-track-type");
  const direction = carousel.getAttribute("data-direction");
  const flowAxis = getFlowAxis(direction);
  const flowDirection = getFlowDirection(direction);
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

  if (trackType === "linear") {
    const maxItemsOnView =
      carousel.getAttribute("data-max-items-on-view") ?? 1;
    const prevButton = getDomElement(
      flowDirection === NEGATIVE ? PREV_BUTTON : NEXT_BUTTON,
      carousel
    );
    const nextButton = getDomElement(
      flowDirection === NEGATIVE ? NEXT_BUTTON : PREV_BUTTON,
      carousel
    );

    handleLinearTrack(
      { carouselTrack, slides, prevButton, nextButton },
      { flowAxis, flowDirection, maxItemsOnView }
    )
  }
  if (trackType === "infinite") {
    const autoSlideDelay = carousel.getAttribute("data-auto-slide-delay");

    handleInfiniteTrack(
      { carouselTrack, slides },
      { flowAxis, flowDirection, autoSlideDelay }
    )
  }
}

export default handleCarousel