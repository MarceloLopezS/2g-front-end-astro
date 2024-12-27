import { getAllDomElements, getDomElement } from "../../../shared/utils/pure"
import { HERO_SECTION_OPTIONS } from "../config/ObserverOptions"

const controlNavbarDisplay = ({
  heroSectionSelector,
  navbarSelector,
  certificateLogoSelector,
  brandLogoSelector
}) => {
  let lastScrollTop, navbarHideTimeout

  const heroSection = getDomElement(heroSectionSelector)
  const navbar = getDomElement(navbarSelector)
  const certificateLogo = getDomElement(certificateLogoSelector)
  const brandLogo = getDomElement(brandLogoSelector)

  const screenOrientation = window.screen.orientation

  const setNavbarHideTimeout = () => {
    clearTimeout(navbarHideTimeout)

    navbarHideTimeout = setTimeout(() => {
      navbar.setAttribute("data-slide", "up")
    }, 2000)
  }

  const clearNavbarHideTimeout = () => {
    clearTimeout(navbarHideTimeout)
  }

  const showHideNavbar = () => {
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop

    if (currentScrollTop > lastScrollTop) {
      navbar.setAttribute("data-slide", "up")
      clearTimeout(navbarHideTimeout)
    } else {
      navbar.setAttribute("data-slide", "down")
      clearTimeout(navbarHideTimeout)
      setNavbarHideTimeout()
      navbar.addEventListener("mouseenter", clearNavbarHideTimeout)
    }
    lastScrollTop = currentScrollTop
  }

  const navbarDynamicDisplay = ([entry]) => {
    if (entry.isIntersecting) {
      if (window.innerWidth >= 1008) {
        certificateLogo.setAttribute("data-show", "true")
        brandLogo.setAttribute("data-show", "false")
      } else {
        certificateLogo.setAttribute("data-show", "false")
        brandLogo.setAttribute("data-show", "true")
      }
      navbar.removeAttribute("data-theme")
      navbar.setAttribute("data-slide", "down")
      clearTimeout(navbarHideTimeout)
      document.removeEventListener("scroll", showHideNavbar)
      navbar.removeEventListener("mouseleave", setNavbarHideTimeout)
    } else if (!entry.isIntersecting) {
      if (window.innerWidth >= 1008) {
        navbar.setAttribute("data-theme", "inverse")
        certificateLogo.setAttribute("data-show", "false")
        brandLogo.setAttribute("data-show", "true")
        document.addEventListener("scroll", showHideNavbar)
        navbar.addEventListener("mouseleave", setNavbarHideTimeout)
      } else {
        navbar.setAttribute("data-slide", "down")
        certificateLogo.setAttribute("data-show", "false")
        brandLogo.setAttribute("data-show", "true")
      }
    }
  }

  const resetNavbarDynamicDisplay =
    (heroSectionObserver, heroSection) => () => {
      clearNavbarHideTimeout()
      document.removeEventListener("scroll", showHideNavbar)
      navbar.removeEventListener("mouseleave", setNavbarHideTimeout)
      navbar.removeEventListener("mouseenter", clearNavbarHideTimeout)
      heroSectionObserver.unobserve(heroSection)
      heroSectionObserver.observe(heroSection)
    }

  const handleOrientationChange = (heroSectionObserver, heroSection) => {
    if (!screenOrientation) {
      // For Safari
      window.addEventListener(
        "orientationchange",
        resetNavbarDynamicDisplay(heroSectionObserver, heroSection)
      )
    } else {
      screenOrientation.addEventListener(
        "change",
        resetNavbarDynamicDisplay(heroSectionObserver, heroSection)
      )
    }
  }

  const heroSectionObserver = new IntersectionObserver(
    navbarDynamicDisplay,
    HERO_SECTION_OPTIONS
  )

  heroSectionObserver.observe(heroSection)
  handleOrientationChange(heroSectionObserver, heroSection)
}

export default controlNavbarDisplay
