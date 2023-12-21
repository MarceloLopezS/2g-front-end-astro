export const isDisplayed = (element) => {
  if (element.parentElement == null) return true;
  if (window.getComputedStyle(element).display === "none") return false;

  return isDisplayed(element.parentElement)
}

export const showButton = (button) => {
  button.setAttribute("data-show", "")
}

export const hideButton = (button) => {
  button.removeAttribute("data-show")
}