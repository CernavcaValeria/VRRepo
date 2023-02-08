$(document).ready(function () {
    //table insert request simulation   
    const button = document.createElement('button');
    button.innerHTML = 'Add Table';
    document.body.appendChild(button);
    button.addEventListener('click', insertTableAction);

    //table insert request simulation 
    const buttonChart = document.createElement('button');
    buttonChart.innerHTML = 'Add Chart';
    document.body.appendChild(buttonChart);
    buttonChart.addEventListener('click', insertChartAction);

    //image insert request simulation  
    const divel = document.createElement('div');
    divel.innerHTML = '<input id="imageFile" style="display: none;" name="imageFile"type="file" class="imageFile" accept="image/*" /><br /><img src="" id="preview">';
    document.body.appendChild(divel);
    const inp = document.getElementById('imageFile');
    inp.style.display = 'none';
    const imgButton = document.createElement('button');
    imgButton.innerHTML = 'Add Image';
    document.body.appendChild(imgButton);
    imgButton.addEventListener('click', function () { inp.click(); });
    $("#imageFile").change(function (event) {
        var files = event.target.files;
        var file = files[0];

        var mainDivId = 'imageMainDivContainer' + document.getElementsByTagName('img').length.toString() + 'Id';
        var insideMainDivId = 'imageInsideDivContainer' + document.getElementsByTagName('img').length.toString() + 'Id';
        var currentImageId = 'image' + document.getElementsByTagName('img').length.toString() + 'Id';
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("preview").src = e.target.result;
                document.getElementById("preview").style.cssText = 'width: 200px';
            };

            reader.onloadend = function (e) {
                createResizibleFrameForImage(mainDivId, insideMainDivId, currentImageId);
                createResizableDivForVisualElement(mainDivId, currentImageId, 'image');
            };
            reader.readAsDataURL(file);
        }
    });
});

const TABLE_COLUMN_MAX_WIDTH = 300;
const TABLE_ROW_MAX_HEIGHT = 200;
const TABLE_COLUMN_MIN_WIDTH = 100;
const TABLE_ROW_MIN_HEIGHT = 50;

function bringToFrontCurrentClickedContainer(container, insideMainDivId) {
    const divs = document.querySelectorAll("div");
    divs.forEach(divEl => {
        divEl.style.border = 'none';
        divEl.style.zIndex = 1;
        const resizers = divEl.querySelectorAll(' .resizer');
        resizers.forEach(res => {
            res.style.border = 'none';
            res.style.visibility = 'hidden';
        });
        document.querySelectorAll("img").forEach(i => { i.style.border = '1px solid black'; });
        document.querySelectorAll("canvas").forEach(c => { c.parentNode.parentNode.style.border = '1px solid black'; });
        divEl.querySelectorAll("table").forEach(t => {
            t.style.width = getElementSize(divEl, true).toString() + 'px';
            t.style.height = getElementSize(divEl, false).toString() + 'px';
        });
    });

    container.style.zIndex = 2;
    container.style.border = '3px solid gray';
    const containerResizers = container.querySelectorAll(' .resizer');
    containerResizers.forEach(res => {
        res.style.visibility = 'visible';
        res.style.border = '3px solid gray';
    });

    container.querySelectorAll("canvas").forEach(c => { c.style.width = "width: 100%; height: 100% "; });
    container.querySelectorAll("img").forEach(i => { i.style.width = "width: 100%; height: 100%"; });
    container.querySelectorAll("table").forEach(t => {
        t.style.width = (getElementSize(container, true).toString() - 6) + 'px';
        t.style.height = (getElementSize(container, false).toString() - 4) + 'px';
    });
}

