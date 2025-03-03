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

//Animation variables
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

// Effects variables

mainEffectName = null
effectIsActive = false

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
	},
	'slideRightIn': {
		animationClass: 'slide-right-in'
	},
	'slideRightOut': {
		animationClass: 'slide-right-out'
	},
	'slideLeftIn': {
		animationClass: 'slide-left-in'
	},
	'slideLeftOut': {
		animationClass: 'slide-left-out'
	},
	'slideDownIn': {
		animationClass: 'slide-down-in'
	},
	'slideDownOut': {
		animationClass: 'slide-down-out'
	},
	'slideUpIn': {
		animationClass: 'slide-up-in'
	},
	'slideUpOut': {
		animationClass: 'slide-up-out'
	}
}

// Set interval to decrement timerUntilAnimation by 1 every second
w.si(function() {
        timerUntilAnimation--
}, 1000)

// Set interval to check if animation timer has reached 0 or less
w.si(function() {
    if (timerUntilAnimation == 0) {
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
	imageOut.style.animationTimingFunction = animationTimingFunction
	imageOut.style.animationFillMode = animationFillMode

    imageOut.classList.add(animations[currentSlideImageAnimationOut].animationClass)
    imageOut.style.animationDuration = animationDuration + 's'
    imageOut.style.animationFillMode = animationFillMode
    imageOut.style.animationTimingFunction = animationTimingFunction


    if (effectIsActive) {
    	imageIn.classList.add(`${mainEffectName}100`)
    }

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


/* 
	Image frame overlay (for 2D transitions) or underlay (for 3D image transforms)
	I know, this method is different that just putting the slideshow images in a container
	with overflow being hidden. Just trying it out for now. It's basically just setting a 
	transparent div over the size of the current image space with an outline that will have 
	a z-index higher than the images transitioning in 2D so the incoming and outgoing image
	look like they are staying within the frame, and then during 3D transitions will have a 
	z-index lower than the images transforming in 3D since they will go outside the image frame
	space anyway. I'm thinking that by putting a transition on the frame after it's new size for
	the incoming image is might have an interesting effect on how different size images replace
	each other as well. Always a new way to do something! I loved the challenge on Codepen around
	a decade ago that was asking people all the different ways to make a blue box.... hundreds...
*/

function setImageFrameZIndex () {
    if(imageTransitionContext == '2d') {
        imageFrame.style.zIndex = 5
    } else {
        imageFrame.style.index = -1
    }
}

// Initialize image frame on window load

setImageFrameSize(currentImage)

// Call on animate in/out and set to transition duration

function setImageFrameSize (nextCurrentImage) {
    imageFrame.style.transitionDuration = animationDuration + 's'

	// Set image frame to next image in slideshow dimensions
	incomingImage = d.gebi(`image${nextCurrentImage}`)
	imageFrame.style.width = incomingImage.width + 'px'
	imageFrame.style.height = incomingImage.height + 'px'
}

// Animation selections button actions

animationControls = d.gebi('animationControls')
slideAnimations = d.gebi('slideAnimations')

animationControls.onclick = function () {
	if (this.classList.contains('control-selected')) {
		this.classList.remove('control-selected')
		slideAnimations.classList.remove('animation-selection-open')
	} else {
		this.classList.add('control-selected')
		slideAnimations.classList.add('animation-selection-open')
		d.gebi('effectsControls').classList.remove('effects-control-selected')
		d.gebi('slideEffects').classList.remove('effects-selection-open')
	}
}

// #ffects selections button actions

effectsControls = d.gebi('effectsControls')
slideEffects = d.gebi('slideEffects')

effectsControls.onclick = function () {
	if (this.classList.contains('effects-control-selected')) {
		this.classList.remove('effects-control-selected')
		slideEffects.classList.remove('effects-selection-open')
	} else {
		this.classList.add('effects-control-selected')
		slideEffects.classList.add('effects-selection-open')
		d.gebi('animationControls').classList.remove('control-selected')
		d.gebi('slideAnimations').classList.remove('animation-selection-open')
	}
}

// Animation preview button actions

animationPreviewBtns = d.gebc('animation-preview-btn')

for (var i = 0; i < animationPreviewBtns.length; i++) {
	animationPreviewBtns[i].onclick = function () {
		if (!this.classList.contains('animation-preview-selected')) {
			mainAnimationName = this.getAttribute('mainanimationname')

			nextSlideImageAnimationIn = mainAnimationName + 'In'
			currentSlideImageAnimationOut = mainAnimationName + 'Out'

			d.gebc('animation-preview-selected')[0].classList.remove('animation-preview-selected')
			this.classList.add('animation-preview-selected')
		}
	}
}

// #Effects preview button actions

effectPreviewBtns = d.gebc('effect-preview-btn')

for (var i = 0; i < effectPreviewBtns.length; i++) {
	effectPreviewBtns[i].onclick = function() {
		currentEffectName = mainEffectName
		mainEffectName = this.getAttribute('maineffectname')

		if (!effectIsActive) {
			this.classList.add('effect-preview-selected')
			d.gebi(`image${currentImage}`).classList.add(`${mainEffectName}100`)
			effectIsActive = true
		} else {
			if (this.classList.contains('effect-preview-selected')) {
				this.classList.remove('effect-preview-selected')
				d.gebi(`image${currentImage}`).classList.remove(`${mainEffectName}100`)
				effectIsActive = false
			} else {
				d.gebc('effect-preview-selected')[0].classList.remove('effect-preview-selected')
				this.classList.add('effect-preview-selected')
				d.gebi(`image${currentImage}`).classList.remove(`${currentEffectName}100`)
				d.gebi(`image${currentImage}`).classList.add(`${mainEffectName}100`)
			}
		}
	}
}

// Hide pull-out panels on image frame click

imageFrame = d.gebi('imageFrame')

imageFrame.onclick = function () {
	var slideAnimationsPullout = d.gebi('slideAnimations')
	var animationControls = d.gebi('animationControls')

	if (slideAnimationsPullout.classList.contains('animation-selection-open')) {
		slideAnimationsPullout.classList.remove('animation-selection-open')
		animationControls.classList.remove('control-selected')
	}
}