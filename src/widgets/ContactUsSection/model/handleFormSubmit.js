import { getDomElement, isDomElementNode } from "../../../shared/utils/pure"
import { REQUEST_URL, METHOD, HEADERS } from "../config/ApiRequestParams"
import sendFormData from "../api/sendFormData"

const clearServerResponse = serverResponseContainer => {
  serverResponseContainer.textContent = ""
  serverResponseContainer.removeAttribute("data-success")
  serverResponseContainer.removeAttribute("data-danger")
}

const validateInputs = ({
  serviceOfInterest,
  clientName,
  email,
  company,
  city,
  clientMessage
}) => {
  let isFormValid = true

  if (serviceOfInterest.value === "-") {
    isFormValid = false
    serviceOfInterest.parentElement.classList.add("invalid")
  }

  ;[clientName, email, company, city, clientMessage].forEach(input => {
    if (!input.value) {
      isFormValid = false
      input.parentElement.classList.add("invalid")
    }
  })

  if (email.value) {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!email.value.match(regex)) {
      isFormValid = false
      email.parentElement.classList.add("invalid")
      email.setAttribute("placeholder", "Por favor inserta un correo válido")
      email.value = ""
    }
  }

  return isFormValid
}

const handleApiRequest =
  ({
    serviceSelectSelector,
    nameInputSelector,
    emailInputSelector,
    companyInputSelector,
    cityInputSelector,
    messageTextAreaSelector,
    serverResponseContainerSelector,
    loaderSelector
  }) =>
  async event => {
    event.preventDefault()

    const serviceOfInterest = getDomElement(serviceSelectSelector, event.target)
    const clientName = getDomElement(nameInputSelector, event.target)
    const email = getDomElement(emailInputSelector, event.target)
    const company = getDomElement(companyInputSelector, event.target)
    const city = getDomElement(cityInputSelector, event.target)
    const clientMessage = getDomElement(messageTextAreaSelector, event.target)
    const serverResponseContainer = getDomElement(
      serverResponseContainerSelector,
      event.target
    )

    if (!isDomElementNode(serviceOfInterest))
      return console.error("Invalid services select menu selector.")
    if (!isDomElementNode(clientName))
      return console.error("Invalid client name input selector.")
    if (!isDomElementNode(email))
      return console.error("Invalid email input selector.")
    if (!isDomElementNode(company))
      return console.error("Invalid company name input selector.")
    if (!isDomElementNode(city))
      return console.error("Invalid city name input selector.")
    if (!isDomElementNode(clientMessage))
      return console.error("Invalid client message textarea selector.")
    if (!isDomElementNode(serverResponseContainer))
      return console.error("Invalid server response container selector.")

    clearServerResponse(serverResponseContainer)
    const isFormValid = validateInputs({
      serviceOfInterest,
      clientName,
      email,
      company,
      city,
      clientMessage
    })

    if (!isFormValid) return

    const loader = getDomElement(loaderSelector, event.target)
    const submitButton = getDomElement("button[type='submit']")

    loader.setAttribute("data-show", "")
    submitButton.disabled = true

    const formData = {
      serviceOfInterest: serviceOfInterest.value,
      clientName: clientName.value,
      email: email.value,
      company: company.value,
      city: city.value,
      message: clientMessage.value
    }

    const responseData = await sendFormData(REQUEST_URL, {
      method: METHOD,
      body: JSON.stringify(formData),
      headers: HEADERS
    })

    if (
      typeof responseData === "string" &&
      responseData.includes("Fetch error")
    ) {
      loader.removeAttribute("data-show")
      console.error(responseData)
      serverResponseContainer.textContent =
        "Hubo un inconveniente al procesar la solicitud. Por favor, vuelva a intentar en unos momentos."
      serverResponseContainer.setAttribute("data-danger", "")
      submitButton.disabled = false
      return
    }

    if (!responseData) {
      serverResponseContainer.textContent =
        "No hemos podido recibir la respuesta del servidor. Por favor intente más tarde."
      return
    }

    loader.removeAttribute("data-show")
    const { success, message } = responseData

    serverResponseContainer.textContent = message
    if (success === "true") {
      serverResponseContainer.removeAttribute("data-danger")
      serverResponseContainer.setAttribute("data-success", "")
      submitButton.disabled = true
    } else if (success === "false") {
      serverResponseContainer.removeAttribute("data-success")
      serverResponseContainer.setAttribute("data-danger", "")
      submitButton.disabled = false
    }
  }

const handleFormSubmit = (
  formSelector,
  {
    serviceSelectSelector,
    nameInputSelector,
    emailInputSelector,
    companyInputSelector,
    cityInputSelector,
    messageTextAreaSelector,
    serverResponseContainerSelector,
    loaderSelector
  }
) => {
  const form = getDomElement(formSelector)
  const submitHandlerArgs = {
    serviceSelectSelector,
    nameInputSelector,
    emailInputSelector,
    companyInputSelector,
    cityInputSelector,
    messageTextAreaSelector,
    serverResponseContainerSelector,
    loaderSelector
  }

  form.addEventListener("submit", handleApiRequest(submitHandlerArgs))
}

export default handleFormSubmit
