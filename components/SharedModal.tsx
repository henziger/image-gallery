import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { variants } from "../utils/animationVariants";
import downloadPhoto from "../utils/downloadPhoto";
import { range } from "../utils/range";
import type { ImageProps, SharedModalProps } from "../utils/types";

// How many thumbnails to keep on each side of the current one in the bottom
// strip. Every thumbnail is a separate image-optimizer variant, and each new
// variant costs a full download of the original from Blob, so a wide window is
// expensive for photos the user only ever scrolls past. This also bounds how
// far the strip is translated, so it doubles as the clamp below.
const THUMBNAIL_WINDOW = 5;

export default function SharedModal({
  index,
  images,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction,
}: SharedModalProps) {
  const [loaded, setLoaded] = useState(false);
  const [showInfo, toggleShowInfo] = useState(false);

  const filteredImages = images?.filter((img: ImageProps) =>
    range(index - THUMBNAIL_WINDOW, index + THUMBNAIL_WINDOW).includes(img.id),
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < images?.length - 1) {
        changePhotoId(index + 1);
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1);
      }
    },
    trackMouse: true,
  });

  const currentImage = images ? images[index] : currentPhoto;

  return (
    <MotionConfig
      transition={{
        // A plain eased tween, not a spring: springs overshoot and settle,
        // which causes some motion sickness when swapping between images.
        x: { type: "tween", duration: 0.45, ease: [0.32, 0.72, 0, 1] },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className="relative z-50 flex w-full h-full items-center justify-center"
        {...handlers}
      >
        {/* Main image. The box is the whole viewport and object-contain scales
            the photo to whichever axis runs out first, keeping the ratio. */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <Image
                src={currentImage.url}
                fill
                sizes="100vw"
                priority
                alt="One of Eric's images"
                onLoad={() => setLoaded(true)}
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buttons, anchored to the viewport rather than to the photo */}
        {loaded && (
          <>
            {navigation && (
              <>
                {index > 0 && (
                  <button
                    className="absolute left-3 top-[calc(50%-16px)] rounded-full border border-white/40 bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-hidden"
                    style={{ transform: "translate3d(0, 0, 0)" }}
                    onClick={() => changePhotoId(index - 1)}
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                )}
                {index + 1 < images.length && (
                  <button
                    className="absolute right-3 top-[calc(50%-16px)] rounded-full border border-white/40 bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-hidden"
                    style={{ transform: "translate3d(0, 0, 0)" }}
                    onClick={() => changePhotoId(index + 1)}
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                )}
              </>
            )}
            <div className="absolute top-0 right-0 flex items-center gap-2 p-3 text-white">
              {navigation && (
                <a
                  href={currentImage.url}
                  className="rounded-full border border-white/40 bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  target="_blank"
                  title="Open fullsize version"
                  rel="noreferrer"
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                </a>
              )}
              <button
                onClick={() => downloadPhoto(currentImage.url, `${index}.jpg`)}
                className="rounded-full border border-white/40 bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                title="Download fullsize version"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute top-0 left-0 flex items-center gap-2 p-3 text-white">
              <button
                onClick={() => closeModal()}
                className="rounded-full border border-white/40 bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
              >
                {navigation ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <ArrowUturnLeftIcon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => toggleShowInfo(!showInfo)}
                className="rounded-full border border-white/40 bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
              >
                <InformationCircleIcon className="h-5 w-5" />
              </button>
            </div>
            {/* Info panel */}
            {showInfo && (
              <div className="absolute top-4 left-1/2 z-50 w-[50%] -translate-x-1/2 rounded-lg bg-black/30 p-4 text-center text-white backdrop-blur-md">
                <p className="text-lg font-bold">{currentImage.title}</p>
                <p className="mt-2 text-sm font-normal">
                  {currentImage.description}
                </p>
              </div>
            )}
          </>
        )}

        {/* Bottom Nav bar */}
        {navigation && (
          <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-linear-to-b from-black/0 to-black/60">
            <motion.div
              initial={false}
              className="mx-auto mt-6 mb-6 flex aspect-4/3 h-14"
            >
              <AnimatePresence initial={false}>
                {filteredImages.map(({ url, id }) => (
                  <motion.button
                    initial={{
                      width: "0%",
                      x: `${Math.max((index - 1) * -100, THUMBNAIL_WINDOW * -100)}%`,
                    }}
                    animate={{
                      scale: id === index ? 1.25 : 1,
                      width: "100%",
                      x: `${Math.max(index * -100, THUMBNAIL_WINDOW * -100)}%`,
                    }}
                    exit={{ width: "0%" }}
                    onClick={() => changePhotoId(id)}
                    key={id}
                    className={`${
                      id === index
                        ? "z-20 rounded-md shadow-sm shadow-black/50"
                        : "z-10"
                    } ${id === 0 ? "rounded-l-md" : ""} ${
                      id === images.length - 1 ? "rounded-r-md" : ""
                    } relative inline-block w-full shrink-0 transform-gpu overflow-hidden focus:outline-hidden`}
                  >
                    <Image
                      alt="small photos on the bottom"
                      fill
                      // The strip is aspect-4/3 at h-14, so a thumbnail renders
                      // about 75px wide. 180px was asking for a ~5x oversized
                      // crop of a full-resolution photo.
                      sizes="96px"
                      className={`${
                        id === index
                          ? "brightness-110 hover:brightness-110"
                          : "brightness-50 contrast-125 hover:brightness-75"
                      } transform object-cover transition`}
                      src={url}
                    />
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
