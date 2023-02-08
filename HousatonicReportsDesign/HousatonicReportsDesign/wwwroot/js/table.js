function createResizingContainerForTable(table) {
    const divTemp = document.createElement('div');
    divTemp.className = 'tableContainer';
    divTemp.id = 'tableContainer' + document.getElementsByTagName('table').length.toString() + 'Id';
    document.body.appendChild(divTemp);
    divTemp.appendChild(table);
    divTemp.width = table.width;
    divTemp.style.cssText = "width: " + table.offsetWidth + "px;";
    return divTemp.id;
}

function getColumnWidthDistribution(table) {
    const headerCells = table.getElementsByTagName("th");
    const totalWidth = Array.from(headerCells).reduce((sum, cell) => sum + cell.offsetWidth, 0);
    const distribution = Array.from(headerCells).map(cell => (cell.offsetWidth / totalWidth) * 100);
    return distribution;
}

function getTableLimitAndSetTableColumnsWidthsAndLefts(table, mainDiv, tableWidth) {
    const distribution = table.getAttribute('colsWidthPercentDistribution').toString().split(',');
    const tableTHead = table.getElementsByTagName("th");
    const resizers = mainDiv.getElementsByClassName("yResize tableResizers");
    var leftValue = 0;
    var padding = 7;
    for (var i = 0; i < tableTHead.length; i++) {
        leftValue += (tableWidth * distribution[i]) / 100;
        resizers[i].style.cssText = "left: " + (leftValue) + "px;";
        tableTHead[i].style.cssText = "width: " + (((tableWidth * distribution[i]) / 100) - ((i == tableTHead.length - 1) ? padding : 0)) + "px;";
        if (i == tableTHead.length - 1) {
            var tableMaxidth = table.rows[0].cells.length * TABLE_COLUMN_MAX_WIDTH;
            if (leftValue > tableMaxidth) {
                resizers[i].style.cssText = "left: " + (tableMaxidth - padding) + "px;";
                table.style.width = (tableMaxidth - padding) + 'px';
                tableTHead[i].style.cssText = "width: " + (((tableWidth * distribution[i]) / 100) - padding) + "px;";
                return true;
            }
            else {
                resizers[i].style.cssText = "left: " + (leftValue - padding) + "px;";
            }
        }
    }
    return false;
}


function initTableUsingJsonData(data, currentTableTheadId) {
    const table = document.createElement('table');
    table.className = 'table';

    const header = table.createTHead();
    header.id = currentTableTheadId;
    const headerRow = header.insertRow();
    for (const key in data[0]) {
        const th = document.createElement('th');
        th.setAttribute('name', 'headerCellName');
        headerRow.appendChild(th);
        const d = document.createElement('div');
        d.innerHTML = key;
        d.style.cssText = "white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
        th.style.cssText = d.style.cssText;
        th.appendChild(d);
    }

    const body = table.createTBody();
    for (const rowData of data) {
        const bodyRow = body.insertRow();
        for (const key in rowData) {
            const cell = bodyRow.insertCell();
            const d = document.createElement('div');
            d.innerHTML = rowData[key];
            cell.style.cssText = "white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
            cell.appendChild(d);
        }
    }
    return table;
}

function createResizibleFrameForTable(mainDivId, insideMainDivId, tableContainer) {
    var htmlContentForImageContainer = "<div class='resizers' id = '" + insideMainDivId.toString() + "'><div class='resizer top-left'></div> <div class='resizer top-right'></div><div class='resizer bottom-left'></div> <div class='resizer bottom-right'></div></div >";
    const mainDiv = document.createElement('div');
    mainDiv.id = mainDivId.toString();
    mainDiv.className = 'resizable';
    mainDiv.innerHTML = htmlContentForImageContainer;
    mainDiv.style.width = tableContainer.offsetWidth + 'px';
    mainDiv.style.height = (tableContainer.offsetHeight + 5) + 'px';
    document.body.appendChild(mainDiv);

    var insideMainDiv = document.getElementById(insideMainDivId);
    insideMainDiv.style.cssText += "width: 100%";
    insideMainDiv.style.cssText += "height: 100%";
    tableContainer.style.cssText = "width: 100%";
    tableContainer.style.cssText += "height: 100%";
    insideMainDiv.appendChild(tableContainer);

    initElementMoveAction(mainDiv, tableContainer, insideMainDivId);
    bringToFrontCurrentClickedContainer(mainDiv, insideMainDivId);
}


