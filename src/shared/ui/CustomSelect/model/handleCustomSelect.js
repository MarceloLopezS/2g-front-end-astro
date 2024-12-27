import { getFormattedOptions, preventKeyDefault } from "../utils"

class Dropdown {
  constructor(selectElement) {
    this.selectElement = selectElement
    this.selectOptions = getFormattedOptions(
      this.selectElement.querySelectorAll("option")
    )
    this.createDropDownHtml()
    this.debounceTimeout = null
    this.searchTerm = ""
    this.addInteraction()
  }

  createDropDownHtml() {
    // Main properties (html elements)
    this.dropDownContainer = document.createElement("div")
    this.dropDownCurrentValue = document.createElement("span")
    this.dropDownList = document.createElement("ul")
    // Adding CSS classes
    this.dropDownContainer.classList.add("custom-dropdown-container")
    this.dropDownCurrentValue.classList.add("custom-dropdown-value")
    this.dropDownList.classList.add("custom-dropdown-list")
    // Dropdown node build
    this.dropDownCurrentValue.tabIndex = 0
    this.dropDownContainer.append(this.dropDownCurrentValue)
    this.dropDownCurrentValue.textContent = this.selectedOption.label
    this.dropDownContainer.append(this.dropDownList)
    this.selectOptions.forEach(option => {
      const optionElement = document.createElement("li")
      optionElement.classList.add("custom-dropdown-option")
      optionElement.classList.toggle("selected", option.selected)
      optionElement.setAttribute("data-value", option.value)
      optionElement.append(document.createTextNode(option.label))
      this.dropDownList.append(optionElement)
      // Event Listener
      const optionSelectAndHideDropDown = () => {
        this.selectOptionFromValueMatch(option.value)
        this.dropDownList.removeAttribute("data-show")
      }
      optionElement.addEventListener("click", optionSelectAndHideDropDown)
    })
    this.selectElement.after(this.dropDownContainer)
    // Hide default select
    this.selectElement.style.display = "none"
    // Main property (html element array)
    this.dropDownOptions = this.dropDownList.querySelectorAll("li")
  }

  get selectedOption() {
    return this.selectOptions.find(option => option.selected)
  }

  get selectedOptionIndex() {
    return this.selectOptions.indexOf(this.selectedOption)
  }

  selectOptionFromValueMatch(value) {
    const newSelectedOption = this.selectOptions.find(
      option => option.value === value
    )
    const prevSelectedOption = this.selectedOption

    prevSelectedOption.selected = false
    prevSelectedOption.element.selected = false
    newSelectedOption.selected = true
    newSelectedOption.element.selected = true
    this.dropDownCurrentValue.textContent = newSelectedOption.label

    const prevDropDownOptionSelected = this.dropDownList.querySelector(
      `[data-value='${prevSelectedOption.value}']`
    )
    const newDropDownOptionSelected = this.dropDownList.querySelector(
      `[data-value='${newSelectedOption.value}']`
    )

    prevDropDownOptionSelected.classList.remove("selected")
    newDropDownOptionSelected.classList.add("selected")
    newDropDownOptionSelected.scrollIntoView({ block: "nearest" })
  }

  toggleDropDown = () => {
    this.dropDownList.hasAttribute("data-show")
      ? this.dropDownList.removeAttribute("data-show")
      : this.dropDownList.setAttribute("data-show", "")
  }

  hideDropDown = () => {
    window.removeEventListener("keydown", preventKeyDefault)
    this.dropDownList.removeAttribute("data-show")
  }

  keyNavigate = event => {
    window.addEventListener("keydown", preventKeyDefault)
    switch (event.code) {
      case "Space": {
        this.toggleDropDown()
        break
      }
      case "ArrowUp": {
        const prevOption = this.selectOptions[this.selectedOptionIndex - 1]
        if (prevOption) {
          this.selectOptionFromValueMatch(prevOption.value)
        }
        break
      }
      case "ArrowDown": {
        const nextOption = this.selectOptions[this.selectedOptionIndex + 1]
        if (nextOption) {
          this.selectOptionFromValueMatch(nextOption.value)
        }
        break
      }
      case "Escape":
      case "Enter": {
        this.dropDownList.removeAttribute("data-show")
        break
      }
      default: {
        clearTimeout(this.debounceTimeout)
        this.searchTerm += event.key
        // Timeout
        this.debounceTimeout = setTimeout(() => {
          this.searchTerm = ""
        }, 500)

        const searchMatch = this.selectOptions.find(option => {
          return option.label.toLowerCase().startsWith(this.searchTerm)
        })
        if (searchMatch) {
          this.selectOptionFromValueMatch(searchMatch.value)
        }
      }
    }
  }

  addInteraction() {
    this.dropDownCurrentValue.addEventListener("click", this.toggleDropDown)
    this.dropDownCurrentValue.addEventListener("blur", this.hideDropDown)
    this.dropDownCurrentValue.addEventListener("keydown", this.keyNavigate)
  }

  unMount() {
    this.dropDownContainer.remove()
  }
}

export default Dropdown
