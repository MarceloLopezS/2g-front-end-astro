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
  closeBtnSelector
}) => {
  const dom_toggler = getDomElement(togglerBtnSelector)
  const dom_dialog = getDomElement(dialogSelector)
  const dom_closeButton = getDomElement(closeBtnSelector)

  const closeDialogOnEscKey = (e) => {
    if (!dom_dialog.hasAttribute("open")) return

    if (e.key === 'Escape') {
      e.preventDefault();
      closeDialog(dom_dialog)()
    }
  }

  dom_toggler.addEventListener("click", () => {
    if (dom_dialog.hasAttribute("open")) {
      dom_dialog.removeEventListener("keydown", closeDialogOnEscKey)
      closeDialog(dom_dialog)()
      return
    }

    dom_dialog.show()
    dom_dialog.addEventListener("keydown", closeDialogOnEscKey)
  })

  dom_closeButton.addEventListener("click", closeDialog(dom_dialog))
}

export default handleFloatingChat