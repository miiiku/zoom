(function(win, factory) {
    if (typeof module === 'object' && module.export) {
        module.exports = factory
    } else {
        win.zoom = factory
    }
}(window, function(root, options = {}) {
    const margin      = options.margin    >= 0 ? options.margin   : 15
    const padding     = options.padding   >= 0 ? options.padding  : 15
    const radius      = options.radius    >= 0 ? options.radius   : 5
    const specify     = options.specify   || null
    const filter      = options.filter    || null
    const lazyLoad    = options.lazyLoad  || false
    const original    = options.original  || "data-original"

    const base64Prefix= "data:image/png;base64,"
    const imgPrevUrl  = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEDElEQVRoQ9WajVEVMRDHdytQKxArUCpQKhArECoQK1AqUCoQKxAqECoQKhA6wArW+b1JbvbykndJ3t1Tdobh490l+9/970c2qDxy0bn1N7PXIrIXvvzyNyLyoKrXc+65NQAzeyUi70XkjYjwc41ciciFiFyq6l3NC6VnugGYGUp/zli6VR/AnKoq35ulGYCZHYrIlw2KQ5EHEYEyXvDQUxF5WdCS5z+2AqkGYGZs/iNQxevwJ9DhvGbzsA5gjkTkbQbM1+ARjDApVQACz38GC8ZF70WEzVC8arNUmwDmRET4euI+xxvHqpp6cQ3QJAAzw1LfkjdPUb5X8QwQshbG8B7BKAdTIDYCyCgPXQ5rqDLp+8wDYT+ARG9MgigCCLT55fa5hf9zWb0EMOxLRvIgXpT2zQII3PztOL8T5SOoDIgbVd3PgS4BIGDJFAi02Vva8pm4oCh6BlArqDsjWQMQ8jzpMgqB1FVkeuLAv2NmZCdqThSoNKrcOQBQh6yAnKkqi2wlgZJU7ntVpYWoFjPDePRXyJWqHviXRwCSrDMLdYLyUDL2SftTqTHxQkqlkRdSAN76Wc5Vm05EMsrzehMAXjCz89Aw8ut3VaU2rWQAkKTNra1fUJ7qijJNkuhGbRjSqgdAAfkQVh6hbNqtbPku5ePeZkbwPg+/v4ux5AGQsiJPhwf+B+UDjUihn4I+Q3LxAMwp+6wn789Jm9RwZkZdIhkgQ2FbAUg+vFXV2pPVsM+SyjsaDUZW1ZXuEYDvODnmcWipll0oHwzt42CVzSIAz6+m9Lkr5QMAX9RWHcIcANJyv1W22eT2pCovBoAT2nE1/xoeXAoAZ2Vc6w/ri4DYBICgjR1obxAvDsLMfKszCuJsjm3wbux7FgVhZvk0GiJ8rkK2CIhSrfKVmBFG5PG2rcTsIMxsspWYu5mbFUTC/2wz5w8Oo5a1JRZc2Z8tO6Wtvqqy9krSA40v1U0VOQcyVOnUE8scaEIg+55oay+ENVNPNAHIzKfKR8pMwzTnoR7j3HUc6v2I51pV47hnnUIBgC9q/OlxjVUyXd8sVGpNBBnq1A22HG8J6DifpEbgia4xeqfyfpy/Rp1sFvIbZSywExCZu4iNE5LW8ToeoIgsMmoMgzVGiTHPozwT8eJFR+8FR9M10BSFzIxRJor7o+yk8muFrLRRZtzNo8QIQJghdcVGKHTMojjVDdVVRBjnH9WMICc9kLQGDGbjoDV+hPL8/UJVLyusjaKsQV3IDQ/OuL6tNUo1AAeETbF8nJKlOsNXvFO6Zi2NbLD6SWt8NQNwQLAgLW4JyJQz4ufcK2PxrsTQDcABwaKAocSXLrFTMCgdafdv/tVgQ8ADpPTPHvRCk3e/ta6rzkItC+762b91gEFPa2jwZQAAAABJRU5ErkJggg=="
    const imgNextUrl  = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEE0lEQVRoQ9WajVEUQRCFuyNQIxAjUCJQIhAjECIQI1AiUCIQIhAiECIQIhAjECJo67uaueqdm9md2Zu7K7rqCup2due9/p/eU3nior3xm9lbEdkLH//4WxF5UNWbnnuuTcDM3ojIRxF5JyL8XyPXInIpIleqel9zQ2nNbAJmBuivGU234oHMqaryt1maCZjZoYh8GwGOizyICC7jBQs9F5HXBZSs/9xKpJqAmbH5z+AqHsNjcIfzms3DcyBzJCLvM2S+B4ughEmpIhD8/FfQYHzoXxFhM4BXbZaiCWRORITPM3cdaxyramrFFUKTBMwMTf1I7jwF/FzgGSJkLZThLYJSDqZIjBLIgMddDmtcZdL2mQVhP4hEa0ySKBIIbvPb7XOH//fSeolg2JeM5Em8Ku2bJRB884/z+a2Aj6QyJG5VdT9HukSAgCVTILjN3qY1n4kLiqL3AGoFdWcgKwRCniddRiGQZhWZOXHg7zEzshM1JwquNKjcOQK4DlkBOVNVHlItYdN/qnpRfdPIQjNDefRXyLWqHvjlAwJJ1ml2nURj1IfjdUlkksnACikBr/2sz40ByqTdXiTOQ8PI9heqSm1ayJJAwrRZ+/GBZuY34+u1SSTYqA3LtOoJUEA+BSADlq1usCESBO/LgOWDqtKODyxAyor9/HJBK/gRS7Ah/c3cvokU+iVNLt4C5sC+mLuRJ5yxBM0ZabmZhJlRl6hPyLKwLQgkF+9UtfZkNWmgziSWSlbVBfZIwHecHPM4tHSTXiTMzMfBPp1qJOD9qzl91jDtQSIpaosOYWsEgqumKZYjJNmvSnZKIHS4BKGPr6ZstzMCBfCkVCxSLWMECNrYgXYN4l7ggwv6VmcQxNkcW62awsKe4AOBfBpNL4rI2oVsA+C9kpe1yldiqmQcOjUFV2qA3uCDgidbiS7N3CbAZ/w/28z5M+igZa2NhQ2C99geVZUp4ULSA40v1c0VOXOGbU6VOWUlVTx/oAlm8j1RsxWSgUAv8Ol0onykDCS8FeYc6heVdmok2OCWfsRzo6px3LPqQoGAL2p89bTGKoGEH2U0u1KtdsfWZaYRdYOtQIAox5XifHL2SWoOmcw4f8V1slnIb5bRwFZIZMCPTkhax+u4E0VkI6PGMFdilBjzPOCZiBdfdMx9wdH0GmjKjcyMUSbA/VF2EvxKISttlBl3s5QYgQiFpXnK4GKNWRTz12V1FRHG+Uc1qXjSApFUaBOY7cRBa7wEeL6/VNWrCm0DlGdQNHPDgzNe39YqpZqAI8KmaD5OyVLM+CvWKb1mLY1s0PpJa3w1E3BE0CAtbonIlDHidd4ro/FZiWE2AUcEjUKGEl96iZ2SAXR0u9381GAk4CFS+rHHfU1g1pquOgu1PHDba/8Dd5pFTyZ20jIAAAAASUVORK5CYII="

    var speed = 0.3;
    var maskBox, imgBox, imgCon, imgLoad, prevBtn, nextBtn, activeIndex;
    var container, fullWidth, fullHeight, maxWidth, maxHeight, images = [], unloadImages = [];

    const init = () => {
        if (!root || typeof root != "string") return

        prevBtn = createBtn("prev")
        nextBtn = createBtn("next")
    
        container = document.querySelector(root)

        container.addEventListener("click", function(e) {
            var e       = e         || window.event
            var target  = e.target  || e.srcElement
            if (target.nodeName.toLowerCase() !== "img") return
            if (target.index >= 0) {
                activeIndex = target.index
                zoomIn()
            }
        })

        let index = 0
        Array.from(container.getElementsByTagName("img")).forEach(img => {
            if (isAccord(img)) {
                img.index = index++
                images.push(img)
                if (lazyLoad && img.getAttribute(original)) {
                    unloadImages.push(img)
                }
            }
        })

        if (lazyLoad && unloadImages.length > 0) {
            window.addEventListener('scroll', scrollEvent)
            scrollEvent()
        }

        window.addEventListener('resize', resizeEvent)
        resizeEvent()
    }

    const px = n => n + "px"

    const getIndex = (key, value, arrs) => {
        if (arrs.length < 1) return -1

        for (let i = 0; i < arrs.length; i++) {
            if (arrs[i][key] === value)
            return i
        }

        return -1
    }

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

    const loadImage = (imgItem, index, callback) => {
        callback && (imgItem.onload = callback)
        imgItem.src = imgItem.getAttribute(original)
        unloadImages.splice(index, 1)
    }

    const zoomIn = (isSwitch) => {
        const image     = images[activeIndex]
        var bound       = image.getBoundingClientRect()
        var src         = image.src
        var width       = image.width
        var height      = image.height
        var imgWidth    = image.naturalWidth
        var imgHeight   = image.naturalHeight

        var wRatio      = (maxWidth / maxHeight).toFixed(2)
        var iRatio      = (imgWidth / imgHeight).toFixed(2)

        var ratioWidth, ratioHeight

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

        if (isSwitch) {
            zoomShow(bound.left - padding, bound.top - padding, width, height, src)
            zoomTransform(x, y, ratioWidth, ratioHeight, true)
        } else {
            createZoom(bound.left - padding, bound.top - padding, width, height, src)
            setTimeout(() => {
                zoomTransform(x, y, ratioWidth, ratioHeight, true)
            }, 15)
        }
    }

    const zoomOut = () => {
        const image     = images[activeIndex]
        var bound       = image.getBoundingClientRect()
        var imgWidth    = image.width
        var imgHeight   = image.height

        // transform里面设置了4个属性，会触发4次，第一次触发已经销毁，后面三次报错，设置为只执行一次
        imgBox.addEventListener("transitionend", function() {
            maskBox.remove()
            maskBox = null
            imgBox = null
            activeIndex = null
        }, { once: true })

        document.body.removeEventListener("keyup", keyUpEvent)

        zoomTransform(bound.left - padding, bound.top - padding, imgWidth, imgHeight)
    }

    const createLoader = () => {
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
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 40px;
            height: 40px;
        `
        loadBox.innerHTML = loaderSVG
        imgLoad = loadBox
        return loadBox
    }

    const createBtn = (type) => {
        const btn = document.createElement("img")
        btn.src = base64Prefix + (type === "next" ? imgNextUrl : imgPrevUrl)
        btn.id = type === "next" ? "next-btn" : "prev-btn"
        btn.style = `
            position: absolute;
            display: block;
            width: 30px;
            height: 30px;
            ${ type === "next" ? "right: 30px;" : "left: 30px;" }
            top: 0;
            bottom: 0;
            margin: auto;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.3);
            transition: opacity 0.3s ease;
        `
        btn.addEventListener("click", function (e) {
            type === "next" ? next() : prev()
        })

        return btn
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
        
        imgBox.addEventListener("click", function(e) {
            e.stopPropagation()
        })

        imgBox.addEventListener("mouseover", function(e) {
            let prev = imgBox.querySelector("#prev-btn")
            let next = imgBox.querySelector("#next-btn")
            prev && (prev.style.opacity = 1)
            next && (next.style.opacity = 1)
        })

        imgBox.addEventListener("mouseout", function(e) {
            let prev = imgBox.querySelector("#prev-btn")
            let next = imgBox.querySelector("#next-btn")
            prev && (prev.style.opacity = 0)
            next && (next.style.opacity = 0)
        })

        imgCon = document.createElement("img")
        imgCon.style = `
            display: block;
            width: 100%;
        `
        imgCon.src = src

        if (activeIndex !== 0) {
            imgBox.appendChild(prevBtn)
        }

        if (activeIndex !== images.length - 1) {
            imgBox.appendChild(nextBtn)
        }

        imgBox.appendChild(imgCon)
        maskBox.appendChild(imgBox)
        document.body.appendChild(maskBox)

        document.body.addEventListener("keyup", keyUpEvent)

        maskBox.addEventListener("click", function() {
            zoomOut()
        }, { once: true })
    }

    const zoomShow = (x, y, w, h, src) => {
        imgBox.style.top = px(y)
        imgBox.style.left = px(x)
        imgBox.style.width = px(w)
        imgBox.style.height = px(h)
        imgCon.src = src
        imgCon.onload = function () {
            imgLoad && imgLoad.remove()
        }

        if (activeIndex === 0) {
            if (imgBox.querySelector("#prev-btn")) prevBtn.remove()
        } else {
            if (!imgBox.querySelector("#prev-btn")) imgBox.appendChild(prevBtn)
        }

        if (activeIndex >= images.length - 1) {
            if (imgBox.querySelector("#next-btn")) nextBtn.remove()
        } else {
            if (!imgBox.querySelector("#next-btn")) imgBox.appendChild(nextBtn)
        }
    }

    const prev = () => {
        if (activeIndex == 0) return
        let image = images[--activeIndex]
        switchImage(image)
    }

    const next = () => {
        if (activeIndex >= images.length - 1) return
        let image = images[++activeIndex]
        switchImage(image)
    }

    const switchImage = (image) => {
        if (!image.src) {
            imgCon.src = ""
            imgBox.appendChild(createLoader())
            loadImage(image, getIndex("id", image.id, unloadImages), function () {
                zoomIn(true)
            })
        } else {
            zoomIn(true)
        }
    }

    const zoomTransform = (x, y, w, h, isOpen) => {
        maskBox.style.backgroundColor =  isOpen ? "rgba(0,0,0,.8)" : "rgba(0, 0, 0, .1)"
        imgBox.style.top = px(y)
        imgBox.style.left = px(x)
        imgBox.style.width = px(w)
        imgBox.style.height = px(h)
    }

    const keyUpEvent = (e) => {
        if (e.keyCode === 37) prev()
        if (e.keyCode === 39) next()
    }

    const resizeEvent = () => {
        fullWidth   = window.innerWidth
        fullHeight  = window.innerHeight
        maxWidth    = fullWidth - margin * 2 - padding * 2
        maxHeight   = fullHeight - margin * 2 - padding * 2

        activeIndex && zoomIn(true)
    }

    const scrollEvent = () => {
        if (unloadImages.length < 1) return window.removeEventListener("scroll", scrollEvent)
        for (let i = unloadImages.length; i--;) {
            getBound(unloadImages[i]) && loadImage(unloadImages[i], i)
        }
    }

    init()
}))
