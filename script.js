// Cache window and commonly used window function
w = window
w.st = w.setTimeout
w.si = w.setInterval

// Cache document and commonly used DOM element function
d = document
d.ce = d.createElement
d.gebi = d.getElementById
d.gebc = d.getElementsByClassName
d.gebt = d.getElementsByTagName
d.qs = d.querySelector
d.qsa = d.querySelectorAll

// Cache document body
b = d.body

slideAnimationTiming = 5
slideAnimationDirection = 'next'
currentSlideImageAnimationOut = 'fadeOut'
nextSlideImageAnimationIn = 'fadeIn'
previousSlideImageAnimationIn = null
animationDuration = 2
animationFillMode = 'forwards'
animationTimingFunction = 'ease-in-out'
currentImage = 0
animationTimerMax = 5
timerUntilAnimation = animationTimerMax
isDragging = false
startX = 0
currentX = 0

// Set array of images to images array
images = d.gebc('slideshow-image')
totalImages = images.length

// Add IDs to images and mouse events
for (var i = 0; i < images.length; i++) {
    images[i].id = `image${i}`
}

// Create animations object for referencing classes containing animations
animations = {
    'fadeIn': {
        animationClass: 'fade-in'
    },
    'fadeOut': {
        animationClass: 'fade-out'
    }
}

// Add mouse/touch event listeners
b.addEventListener('mousedown', startDrag)
b.addEventListener('mousemove', drag)
b.addEventListener('mouseup', endDrag)
b.addEventListener('touchstart', e => startDrag(e.touches[0]))
b.addEventListener('touchmove', e => drag(e.touches[0]))
b.addEventListener('touchend', endDrag)

function startDrag(e) {
    isDragging = true
    startX = e.clientX
    currentX = startX
}

function drag(e) {
    if (!isDragging) return
    
    currentX = e.clientX
    const diff = currentX - startX
    
    // Calculate opacity based on drag distance - reduced sensitivity by increasing divisor
    const opacity = Math.max(0, Math.min(1, 1 - Math.abs(diff) / 400)) // Changed from 200 to 400
    images[currentImage].style.opacity = opacity
    
    // Show next/previous image based on drag direction
    if (diff > 0) {
        const prevIndex = currentImage === 0 ? images.length - 1 : currentImage - 1
        images[prevIndex].classList.remove('hidden')
        images[prevIndex].style.opacity = 1 - opacity
    } else if (diff < 0) {
        const nextIndex = currentImage === images.length - 1 ? 0 : currentImage + 1
        images[nextIndex].classList.remove('hidden')
        images[nextIndex].style.opacity = 1 - opacity
    }
}

function endDrag(e) {
    if (!isDragging) return
    isDragging = false
    
    const diff = currentX - startX
    if (Math.abs(diff) > 200) { // Increased threshold from 100 to 200 to require more drag distance
        if (diff > 0) {
            slideAnimationDirection = 'previous'
        } else {
            slideAnimationDirection = 'next'
        }
        triggerAnimation()
        resetTimerUntilAnimation()
        
        if (slideAnimationDirection == 'next') {
            if (currentImage + 1 == images.length) {
                currentImage = 0
            } else {
                currentImage++
            }
        } else {
            if (currentImage - 1 < 0) {
                currentImage = images.length - 1
            } else {
                currentImage--
            }
        }
        
        setImageFrameSize(currentImage)
    } else {
        // Reset if drag wasn't far enough
        images[currentImage].style.opacity = 1
        for (let img of images) {
            if (img.id !== `image${currentImage}`) {
                img.classList.add('hidden')
            }
        }
    }
}

// Set interval to decrement timerUntilAnimation by 1 every second
w.si(function() {
    if (!isDragging) {
        timerUntilAnimation--
    }
}, 1000)

