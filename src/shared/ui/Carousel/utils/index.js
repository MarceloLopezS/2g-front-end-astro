export const isDisplayed = (element) => {
  if (element.parentElement == null) return true;
  if (window.getComputedStyle(element).display === "none") return false;

  return isDisplayed(element.parentElement)
}