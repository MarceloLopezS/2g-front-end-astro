export const getFormattedOptions = (optionElements) => {
  return [...optionElements].map(optionElement => {
    return {
      element: optionElement,
      value: optionElement.value,
      label: optionElement.label,
      selected: optionElement.selected
    }
  })
}

export const preventKeyDefault = (event) => {
  if (
    [
      "Space",
      "ArrowUp",
      "ArrowDown",
      "Escape",
      "Enter"
    ].indexOf(event.code) > -1
  ) {
    event.preventDefault();
  }
}