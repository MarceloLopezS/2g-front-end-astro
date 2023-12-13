export const MAIN_SECTIONS_OPTIONS =
  window.innerWidth >= 1008
    ? {
      root: null,
      rootMargin: "-27% 0px -25% 0px",
      threshold: 0.22,
    }
    : {
      root: null,
      rootMargin: "-25% 0px -30% 0px",
      threshold: 0.07,
    };

export const HERO_SECTION_OPTIONS = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3
}