// Set interval to check if animation timer has reached 0 or less
w.si(function() {
    if (timerUntilAnimation == 0 && !isDragging) {
        triggerAnimation()
        resetTimerUntilAnimation()

        if (slideAnimationDirection == 'next') {
            if (currentImage + 1 == images.length) {
                currentImage = 0
            } else {
                currentImage++
            }
        } else if (slideAnimationDirection == 'previous') {
            if (currentImage - 1 < 0 ) {
                currentImage = images.length - 1
            } else {
                currentImage--
            }
        }

        setImageFrameSize(currentImage)
    }
}, 1000)

// Function to set timerUntilAnimation to animationTimerMax
function resetTimerUntilAnimation () {
    timerUntilAnimation = animationTimerMax
}

// Function to trigger animation and set new currentImage
function triggerAnimation () {
    imageOut = d.gebi(`image${currentImage}`)

    if (slideAnimationDirection == "next") {
        if (currentImage + 1 == images.length) {            
            imageIn = d.gebi(`image${currentImage}`)
        } else {
            imageIn = d.gebi(`image${currentImage + 1}`)
        }
    } else if (slideAnimationDirection == "previous") {
        if (currentImage - 1 < 0) {
            imageIn = d.gebi(`image${images.length - 1}`)
        } else {
            imageIn = d.gebi(`image${currentImage - 1}`)
        }
    }

    imageOut.classList.add(animations[currentSlideImageAnimationOut].animationClass)
    imageOut.style.animationDuration = animationDuration + 's'
    imageOut.style.animationFillMode = animationFillMode
    imageOut.style.animationTimingFunction = animationTimingFunction

    imageIn.classList.add(animations[nextSlideImageAnimationIn].animationClass)
    imageIn.style.animationDuration = animationDuration + 's'
    imageIn.style.animationFillMode = animationFillMode
    imageIn.style.animationTimingFunction = animationTimingFunction
    imageIn.classList.remove('hidden')

    window.st(function() {
        imageOut.className = 'slideshow-image hidden'
    }, animationDuration * 1000)
}

// Slideshow play direction controls

playSlideshowBackwardsBtn = d.gebi('playSlideshowBackwardsBtn')

playSlideshowBackwardsBtn.onclick = function(e) {
    if (slideAnimationDirection != 'previous') {
        d.gebc('direction-btn-selected')[0].classList.remove('direction-btn-selected')
        this.classList.add('direction-btn-selected')
        slideAnimationDirection = 'previous'
        d.gebi('playDirectionMsg').innerText = 'Backwards'
    }
}

playSlideshowForwardsBtn = d.gebi('playSlideshowForwardsBtn')

playSlideshowForwardsBtn.onclick = function(e) {
    if (slideAnimationDirection != 'next') {
        d.gebc('direction-btn-selected')[0].classList.remove('direction-btn-selected')
        this.classList.add('direction-btn-selected')
        slideAnimationDirection = 'next'
        d.gebi('playDirectionMsg').innerText = 'Forwards'

    }
}

// Adjust slideshow and controls positioning on window resize

setLayout()

function setLayout () {
    if (getLowestDimension() == 'vh') {
        b.className = 'landscape'
    } else {
        b.className = 'portrait'
    }
}

function getLowestDimension () {
    if (w.innerHeight < w.innerWidth) {
        return 'vh'
    } else {
        return 'vw'
    }
}

w.onresize = setLayout

imageTransitionContext = '2d'

imageFrame = d.gebi('imageFrame')

function setImageFrameZIndex () {
    if(imageTransitionContext == '2d') {
        imageFrame.style.zIndex = 5
    } else {
        imageFrame.style.index = -1
    }
}

// Initialize image frame
setImageFrameSize(currentImage)

// Call on animate in/out and set to transition duration
function setImageFrameSize (nextCurrentImage) {
    imageFrame.style.transitionDuration = animationDuration + 's'

    // Set image frame to next image in slideshow dimensions
    incomingImage = d.gebi(`image${nextCurrentImage}`)
    imageFrame.style.width = incomingImage.width + 'px'
    imageFrame.style.height = incomingImage.height + 'px'
}