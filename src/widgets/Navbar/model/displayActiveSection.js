import { getAllDomElements } from "../../../shared/utils/pure"
import { MAIN_SECTIONS_OPTIONS } from "../config/ObserverOptions"

const setActiveNavLink = navAnchorsSelector => entries => {
  const navAnchors = getAllDomElements(navAnchorsSelector)

  if (navAnchors.length < 0) {
    console.warn(
      "There are no selected anchors in Navbar. Can't track an active section."
    )
    return
  }

  entries.forEach(entry => {
    if (!entry.isIntersecting) return

    navAnchors.forEach(anchor => {
      const anchorHref = anchor.getAttribute("href")

      anchorHref.includes(entry.target.id)
        ? anchor.parentElement.classList.add("active")
        : anchor.parentElement.classList.remove("active")
    })
  })
}

const displayActiveSection = (navAnchorsSelector, sectionsSelector) => {
  const mainSections = getAllDomElements(sectionsSelector)

  if (mainSections.length < 0) {
    console.warn(
      "There are no sections to observe and mark as active in the Navbar."
    )
    return
  }

  const sectionsObserver = new IntersectionObserver(
    setActiveNavLink(navAnchorsSelector),
    MAIN_SECTIONS_OPTIONS
  )

  mainSections.forEach(section => {
    sectionsObserver.observe(section)
  })
}

export default displayActiveSection