function insertTableAction() {
    const data = [
        { name: "TaskName 4", start: "12/12/12", date: "12/12/12", finishxdfgchvbjnbhv: "12/12/12" },
        { name: "TaskName 4", start: "12/12/12", date: "12/12/12", finishxdfgchvbjnbhv: "12/12/12" },
        { name: "TaskName 4", start: "12/12/12", date: "12/12/12", finishxdfgchvbjnbhv: "12/12/12" },
        { name: "TaskName 4", start: "12/12/12", date: "12/12/12", finishxdfgchvbjnbhv: "12/12/12" }
    ];

    var suffix = document.getElementsByTagName('table').length.toString() + 'Id';
    var currentTableTheadId = 'thaed' + suffix;
    var table = initTableUsingJsonData(data, currentTableTheadId);
    var containerId = createResizingContainerForTable(table);
    var container = document.getElementById(containerId);
    var mainDivId = 'tableMainDivContainer' + suffix;
    var insideMainDivId = 'tableInsideDivContainer' + suffix;
    table.setAttribute('colsWidthPercentDistribution', getColumnWidthDistribution(table).toString());
    table.id = 'table' + suffix;

    createResizibleFrameForTable(mainDivId, insideMainDivId, container);
    createResizableDivForVisualElement(mainDivId, table.id, 'table');
    bringToFrontCurrentClickedContainer(container, '');

    //table column resizing  
    var colElement, nextElement, cursorStart = 0, dragStart = false, width, thElementWidth, nextWidth = undefined, resize, resizeLeftAttributeValue, tableWidth, resizeCheck, currentColIndex;
    var bodyRect = document.body.getBoundingClientRect();
    const tableTh = table.getElementsByTagName("th");
    const maximumTableWidth = table.rows[0].cells.length * TABLE_COLUMN_MAX_WIDTH;

    function tableColumnResizerMouseDown() {
        resize = this;
        var columnIndex = parseInt(resize.getAttribute("dataRsizeCol")) - 1;
        currentColIndex = columnIndex;
        colElement = tableTh[columnIndex];
        nextElement = tableTh[columnIndex + 1];
        dragStart = true;
        cursorStart = event.pageX;
        var elementBounds = colElement.getBoundingClientRect();
        width = elementBounds.width;
        tableWidth = table.offsetWidth;
        if (nextElement != undefined) {
            var next_bound = nextElement.getBoundingClientRect();
            nextWidth = next_bound.width;
        }
        resizeLeftAttributeValue = (this.getBoundingClientRect()).left - bodyRect.left;
    }

    var mainDivElement = document.getElementById(mainDivId);
    function tableColumnResizerMouseMove() {
        if (dragStart) {
            var cursorPosition = event.pageX;
            var mouseMoved = (cursorPosition - cursorStart);
            var initialLeft = newLeft;
            var newLeft = resizeLeftAttributeValue + mouseMoved;
            var newWidth = width + mouseMoved;
            var newNextWidth;
            if (nextElement != undefined) {
                newNextWidth = nextWidth - mouseMoved;
            }

            if (tableWidth + mouseMoved > maximumTableWidth && currentColIndex === table.rows[0].cells.length - 1) {
                return;
            }

            if (newWidth > TABLE_COLUMN_MIN_WIDTH && newWidth < TABLE_COLUMN_MAX_WIDTH && ((newNextWidth > TABLE_COLUMN_MIN_WIDTH && newNextWidth < TABLE_COLUMN_MAX_WIDTH) || nextElement == undefined)) {
                colElement.style.cssText = "width: " + newWidth + "px;";
                if (nextElement != undefined) {
                    nextElement.style.cssText = "width: " + newNextWidth + "px";
                }
                else {
                    mainDivElement.style.width = (tableWidth + mouseMoved) + "px";
                    container.style.width = (tableWidth + mouseMoved - 5) + "px";
                    table.style.width = (tableWidth + mouseMoved - 5) + "px";
                }
                resize.style.cssText = "left: " + newLeft + "px;";
            }
        }
    }

    function tableColumnResizerMouseMoveUp() {
        if (dragStart) {
            dragStart = false;
            var theadTableWidth = document.getElementById(currentTableTheadId).offsetWidth;
            var distribution = getColumnWidthDistribution(table);
            table.setAttribute('colsWidthPercentDistribution', distribution.toString());
            if (currentColIndex == tableTh.length - 1) {
                resize.style.cssText = "left: " + (theadTableWidth - 3) + "px;";
            }
            else {
                var leftValue = 0;
                for (var i = 0; i <= currentColIndex; i++) {
                    leftValue += (distribution[i] / 100) * theadTableWidth;
                }
                resize.style.cssText = "left: " + (leftValue - 3) + "px;";
            }
        }
        dragStart = false;
    }

    thElementWidth = setTdWidth(table, tableTh);
    createResizeDiv(containerId, tableTh, thElementWidth);
    initEvents(tableTh, container, thElementWidth, tableColumnResizerMouseDown, tableColumnResizerMouseMove, tableColumnResizerMouseMoveUp)
}


function initEvents(tableTh, container, thElementWidth, tableColumnResizerMouseDown, tableColumnResizerMouseMove, tableColumnResizerMouseMoveUp) {
    var tableResizers = container.getElementsByClassName("yResize tableResizers");
    var thLength = tableTh.length;
    for (var i = 0; i < thLength; i++) {
        tableResizers[i].addEventListener("mousedown", tableColumnResizerMouseDown);
        document.body.addEventListener("mousemove", tableColumnResizerMouseMove);
        document.body.addEventListener("mouseup", tableColumnResizerMouseMoveUp);
        tableTh[i].style.width = thElementWidth + "px";
    }
}

function setTdWidth(table, tableTh) {
    var elementBounds = table.getBoundingClientRect();
    var tableWidth = elementBounds.width;
    var thLength = tableTh.length;
    return tableWidth / thLength;
}

function createResizeDiv(containerId, tableTh, thElementWidth) {
    var cont = document.getElementById(containerId);
    var thLength = tableTh.length;
    for (var i = 1; i <= thLength; i++) {
        var yDiv = document.createElement("div");
        yDiv.className = "yResize tableResizers";
        yDiv.setAttribute("dataRsizeCol", i);
        yDiv.id = containerId + 'dataRsizeCol' + i + 'Id';
        var leftPos = (i * thElementWidth);
        yDiv.style.cssText = "left: " + leftPos + "px;";
        cont.append(yDiv);
    }
}
