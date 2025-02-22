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
slideAnimationDirection = 'previous'
console.log(slideAnimationDirection)
currentSlideImageAnimationOut = 'fadeOut'
nextSlideImageAnimationIn = 'fadeIn'
previousSlideImageAnimationIn = null
animationDuration = 1
animationFillMode = 'forwards'
animationTimingFunction = 'ease-in-out'
currentImage = 0
animationTimerMax = 5
timerUntilAnimation = animationTimerMax

// Set array of images to images array
images = d.gebc('slideshow-image')
totalImages = images.length

// Add IDs to images
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

// Set interval to decrement timerUntilAnimation by 1 every second
w.si(function() {
	timerUntilAnimation--
}, 1000)

// Set interval to check if animation timer has reached 0 or less
w.si(function() {
	if (timerUntilAnimation == 0) {
		triggerAnimation()
		resetTimerUntilAnimation()

	console.log(slideAnimationDirection)

	if (slideAnimationDirection == 'next') {
		console.log('setting next image as current...')
		if (currentImage + 1 == images.length) {
			currentImage = 0
		} else {
			currentImage++
		}
	} else if (slideAnimationDirection == 'previous') {
		console.log('setting previous image as current...')
		if (currentImage - 1 < 0 ) {
			currentImage = images.length - 1
		} else {
			currentImage--
		}
	}
	}
}, 1000)

// Function to set timerUntilAnimation to animationTimerMax
function resetTimerUntilAnimation () {
	timerUntilAnimation = animationTimerMax
}

// Function to trigger animation and set new currentImage
function triggerAnimation () {
	console.log('currentImage', currentImage)
	imageOut = d.gebi(`image${currentImage}`)

	if (slideAnimationDirection == "next") {
		if (currentImage + 1 == images.length) {
			console.log(currentImage)
			
			imageIn = d.gebi(`image${currentImage}`)
		} else {
			imageIn = d.gebi(`image${currentImage + 1}`)
			console.log(currentImage)
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

	w.st(function() {
		imageOut.className = 'slideshow-image hidden'
	}, slideAnimationDirection + 0.01)
}