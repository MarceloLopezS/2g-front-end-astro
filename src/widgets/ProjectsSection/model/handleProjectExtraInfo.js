import { getDomElement, getAllDomElements } from "../../../shared/utils/pure";

const toggleProjectExtraInfo = ({
  cardSelector,
  cardBodySelector,
  cardInfoButtonSelector
}) => {
  return (event) => {
    if (event.target.closest(cardInfoButtonSelector) == null) return;

    const card = event.target.closest(cardSelector);
    const bodyDivs = getAllDomElements(cardBodySelector, card);

    bodyDivs.forEach(div => div.toggleAttribute("data-show"))
  }
}

const handleProjectExtraInfo = ({
  projectsWrapper,
  cardSelector,
  cardBodySelector,
  cardInfoButtonSelector
}) => {
  const projectsGrid = getDomElement(projectsWrapper);

  projectsGrid.addEventListener(
    "click", toggleProjectExtraInfo({
      cardSelector,
      cardBodySelector,
      cardInfoButtonSelector
    })
  );
}

export default handleProjectExtraInfo