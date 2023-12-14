import { getAllDomElements, getDomElement } from "../../../shared/utils/pure";

const toggleAdditionalDescription = (
  slidesContainerSelector,
  textSlidesSelector
) => (event) => {
  if (event.target.tagName !== "BUTTON") return;

  const targetButton = event.target;
  const slidesContainer = targetButton.closest(slidesContainerSelector);
  const textSlides = getAllDomElements(textSlidesSelector, slidesContainer);

  textSlides.forEach(slide => slide.toggleAttribute("data-show"))
}

const handleAdditionalDescriptionToggle = ({
  slidesContainerSelector,
  textSlidesSelector
}) => {
  const slidesContainer = getDomElement(slidesContainerSelector);

  slidesContainer.addEventListener(
    "click",
    toggleAdditionalDescription(slidesContainerSelector, textSlidesSelector)
  )
}

export default handleAdditionalDescriptionToggle