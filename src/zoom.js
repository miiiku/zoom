(function(win, factory) {
    if (typeof module === 'object' && module.export) {
        module.exports = factory
    } else {
        win.zoom = factory
    }
}(window, function(root, options = {}) {
    var margin      = options.margin    >= 0 ? options.margin   : 15
    var padding     = options.padding   >= 0 ? options.padding  : 15
    var radius      = options.radius    >= 0 ? options.radius   : 5
    var specify     = options.specify   || null
    var filter      = options.filter    || null
    var lazyLoad    = options.lazyLoad  || false
    var original    = options.original  || "data-original"

    var speed = 0.3;
    var activeImg, maskBox, imgBox;
    var container, fullWidth, fullHeight, maxWidth, maxHeight, unloadImages = [];

    const init = () => {
        if (!root || typeof root != "string") return
    
        container = document.querySelector(root)

        container.addEventListener("click", function(e) {
            var e       = e         || window.event
            var target  = e.target  || e.srcElement
            if (target.nodeName.toLowerCase() !== "img") return

            var isTrue = isAccord(target)

            if (isTrue) {
                activeImg = target
                zoomIn()
            }
        })

        if (lazyLoad) {
            var imgs = Array.from(container.getElementsByTagName("img"))
            imgs.forEach(img => {
                if (isAccord(img) && img.getAttribute(original)) {
                    unloadImages.push(img)
                }
            })

            if (unloadImages.length > 0) {
                window.addEventListener('scroll', scrollEvent)
                scrollEvent()
            }
        }

        window.addEventListener('resize', resizeEvent)
        resizeEvent()
    }

    const px = n => n + "px"

    const isAccord = (img) => {

        var isTrue = false
        var attribute = null

        if (specify && (attribute = specify.split("="))) {
            if (attribute.length > 1) {
                isTrue = img.getAttribute(attribute[0]) === attribute[1]
            } else {
                isTrue = img.getAttribute(attribute[0]) !== null
            }
        } else if (filter && (attribute = filter.split("="))) {
            if (attribute.length > 1) {
                isTrue = img.getAttribute(attribute[0]) !== attribute[1]
            } else {
                isTrue = img.getAttribute(attribute[0]) === null
            }
        } else {
            isTrue = true
        }

        return isTrue
    }

    const getBound = (img) => {
        var bound = img.getBoundingClientRect()
        var clientHeight = window.innerHeight
        return bound.top <= clientHeight
    }

    const loadImage = (imgItem, index) => {
        imgItem.src = imgItem.getAttribute(original)
        unloadImages.splice(index, 1)
    }

    const zoomIn = () => {
        var bound       = activeImg.getBoundingClientRect()
        var src         = activeImg.src
        var width       = activeImg.width
        var height      = activeImg.height
        var imgWidth    = activeImg.naturalWidth
        var imgHeight   = activeImg.naturalHeight

        var wRatio      = (maxWidth / maxHeight).toFixed(2)
        var iRatio      = (imgWidth / imgHeight).toFixed(2)

        var ratioWidth, ratioHeight;

        if (wRatio > iRatio) {
            var rt      = (maxHeight / imgHeight).toFixed(2)
            ratioWidth  = (imgWidth * rt).toFixed(2)
            ratioHeight = (imgHeight * rt).toFixed(2)
        } else if (wRatio < iRatio) {
            var rt      = (maxWidth / imgWidth).toFixed(2)
            ratioWidth  = (imgWidth * rt).toFixed(2)
            ratioHeight = (imgHeight * rt).toFixed(2)
        } else {
            ratioWidth  = imgWidth
            ratioHeight = imgHeight
        }

        var x = (fullWidth - ratioWidth) / 2 - padding
        var y = (fullHeight - ratioHeight) / 2 - padding

        if (maskBox) {
            zoomTransform(x, y, ratioWidth, ratioHeight, true)
        } else {
            createZoom(bound.left - padding, bound.top - padding, width, height, src)
            setTimeout(() => {
                zoomTransform(x, y, ratioWidth, ratioHeight, true)
            }, 15)
        }
    }

    const zoomOut = () => {
        var bound       = activeImg.getBoundingClientRect()
        var imgWidth    = activeImg.width
        var imgHeight   = activeImg.height

        // transform里面设置了4个属性，会触发4次，第一次触发已经销毁，后面三次报错，设置为只执行一次
        imgBox.addEventListener("transitionend", function() {
            maskBox.remove()
            activeImg = null
            maskBox = null
            imgBox = null
        }, { once: true })

        zoomTransform(bound.left - padding, bound.top - padding, imgWidth, imgHeight)
    }

    const createLoader = (x, y) => {
        var loadBox = document.createElement("div")
        var loaderSVG = `
            <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                <path
                    opacity="0.2"
                    fill="#000"
                    d=" M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                        s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                        c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z">
                </path>
                <path
                    fill="#000"
                    d=" M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                        C22.32,8.481,24.301,9.057,26.013,10.047z"
                    transform="rotate(134.48 20 20)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"></animateTransform>
                </path>
            </svg>
        `

        loadBox.style = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            padding: 20px;
            background-color: #FFF;
            border-radius: 10px;
            overflow: hidden;
            box-sizing: content-box;
            transition: all ${speed}s ease;
            -o-transition: all ${speed}s ease;
            -ms-transition: all ${speed}s ease;
            -moz-transition: all ${speed}s ease;
            -webkit-transition: all ${speed}s ease;
        `
        loadBox.innerHTML = loaderSVG
        return loadBox
    }

    const createZoom = (x, y, w, h, src) => {
        maskBox = document.createElement("div")
        maskBox.style = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 99;
            transition: all ${speed}s ease;
            -o-transition: all ${speed}s ease;
            -ms-transition: all ${speed}s ease;
            -moz-transition: all ${speed}s ease;
            -webkit-transition: all ${speed}s ease;
        `

        imgBox = document.createElement("div")
        imgBox.style = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            width: ${w}px;
            height: ${h}px;
            padding: ${padding}px;
            background-color: #FFF;
            border-radius: ${radius}px;
            overflow: hidden;
            box-sizing: content-box;
            transition: all ${speed}s ease;
            -o-transition: all ${speed}s ease;
            -ms-transition: all ${speed}s ease;
            -moz-transition: all ${speed}s ease;
            -webkit-transition: all ${speed}s ease;
        `

        var imgCon = document.createElement("img")
        imgCon.src = src
        imgCon.style = `
            display: block;
            width: 100%;
        `

        imgBox.appendChild(imgCon)
        maskBox.appendChild(imgBox)
        document.body.appendChild(maskBox)

        maskBox.addEventListener("click", function() {
            zoomOut()
        }, { once: true })
    }

    const zoomTransform = (x, y, w, h, isOpen) => {
        maskBox.style.backgroundColor =  isOpen ? "rgba(0,0,0,.8)" : "rgba(0, 0, 0, .1)"
        imgBox.style.top = px(y)
        imgBox.style.left = px(x)
        imgBox.style.width = px(w)
        imgBox.style.height = px(h)
    }

    const resizeEvent = () => {
        fullWidth   = window.innerWidth
        fullHeight  = window.innerHeight
        maxWidth    = fullWidth - margin * 2 - padding * 2
        maxHeight   = fullHeight - margin * 2 - padding * 2

        activeImg && zoomIn()
    }

    const scrollEvent = () => {
        if (unloadImages.length < 1) return window.removeEventListener("scroll", scrollEvent)
        for (let i = unloadImages.length; i--;) {
            getBound(unloadImages[i]) && loadImage(unloadImages[i], i)
        }
    }

    init()
}))
