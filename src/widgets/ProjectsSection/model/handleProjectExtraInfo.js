import { getDomElement, getAllDomElements } from "../../../shared/utils/pure";

const toggleProjectExtraInfo = (cardSelector, cardBodySelector) => {
  return (event) => {
    if (event.target.tagName !== "BUTTON") return;

    const card = event.target.closest(cardSelector);
    const bodyDivs = getAllDomElements(cardBodySelector, card);

    bodyDivs.forEach(div => div.toggleAttribute("data-show"))
  }
}

const handleProjectExtraInfo = ({
  projectsGridSelector,
  cardSelector,
  cardBodySelector
}) => {
  const projectsGrid = getDomElement(projectsGridSelector);

  projectsGrid.addEventListener(
    "click", toggleProjectExtraInfo(cardSelector, cardBodySelector)
  );
}

export default handleProjectExtraInfo