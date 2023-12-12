export const getDomElement = (cssSelector, container = document) => {
  if (typeof cssSelector !== "string") {
    console.error(
      `cssSelector argument must be a string. Passed ${typeof cssSelector}.`
    )
    return null
  }

  return container.querySelector(cssSelector)
}