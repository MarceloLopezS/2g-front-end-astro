import { getDomElement, getAllDomElements } from "../../../shared/utils/pure"

const toggleNavbarMenu = ({
  navListElement,
  navMenuTogglerElement,
  navExpandIconElement,
  navCloseIconElement
}) => {
  return event => {
    /* 
      Menu can only be toggled by elements that have navMenuToggler 
      or a navList's item(li) as ancestor
    */
    if (
      !(
        event.target.closest("button") === navMenuTogglerElement ||
        [...getAllDomElements("li", navListElement)].some(
          li => event.target.closest("li") === li
        )
      )
    )
      return

    if (window.innerWidth < 1008) {
      navMenuTogglerElement.getAttribute("aria-expanded") === "true"
        ? navMenuTogglerElement.setAttribute("aria-expanded", "false")
        : navMenuTogglerElement.setAttribute("aria-expanded", "true")
      navCloseIconElement.toggleAttribute("data-visible")
      navExpandIconElement.toggleAttribute("data-visible")
      navListElement.toggleAttribute("data-expanded")
    }
  }
}

const enableNavbarMenuToggle = ({
  navbarSelector,
  navListSelector,
  navMenuTogglerSelector,
  navExpandIconSelector,
  navCloseIconSelector
}) => {
  const navbar = getDomElement(navbarSelector)
  const navList = getDomElement(navListSelector, navbar)
  const navMenuToggler = getDomElement(navMenuTogglerSelector, navbar)
  const navExpandIcon = getDomElement(navExpandIconSelector, navbar)
  const navCloseIcon = getDomElement(navCloseIconSelector, navbar)

  const toggleMenuElements = {
    navListElement: navList,
    navMenuTogglerElement: navMenuToggler,
    navExpandIconElement: navExpandIcon,
    navCloseIconElement: navCloseIcon
  }

  navbar.addEventListener("click", toggleNavbarMenu(toggleMenuElements))
}

export default enableNavbarMenuToggle
