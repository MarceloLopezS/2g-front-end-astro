import { getAllDomElements, getDomElement, isDomElementNode } from "../../../shared/utils/pure";

const toggleAdditionalDescription = ({
  slidesContainerSelector,
  textSlidesSelector,
  extraInfoButtonSelector
}) => (event) => {
  if (event.target.closest(extraInfoButtonSelector) == null) return;

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
  textSlidesSelector,
  extraInfoButtonSelector
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
    toggleAdditionalDescription({
      slidesContainerSelector,
      textSlidesSelector,
      extraInfoButtonSelector
    })
  )
}

export default handleAdditionalDescriptionToggle