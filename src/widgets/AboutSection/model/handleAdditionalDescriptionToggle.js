import { getAllDomElements, getDomElement, isDomElementNode } from "../../../shared/utils/pure";

const toggleAdditionalDescription = (
  slidesContainerSelector,
  textSlidesSelector
) => (event) => {
  if (event.target.tagName !== "BUTTON") return;

  const targetButton = event.target;
  const slidesContainer = targetButton.closest(slidesContainerSelector);
  const textSlides = getAllDomElements(textSlidesSelector, slidesContainer);

  if (textSlides.length < 0) {
    console.warn(
      "There are no text slides selected on About Section description."
    )
    return
  }

  textSlides.forEach(slide => slide.toggleAttribute("data-show"))
}

const handleAdditionalDescriptionToggle = ({
  slidesContainerSelector,
  textSlidesSelector
}) => {
  const slidesContainer = getDomElement(slidesContainerSelector);

  if (!isDomElementNode(slidesContainer)) {
    console.warn(
      "There is no text slides container selected on About Section description."
    )
    return
  }

  slidesContainer.addEventListener(
    "click",
    toggleAdditionalDescription(slidesContainerSelector, textSlidesSelector)
  )
}

export default handleAdditionalDescriptionToggle