import { getDomElement } from "../../../shared/utils/pure"

const handleDialogAnimationEnd = (dialog) => {
  return function handleDialogAnimationEndCurry() {
    dialog.removeAttribute('data-hide');
    dialog.close();
    dialog.removeEventListener('animationend', handleDialogAnimationEndCurry)
  }
}

const closeDialog = (dialog) => {
  return () => {
    dialog.setAttribute('data-hide', '');
    dialog.addEventListener('animationend', handleDialogAnimationEnd(dialog))
  }
}

const handleFloatingChat = ({
  togglerBtnSelector,
  dialogSelector,
  closeBtnSelector,
  messageFormSelector,
  messageInputSelector
}) => {
  const dom_toggler = getDomElement(togglerBtnSelector)
  const dom_dialog = getDomElement(dialogSelector)
  const dom_closeButton = getDomElement(closeBtnSelector)
  const dom_messageForm = getDomElement(messageFormSelector)

  const closeDialogOnEscKey = (e) => {
    if (!dom_dialog.hasAttribute("open")) return

    if (e.key === 'Escape') {
      e.preventDefault();
      closeDialog(dom_dialog)()
    }
  }

  const handleMessageSubmit = (e) => {
    const dom_messageInput =
      getDomElement(messageInputSelector, dom_messageForm)

    if (dom_messageInput.value === "") return e.preventDefault()

    closeDialog(dom_dialog)()
    dom_messageForm.reset()
  }

  dom_toggler.addEventListener("click", () => {
    if (dom_dialog.hasAttribute("open")) {
      dom_dialog.removeEventListener("keydown", closeDialogOnEscKey)
      dom_messageForm.removeEventListener("submit", handleMessageSubmit)

      closeDialog(dom_dialog)()
      return
    }

    dom_dialog.show()
    dom_dialog.addEventListener("keydown", closeDialogOnEscKey)
    dom_messageForm.addEventListener("submit", handleMessageSubmit)
  })

  dom_closeButton.addEventListener("click", closeDialog(dom_dialog))
}

export default handleFloatingChat