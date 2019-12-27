(function (win, factory) {
  if (typeof module === 'object' && module.export) {
    module.exports = factory
  } else {
    win.zoom = factory
  }
}(window, function (root, options = {}) {
  const zIndex = options.zIndex || 999
  const margin = options.margin >= 0 ? options.margin : 10
  const padding = options.padding >= 0 ? options.padding : 10
  const radius = options.radius >= 0 ? options.radius : 4
  const specify = options.specify || null
  const filter = options.filter || null
  const lazyLoad = options.lazyLoad || false
  const original = options.original || "data-original"

  const base64Prefix = "data:image/png;base64,"
  const imgPrevUrl = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEDElEQVRoQ9WajVEVMRDHdytQKxArUCpQKhArECoQK1AqUCoQKxAqECoQKhA6wArW+b1JbvbykndJ3t1Tdobh490l+9/970c2qDxy0bn1N7PXIrIXvvzyNyLyoKrXc+65NQAzeyUi70XkjYjwc41ciciFiFyq6l3NC6VnugGYGUp/zli6VR/AnKoq35ulGYCZHYrIlw2KQ5EHEYEyXvDQUxF5WdCS5z+2AqkGYGZs/iNQxevwJ9DhvGbzsA5gjkTkbQbM1+ARjDApVQACz38GC8ZF70WEzVC8arNUmwDmRET4euI+xxvHqpp6cQ3QJAAzw1LfkjdPUb5X8QwQshbG8B7BKAdTIDYCyCgPXQ5rqDLp+8wDYT+ARG9MgigCCLT55fa5hf9zWb0EMOxLRvIgXpT2zQII3PztOL8T5SOoDIgbVd3PgS4BIGDJFAi02Vva8pm4oCh6BlArqDsjWQMQ8jzpMgqB1FVkeuLAv2NmZCdqThSoNKrcOQBQh6yAnKkqi2wlgZJU7ntVpYWoFjPDePRXyJWqHviXRwCSrDMLdYLyUDL2SftTqTHxQkqlkRdSAN76Wc5Vm05EMsrzehMAXjCz89Aw8ut3VaU2rWQAkKTNra1fUJ7qijJNkuhGbRjSqgdAAfkQVh6hbNqtbPku5ePeZkbwPg+/v4ux5AGQsiJPhwf+B+UDjUihn4I+Q3LxAMwp+6wn789Jm9RwZkZdIhkgQ2FbAUg+vFXV2pPVsM+SyjsaDUZW1ZXuEYDvODnmcWipll0oHwzt42CVzSIAz6+m9Lkr5QMAX9RWHcIcANJyv1W22eT2pCovBoAT2nE1/xoeXAoAZ2Vc6w/ri4DYBICgjR1obxAvDsLMfKszCuJsjm3wbux7FgVhZvk0GiJ8rkK2CIhSrfKVmBFG5PG2rcTsIMxsspWYu5mbFUTC/2wz5w8Oo5a1JRZc2Z8tO6Wtvqqy9krSA40v1U0VOQcyVOnUE8scaEIg+55oay+ENVNPNAHIzKfKR8pMwzTnoR7j3HUc6v2I51pV47hnnUIBgC9q/OlxjVUyXd8sVGpNBBnq1A22HG8J6DifpEbgia4xeqfyfpy/Rp1sFvIbZSywExCZu4iNE5LW8ToeoIgsMmoMgzVGiTHPozwT8eJFR+8FR9M10BSFzIxRJor7o+yk8muFrLRRZtzNo8QIQJghdcVGKHTMojjVDdVVRBjnH9WMICc9kLQGDGbjoDV+hPL8/UJVLyusjaKsQV3IDQ/OuL6tNUo1AAeETbF8nJKlOsNXvFO6Zi2NbLD6SWt8NQNwQLAgLW4JyJQz4ufcK2PxrsTQDcABwaKAocSXLrFTMCgdafdv/tVgQ8ADpPTPHvRCk3e/ta6rzkItC+762b91gEFPa2jwZQAAAABJRU5ErkJggg==";
  const imgNextUrl = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEE0lEQVRoQ9WajVEUQRCFuyNQIxAjUCJQIhAjECIQI1AiUCIQIhAiECIQIhAjECJo67uaueqdm9md2Zu7K7rqCup2due9/p/eU3nior3xm9lbEdkLH//4WxF5UNWbnnuuTcDM3ojIRxF5JyL8XyPXInIpIleqel9zQ2nNbAJmBuivGU234oHMqaryt1maCZjZoYh8GwGOizyICC7jBQs9F5HXBZSs/9xKpJqAmbH5z+AqHsNjcIfzms3DcyBzJCLvM2S+B4ughEmpIhD8/FfQYHzoXxFhM4BXbZaiCWRORITPM3cdaxyramrFFUKTBMwMTf1I7jwF/FzgGSJkLZThLYJSDqZIjBLIgMddDmtcZdL2mQVhP4hEa0ySKBIIbvPb7XOH//fSeolg2JeM5Em8Ku2bJRB884/z+a2Aj6QyJG5VdT9HukSAgCVTILjN3qY1n4kLiqL3AGoFdWcgKwRCniddRiGQZhWZOXHg7zEzshM1JwquNKjcOQK4DlkBOVNVHlItYdN/qnpRfdPIQjNDefRXyLWqHvjlAwJJ1ml2nURj1IfjdUlkksnACikBr/2sz40ByqTdXiTOQ8PI9heqSm1ayJJAwrRZ+/GBZuY34+u1SSTYqA3LtOoJUEA+BSADlq1usCESBO/LgOWDqtKODyxAyor9/HJBK/gRS7Ah/c3cvokU+iVNLt4C5sC+mLuRJ5yxBM0ZabmZhJlRl6hPyLKwLQgkF+9UtfZkNWmgziSWSlbVBfZIwHecHPM4tHSTXiTMzMfBPp1qJOD9qzl91jDtQSIpaosOYWsEgqumKZYjJNmvSnZKIHS4BKGPr6ZstzMCBfCkVCxSLWMECNrYgXYN4l7ggwv6VmcQxNkcW62awsKe4AOBfBpNL4rI2oVsA+C9kpe1yldiqmQcOjUFV2qA3uCDgidbiS7N3CbAZ/w/28z5M+igZa2NhQ2C99geVZUp4ULSA40v1c0VOXOGbU6VOWUlVTx/oAlm8j1RsxWSgUAv8Ol0onykDCS8FeYc6heVdmok2OCWfsRzo6px3LPqQoGAL2p89bTGKoGEH2U0u1KtdsfWZaYRdYOtQIAox5XifHL2SWoOmcw4f8V1slnIb5bRwFZIZMCPTkhax+u4E0VkI6PGMFdilBjzPOCZiBdfdMx9wdH0GmjKjcyMUSbA/VF2EvxKISttlBl3s5QYgQiFpXnK4GKNWRTz12V1FRHG+Uc1qXjSApFUaBOY7cRBa7wEeL6/VNWrCm0DlGdQNHPDgzNe39YqpZqAI8KmaD5OyVLM+CvWKb1mLY1s0PpJa3w1E3BE0CAtbonIlDHidd4ro/FZiWE2AUcEjUKGEl96iZ2SAXR0u9381GAk4CFS+rHHfU1g1pquOgu1PHDba/8Dd5pFTyZ20jIAAAAASUVORK5CYII=";

  const speed = 0.4;

  let eventScroll, eventResize;

  let domMaskBox, domImgBox, domImgLoading, domImgError, domPrevBtn, domNextBtn, domStyle;
  let activeIndex = null, isTransitionEnd = true, isClose = true;
  let container, fullWidth = window.innerWidth, fullHeight = window.innerHeight, maxWidth, maxHeight, images = [], unloads = [];

  /**
   * 防抖
   *
   * @param {*} fn
   * @param {*} wait
   * @returns
   */
  const debounce = (fn, wait) => {
    let timer = null;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(fn, wait);
    }
  }

  /**
   * 页面滚动执行方法
   *
   * @returns
   */
  const scrollFunc = () => {
    if (unloads.length < 1) return window.removeEventListener("scroll", eventScroll);
    for (let i = unloads.length; i--;) {
      getBound(unloads[i]) && loadImage(unloads[i], i);
    }
  }

  /**
   * 页面窗口大小改变执行方法
   *
   */
  const resizeFunc = () => {
    fullWidth = window.innerWidth;
    fullHeight = window.innerHeight;
    maxWidth = fullWidth - margin * 2 - padding * 2;
    maxHeight = fullHeight - margin * 2 - padding * 2;
    activeIndex && transformZoom(getShowEndPosition());
  }

  /**
   * 点击查看图片
   *
   * @param {*} e event
   * @returns
   */
  const eventClick = (e) => {
    var e = e || window.event;
    var target = e.target || e.srcElement;
    if (target.nodeName.toLowerCase() !== "img") return;
    if (target.index >= 0) {
      activeIndex = findIndexs(images, "index", target.index)[0];
      zoomIn();
    }
  }

  /**
   * 键盘左右切换事件
   *
   * @param {*} e event
   * @returns
   */
  const eventKeyUp = (e) => {
    if (isClose) return;
    if (e.keyCode === 37) prev();
    if (e.keyCode === 39) next();
    if (e.keyCode === 27) zoomOut();
  }

  /**
   * 阻止事件传播
   *
   * @param {*} e event
   */
  const eventStopPropagation = (e) => {
    e.stopPropagation();
  }

  /**
   * 元素过度完成后事件
   *
   * @param {*} e event
   * @returns
   */
  const eventTransitionend = (e) => {
    /**
     *  这里要判断下当前过度结束的对象是谁
     *  给dom绑定了transitionend以后，它的子节点如果有过度也会触发这个事件
     *  这里 子dom imgBtn有0.3s的opacity 过度，也会触发这个函数
     */
    if (!e.target.classList.contains("zoom-box")) return;
    isTransitionEnd = true;
    domImgBox.removeEventListener("transitionend", eventTransitionend);
    if (isClose) {
      activeIndex = null;
      domMaskBox.style.display = "none";
      document.body.style.overflow = "initial";
    }
  }

  /**
   * 初始化
   *
   */
  const init = () => {
    if (!root || typeof root != "string") return;

    container = document.querySelector(root);
    container.addEventListener("click", eventClick);

    domPrevBtn = createBtn("prev");
    domNextBtn = createBtn("next");
    createZoom();
    createLoading();
    createImgError();
    initCSS();

    Array.from(container.getElementsByTagName("img")).forEach((img, index) => {
      if (!isAccord(img)) return;
      img.index = index;
      images.push(img);
      if (lazyLoad && img.getAttribute(original)) {
        unloads.push(img);
      }
    });

    eventScroll = debounce(scrollFunc, 400);
    eventResize = debounce(resizeFunc, 800);

    window.addEventListener("resize", eventResize);
    window.addEventListener("keyup", eventKeyUp);
    resizeFunc();

    if (lazyLoad && unloads.length > 0) {
      window.addEventListener("scroll", eventScroll);
      scrollFunc();
    }
  }

  /**
   * 使用js构建css树
   *
   */
  const initCSS = () => {
    let css = `
      .zoom-mask {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: ${zIndex};
        transition: all ${speed}s ease;
        -o-transition: all ${speed}s ease;
        -ms-transition: all ${speed}s ease;
        -moz-transition: all ${speed}s ease;
        -webkit-transition: all ${speed}s ease;
        transform: translate3d(0,0,0);
        -o-transform: translate3d(0,0,0);
        -moz-transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
      }
      .zoom-box {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
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
        transform: translate3d(0,0,0);
        -o-transform: translate3d(0,0,0);
        -moz-transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
      }
      .zoom-box:hover .zoom-btn {
        opacity: 1;
      }
      .zoom-img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: translate3d(0,0,0);
        -o-transform: translate3d(0,0,0);
        -moz-transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
      }
      .zoom-btn {
        position: absolute;
        opacity: 0;
        width: 30px;
        height: 30px;
        top: 0;
        bottom: 0;
        margin: auto;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.3);
        transition: opacity 0.3s ease;
      }
      .zoom-btn.prev { left: 20px; }
      .zoom-btn.next { right: 20px; }
    `;
    domStyle = document.createElement("style");
    domStyle.type = "text/css";
    domStyle.innerHTML = css;
    document.head.appendChild(domStyle);
  }

  /**
   * 销毁
   *
   */
  const destroy = () => {
    domMaskBox.removeEventListener("click", zoomOut);
    domImgBox.removeEventListener("click", eventStopPropagation);
    container.removeEventListener("click", eventClick);
    window.removeEventListener("resize", eventResize);
    window.removeEventListener("keyup", eventKeyUp);
    if (lazyLoad && unloads.length > 0) {
      window.removeEventListener("scroll", eventScroll);
    }
    domStyle.remove();
    domMaskBox.remove();
  }


  /**
   * 懒加载图片
   *
   * @param {*} image 被加载的图片
   * @param {*} index 被加载图片所在数组的下标
   * @param {*} callback 加载完成以后的回调
   */
  const loadImage = (image, index, callback) => {
    callback && (image.onload = callback);
    image.src = image.getAttribute(original);
    unloads.splice(index, 1);
  }

  /**
   * 数字转px
   *
   * @param {*} n 具体的值
   * @returns 转换后的px值
   */
  const px = n => n + "px"

  /**
   * 指定一个数组，返回符合元素的下标
   *
   * @param {*} arr 被查找的数组
   * @param {*} key 单个元素的属性
   * @param {*} val 单个元素属于对应的值
   * @returns 符合条件的元素下标
   */
  const findIndexs = (arr, key, val) => {
    let result = []
    arr.forEach((item, index) => {
      if (item[key] == val) result.push(index);
    });
    return result;
  }

  /**
   * 判断传入的img dom是否通过验证
   *
   * @param {*} img
   * @returns
   */
  const isAccord = (img) => {
    let isTrue = false;
    let attribute = null;

    if (specify && (attribute = specify.split("="))) {
      if (attribute.length > 1) {
        isTrue = img.getAttribute(attribute[0]) === attribute[1];
      } else {
        isTrue = img.getAttribute(attribute[0]) !== null;
      }
    } else if (filter && (attribute = filter.split("="))) {
      if (attribute.length > 1) {
        isTrue = img.getAttribute(attribute[0]) !== attribute[1];
      } else {
        isTrue = img.getAttribute(attribute[0]) === null;
      }
    } else {
      isTrue = true;
    }

    return isTrue;
  }

  /**
   * 获取指定元素相对于屏幕的位置
   *
   * @param {*} img img dom
   * @returns
   */
  const getBound = (img) => {
    var bound = img.getBoundingClientRect();
    return bound.top <= fullHeight && bound.top >= 0 || bound.bottom >= 0 && bound.bottom <= fullHeight;
  }

  /**
   * 获取显示图片时默认显示的位置大小
   *
   * @returns 默认显示的位置大小
   */
  const getShowDefaultPosition = () => {
    return {
      x: fullWidth / 4,
      y: fullHeight / 4,
      w: fullWidth / 2,
      h: fullHeight / 2,
    }
  }
  
  /**
   * 获取图片显示时的起始位置信息
   *
   * @returns 起始位置信息
   */
  const getShowStartPosition = () => {
    let image = images[activeIndex];
    let bound = image.getBoundingClientRect();
    let width = image.width;
    let height = image.height;

    return {
      x: bound.left - padding,
      y: bound.top - padding,
      w: width,
      h: height,
    }
  }

  /**
   * 获取图片显示时的最终位置信息
   *
   * @returns 最终位置信息
   */
  const getShowEndPosition = () => {
    let image = images[activeIndex];
    let naturalWidth = image.naturalWidth;
    let naturalHeight = image.naturalHeight;
    let ratioWidth, ratioHeight;

    // 需要进行缩放
    if (naturalWidth > maxWidth || naturalHeight > maxHeight) {
      let wRatio = (maxWidth / maxHeight).toFixed(2)
      let iRatio = (naturalWidth / naturalHeight).toFixed(2)

      if (wRatio > iRatio) {
        var rt = (maxHeight / naturalHeight).toFixed(2)
        ratioWidth = (naturalWidth * rt).toFixed(2)
        ratioHeight = (naturalHeight * rt).toFixed(2)
      } else if (wRatio < iRatio) {
        var rt = (maxWidth / naturalWidth).toFixed(2)
        ratioWidth = (naturalWidth * rt).toFixed(2)
        ratioHeight = (naturalHeight * rt).toFixed(2)
      } else {
        ratioWidth = naturalWidth
        ratioHeight = naturalHeight
      }
    } else {
      ratioWidth = naturalWidth;
      ratioHeight = naturalHeight;
    }

    let x = (fullWidth - ratioWidth) / 2 - padding;
    let y = (fullHeight - ratioHeight) / 2 - padding;

    return { x, y, w: ratioWidth, h: ratioHeight };
  }

  /**
   * 获取图片关闭时最终显示的位置信息
   *
   * @returns 最终位置信息
   */
  const getHideEndPosition = () => {
    let image = images[activeIndex];
    let bound = image.getBoundingClientRect();
    let imgWidth = image.width;
    let imgHeight = image.height;

    return {
      x: bound.left - padding,
      y: bound.top - padding,
      w: imgWidth,
      h: imgHeight,
    };
  }

  /**
   * 显示模态框
   *
   */
  const zoomIn = () => {
    isClose = false;
    isTransitionEnd = false;
    document.body.style.overflow = "hidden";
    showImage(getShowStartPosition());
  }


  /**
   * 关闭模态框
   *
   * @returns
   */
  const zoomOut = () => {
    if (!isTransitionEnd) return console.log("阻止关闭");
    isClose = true;
    isTransitionEnd = false;
    transformZoom(getHideEndPosition());
  }

  /**
   * 创建上下图切换按钮
   *
   * @param {*} type prev or next
   * @returns
   */
  const createBtn = (type) => {
    let btn = document.createElement("img");

    btn.src = base64Prefix + (type === "next" ? imgNextUrl : imgPrevUrl);
    btn.id = type === "next" ? "next-btn" : "prev-btn";
    btn.className = `zoom-btn ${type}`;
    btn.addEventListener("click", type === "next" ? next : prev);

    return btn;
  }

  /**
   * 创建弹窗结构
   *
   */
  const createZoom = () => {
    domMaskBox = document.createElement("div");
    domMaskBox.className = "zoom-mask";
    domMaskBox.addEventListener("click", zoomOut);

    domImgBox = document.createElement("div");
    domImgBox.className = "zoom-box";
    domImgBox.addEventListener("click", eventStopPropagation);

    domMaskBox.appendChild(domImgBox);
    document.body.appendChild(domMaskBox);
  }

  /**
   * 创建loading动画
   *
   */
  const createLoading = () => {
    let loadBox = document.createElement("div");
    let loaderSVG = `
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
    `;
    loadBox.className = "zoom-loading";
    loadBox.innerHTML = loaderSVG;
    domImgLoading = loadBox;
  }

  /**
   * 创建图片加载失败的显示内容
   *
   */
  const createImgError = () => {
    let errorBox = document.createElement("div");
    let errorSVG = `
      <svg t="1576724924240" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3128" width="48" height="48">
        <path
          d="M891.552 164.096l-317.76 0.032-29.248 64.352 347.04-0.032a8.96 8.96 0 0 1 8.96 8.96v549.184a8.96 8.96 
            0 0 1-8.96 8.96h-342.4l-29.248 64.352h371.648a73.408 73.408 0 0 0 
            73.344-73.344V237.376a73.44 73.44 0 0 0-73.344-73.344zM432.544 
            795.552H132.448a8.96 8.96 0 0 1-8.96-8.96V237.408a8.96 8.96 0 0 1 
            8.96-8.96l316.704-0.032 29.248-64.352-345.984 0.032A73.44 73.44 0 0 0 
            59.072 237.44v549.184a73.408 73.408 0 0 0 73.344 73.344l330.432-0.064 
            29.248-64.352-59.584 0.064z m-6.976-185.376l-75.936-80.768-145.024 
            161.76h327.04l42.912-103.872-63.168-103.872-85.824 126.752z m-9.248-240.544a88.032 
            88.032 0 1 0-176.096 0 88.032 88.032 0 0 0 176.096 0z m158.24 321.536h265.408l-219.2-364-68.896 
            95.936 91.104 141.504-68.448 126.528z" p-id="3129" data-spm-anchor-id="a313x.7781069.0.i0"
        ></path>
      </svg>`;
    errorBox.className = "zoom-error";
    errorBox.innerHTML = errorSVG;
    domImgError = errorBox;
  }

  /**
   * 填充图片到模态框界面显示
   *
   */
  const fillImage = () => {
    let image = images[activeIndex];
    let src = image.src;
    if (!src && image.getAttribute(original)) {
      src = image.getAttribute(original);
      let i = findIndexs(unloads, "index", image.index);
      loadImage(image, i);
    }

    domImgBox.appendChild(domImgLoading);

    let img = document.createElement("img");
    img.className = "zoom-img";
    img.src = src;

    img.onload = function () {
      domImgLoading.remove();
      domImgBox.appendChild(img);
      transformZoom(getShowEndPosition())
    }

    img.onerror = function () {
      domImgLoading.remove();
      domImgBox.appendChild(domImgError);
    }

    if (activeIndex == 0) {
      if (domImgBox.querySelector("#prev-btn")) domPrevBtn.remove();
    } else {
      if (!domImgBox.querySelector("#prev-btn")) domImgBox.appendChild(domPrevBtn);
    }

    if (activeIndex >= images.length - 1) {
      if (domImgBox.querySelector("#next-btn")) domNextBtn.remove();
    } else {
      if (!domImgBox.querySelector("#next-btn")) domImgBox.appendChild(domNextBtn);
    }
  }

  /**
   * 显示图片
   *
   * @param {*} position.x 所在屏幕的x坐标
   * @param {*} position.y 所在屏幕的y坐标
   * @param {*} position.w 图片的宽
   * @param {*} position.h 图片的高
   */
  const showImage = (position) => {
    let { x, y, w, h  } = position;

    if (domImgBox.querySelector(".zoom-loading")) {
      domImgBox.querySelector(".zoom-loading").remove();
    }
    if (domImgBox.querySelector(".zoom-error")) {
      domImgBox.querySelector(".zoom-error").remove();
    }
    if (domImgBox.querySelector(".zoom-img")) {
      domImgBox.querySelector(".zoom-img").remove();
    }

    domMaskBox.style.display = "block";

    domImgBox.style.top = px(y);
    domImgBox.style.left = px(x);
    domImgBox.style.width = px(w);
    domImgBox.style.height = px(h);

    setTimeout(() => {
      transformZoom(getShowDefaultPosition());
      setTimeout(fillImage, 0);
    }, 0);
  }

  /**
   * 设置过度目标
   *
   * @param {*} position.x 最终显示的x位置
   * @param {*} position.y 最终显示的y位置
   * @param {*} position.w 最终图片的宽度
   * @param {*} position.h 最终图片的高度
   * @param {*} isOpen 是否是打开
   */
  const transformZoom = (position) => {
    let { x, y, w, h  } = position;
    // 在transformZoom(getShowDefaultPosition())后立马执行transformZoom(getShowEndPosition())不会添加两次transitionend事件，因为事件都是固定的一个eventTransitionend
    domImgBox.addEventListener("transitionend", eventTransitionend);
    if (isClose) {
      domMaskBox.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    } else {
      domMaskBox.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    }
    domImgBox.style.top = px(y);
    domImgBox.style.left = px(x);
    domImgBox.style.width = px(w);
    domImgBox.style.height = px(h);
  }

  /**
   * 上一张
   *
   * @returns
   */
  const prev = () => {
    if (activeIndex == 0) return;
    activeIndex--;
    fillImage();
  }

  /**
   * 下一张
   *
   * @returns
   */
  const next = () => {
    if (activeIndex >= images.length - 1) return;
    activeIndex++;
    fillImage();
  }

  init();
  
  return { destroy }
}));
