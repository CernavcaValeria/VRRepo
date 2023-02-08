function createResizibleFrameForImage(mainDivId, insideMainDivId, currentImageId) {
    var htmlContentForImageContainer = "<div class='resizers' id = '" + insideMainDivId.toString() + "'><div class='resizer top-left'></div> <div class='resizer top-right'></div><div class='resizer bottom-left'></div> <div class='resizer bottom-right'></div></div >";
    const mainDiv = document.createElement('div');
    mainDiv.id = mainDivId.toString();
    mainDiv.className = 'resizable';
    mainDiv.innerHTML = htmlContentForImageContainer;
    document.body.appendChild(mainDiv);

    var image = document.getElementById("preview");
    var insideMainDiv = document.getElementById(insideMainDivId);
    const newImageObj = document.createElement('img');
    newImageObj.src = image.src;
    newImageObj.id = currentImageId;
    image.style.display = 'none';
    insideMainDiv.appendChild(newImageObj);

    initElementMoveAction(mainDiv, newImageObj, insideMainDivId);
    bringToFrontCurrentClickedContainer(mainDiv, insideMainDivId);

    mainDiv.style.width = '250px';
    newImageObj.style.cssText = "width: 100%; height: 100%";
    insideMainDiv.style.cssText = "width: 100%; height: 100%";
}