function createResizableDivForVisualElement(visualElementMainDivId, visualElementId, visualElementName) {
    const visualElement = document.getElementById(visualElementId);
    const visualElementMainDiv = document.getElementById(visualElementMainDivId);
    const resizers = visualElementMainDiv.querySelectorAll('.resizable' + ' .resizer');
    const isTableVisualElement = visualElementName === 'table';
    const isChartVisualElement = visualElementName === 'chart';

    const minimumElementWidth = isTableVisualElement ? visualElement.rows[0].cells.length * TABLE_COLUMN_MIN_WIDTH : (isChartVisualElement ? 300 : 100);
    const maximumElementWidth = isTableVisualElement ? visualElement.rows[0].cells.length * TABLE_COLUMN_MAX_WIDTH : 1000;
    const minimumElementHeight = isTableVisualElement ? visualElement.rows.length * TABLE_ROW_MIN_HEIGHT : (isChartVisualElement ? 200 : 100);
    const maximumElementHeight = isTableVisualElement ? visualElement.rows.length * TABLE_ROW_MAX_HEIGHT : 800;

    let originalMouseX = 0, originalMouseY = 0;
    let originalWidth = 0, originalHeight = 0;
    let originalX = 0, originalY = 0;
    var startResize = true;

    for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        function imageContainerMouseDownEvent(e) {
            e.preventDefault()
            originalWidth = getElementSize(visualElementMainDiv, true);
            originalHeight = getElementSize(visualElementMainDiv, false);
            originalX = visualElementMainDiv.clientX;
            originalY = visualElementMainDiv.clientY;
            originalMouseX = e.pageX;
            originalMouseY = e.pageY;
            startResize = true;
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        }

        currentResizer.addEventListener('mousedown', imageContainerMouseDownEvent);
        function stopResize() { window.removeEventListener('mousemove', resize); }

        function resize(e) {
            var width = 0, height = 0;
            if (currentResizer.classList.contains('bottom-right')) {
                width = originalWidth + (e.pageX - originalMouseX);
                height = originalHeight + (e.pageY - originalMouseY);
                if (width > minimumElementWidth && width < maximumElementWidth) {
                    visualElementMainDiv.style.width = width + 'px';
                }

                if (height > minimumElementHeight && height < maximumElementHeight) {
                    visualElementMainDiv.style.height = height + 'px';
                }
            }
            else if (currentResizer.classList.contains('bottom-left')) {
                height = originalHeight + (e.pageY - originalMouseY);
                width = originalWidth - (e.pageX - originalMouseX);
                if (width > minimumElementWidth && width < maximumElementWidth) {
                    visualElementMainDiv.style.width = width + 'px';
                    visualElementMainDiv.style.left = originalX + (e.pageX - originalMouseX) + 'px';
                }

                if (height > minimumElementHeight && height < maximumElementHeight) {
                    visualElementMainDiv.style.height = height + 'px';
                }
            }
            else if (currentResizer.classList.contains('top-right')) {
                width = originalWidth + (e.pageX - originalMouseX);
                height = originalHeight - (e.pageY - originalMouseY);
                if (width > minimumElementWidth && width < maximumElementWidth) {
                    visualElementMainDiv.style.width = width + 'px';
                }

                if (height > minimumElementHeight && height < maximumElementHeight) {
                    visualElementMainDiv.style.height = height + 'px';
                    visualElementMainDiv.style.top = originalY + (e.pageY - originalMouseY) + 'px';
                }
            }
            else {
                width = originalWidth - (e.pageX - originalMouseX);
                height = originalHeight - (e.pageY - originalMouseY);
                if (width > minimumElementWidth && width < maximumElementWidth) {
                    console.log(width);
                    visualElementMainDiv.style.width = width + 'px';
                    visualElementMainDiv.style.left = originalX + (e.pageX - originalMouseX) + 'px';
                }

                if (height > minimumElementHeight && height < maximumElementHeight) {
                    visualElementMainDiv.style.height = height + 'px';
                    visualElementMainDiv.style.top = originalY + (e.pageY - originalMouseY) + 'px';
                }
            }

            if (isTableVisualElement) {
                if (width > minimumElementWidth && width < maximumElementWidth) {
                    visualElement.style.width = (width - 5) + 'px';
                }

                if (height > minimumElementHeight && height < maximumElementHeight) {
                    visualElement.style.height = (height - 5) + 'px';
                }

                if (startResize) {
                    startResize = false;
                    return; 
                }

                if (getElementSize(visualElement, true) < minimumElementWidth) {
                    visualElementMainDiv.style.width = (minimumElementWidth + 8) + 'px';
                    visualElement.style.width = (minimumElementWidth + 3) + 'px';
                    stopResize();
                }
                else {
                    var exceedsLimit = getTableLimitAndSetTableColumnsWidthsAndLefts(visualElement, visualElementMainDiv, width);
                    if (exceedsLimit) {
                        stopResize();
                    }
                }
            }
            else if (isChartVisualElement) {
                if (width > minimumElementWidth && width < maximumElementWidth) {
                    visualElement.style.width = (width) + 'px';
                }
                if (height > minimumElementHeight && height < maximumElementHeight) {
                    visualElement.style.height = (height) + 'px';
                }
            }
        }
    }
}

function getElementSize(elem, getWidth) {
    return parseFloat(getComputedStyle(elem, null).getPropertyValue((getWidth ? 'width' : 'height')).replace('px', ''));
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function initElementMoveAction(elementContainer, currentElement, insideMainDivId) {
    let isMoving = false;
    let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
    currentElement.addEventListener("mousedown", elementDragStart);
    currentElement.addEventListener("mouseup", elementDragEnd);
    currentElement.addEventListener("mouseout", elementDragEnd);
    currentElement.addEventListener("mousemove", elementDrag);

    function elementDragStart(e) {
        bringToFrontCurrentClickedContainer(elementContainer, insideMainDivId);
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isMoving = true;
    }

    function elementDragEnd(e) {
        document.body.style.cursor = "default";
        isMoving = false;
    }

    function elementDrag(e) {
        if (isMoving) {
            if (document.body.style.cursor == "col-resize" || document.body.style.cursor == "nwse-resize") {
                isMoving = false;
                return;
            }
            document.body.style.cursor = "move";
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, elementContainer);
        }
    }
}

