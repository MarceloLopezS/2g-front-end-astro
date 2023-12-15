import { getDomElement } from "../../../utils/pure"

const handleCarousel = (carouselSelector) => {
  const carousel = getDomElement(carouselSelector);
  const slidesContainer = [...carousel.children].filter(
    child => child.tagName !== "BUTTON"
  )[0];
  const slides = slidesContainer.children;

  const totalSlides = slides.length;

  [...slides].forEach(slide => {
    console.log(slide)
  })
}

export default handleCarousel