import { getDomElement, isDomElementNode } from "../../../shared/utils/pure"

const removeInvalidClass =
  (inputStatusDisplayerSelector, customSelectStatusDisplayerSelector) =>
  event => {
    const statusDisplayerSelector =
      event.target.closest(customSelectStatusDisplayerSelector) ??
      event.target.closest(inputStatusDisplayerSelector)

    if (!isDomElementNode(statusDisplayerSelector)) return

    if ([...statusDisplayerSelector.classList].includes("invalid")) {
      statusDisplayerSelector.classList.remove("invalid")
    }
  }

const handleInputStatusReset = ({
  formSelector,
  inputStatusDisplayerSelector,
  customSelectStatusDisplayerSelector
}) => {
  const form = getDomElement(formSelector)

  form.addEventListener(
    "focusin",
    removeInvalidClass(
      inputStatusDisplayerSelector,
      customSelectStatusDisplayerSelector
    )
  )
}

export default handleInputStatusReset
