import { getDomElement } from "../../../shared/utils/pure"

const addVideoSource = (videoElement, videoSrc, videoType) => {
  const source = document.createElement("source")

  source.src = videoSrc
  source.type = videoType

  videoElement.appendChild(source)
}

const handleHeroVideoLoad = ({
  pictureSelector,
  videoSelector,
  videoSrc,
  videoType = "video/mp4",
  videoLoadMediaQuery
}) => {
  const mediaQuery = window.matchMedia(videoLoadMediaQuery)

  const bannerPicture = getDomElement(pictureSelector)
  const bannerVideo = getDomElement(videoSelector)

  if (!mediaQuery.matches) return bannerVideo.remove()

  if (!bannerPicture) {
    console.warn(
      "Unnable to handle banner video load: " + "Invalid picture selector."
    )
    return
  }
  if (!bannerVideo) {
    console.warn(
      "Unnable to handle banner video load: " + "Invalid video selector."
    )
    return
  }

  addVideoSource(bannerVideo, videoSrc, videoType)
  bannerPicture.remove()
}

export default handleHeroVideoLoad
