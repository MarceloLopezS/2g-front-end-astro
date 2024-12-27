import { HORIZONTAL, VERTICAL } from "../config/FlowAxis"
import { POSITIVE, NEGATIVE } from "../config/FlowDirection"

export const isDisplayed = element => {
  if (element.parentElement == null) return true
  if (window.getComputedStyle(element).display === "none") return false

  return isDisplayed(element.parentElement)
}

export const getFlowAxis = direction => {
  return direction === "to top" || direction === "to bottom"
    ? VERTICAL
    : HORIZONTAL
}

export const getFlowDirection = direction => {
  return direction === "to top" || direction === "to left" ? NEGATIVE : POSITIVE
}

export const showButton = button => {
  button.setAttribute("data-show", "")
}

export const hideButton = button => {
  button.removeAttribute("data-show")
}
