import { getDomElement } from "../../../shared/utils/pure";

const toggleMenu = (
  {
    menuToggleButtonSelector,
    navLinksSelector,
    navExpandIconSelector,
    navCloseIconSelector
  }
) => {
  return () => {
    if (window.innerWidth < 1008) {
      const menuToggleButton = getDomElement(menuToggleButtonSelector);
      const navLinks = getDomElement(navLinksSelector);
      const navExpandIcon = getDomElement(navExpandIconSelector);
      const navCloseIcon = getDomElement(navCloseIconSelector);

      menuToggleButton.getAttribute('aria-expanded') === 'true'
        ? menuToggleButton.setAttribute('aria-expanded', 'false')
        : menuToggleButton.setAttribute('aria-expanded', 'true')
      navCloseIcon.toggleAttribute('data-visible');
      navExpandIcon.toggleAttribute('data-visible');
      navLinks.toggleAttribute('data-expanded');
    }
  }
}

export default toggleMenu