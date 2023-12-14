import { getAllDomElements } from "../../../shared/utils/pure";
import { MAIN_SECTIONS_OPTIONS } from "../config/ObserverOptions";

const setActiveNavLink = (navAnchorsSelector) => (entries) => {
  const navAnchors = getAllDomElements(navAnchorsSelector);

  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    navAnchors.forEach(anchor => {
      const anchorHref = anchor.getAttribute('href');

      anchorHref.includes(entry.target.id)
        ? anchor.parentElement.classList.add('active')
        : anchor.parentElement.classList.remove('active')
    })
  })
}

const displayActiveSection = (navAnchorsSelector) => {
  const mainSections = getAllDomElements("main > section");
  const sectionsObserver = new IntersectionObserver(
    setActiveNavLink(navAnchorsSelector), MAIN_SECTIONS_OPTIONS
  )

  mainSections.forEach(section => {
    sectionsObserver.observe(section)
  })
}

export default displayActiveSection