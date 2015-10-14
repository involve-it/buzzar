/**
 * Created by Serge on 10/13/2015.
 */
honeycomb = (function(){

    /*interface*/
    honeycomb = {
        createHoneycomb: createHoneycomb,
        augmentData: augmentData,
        removeHoneycomb: removeHoneycomb
    };

    /*almost privates:*/

    var honeycombContainer = null;
    var honeycombData = null;
    var cellCentersOffsetsFromTop = [35, 150, 265];
    var cellCentersOffsetsFromLeftOddRows = [10, 143, 276, 409, 542, 675, 808];
    var cellCentersOffsetsFromLeftEvenRows = [76, 209, 342, 475, 608, 741];
    var displayedPageNumber = 0;
    var totalPages = 0;
    var cells = [];


    function createHoneycomb(honeycombPlaceHolder, data){
        console.log("createHoneycomb launched!");
        honeycombContainer = document.createElement("div");
        honeycombContainer.className = "hc-unselectable hc-honeycomb-container"
        honeycombData = data;

        totalPages = Math.floor(honeycombData.length/20);
        honeycombContainer.innerHTML = "";
        createRoundPaginationControls();
        var pageData = cutSlice(displayedPageNumber);
        appendCells(pageData);
        renderCells();

        /*need to check if honeycombPlaceHolder is dom element before continue*/
        honeycombPlaceHolder.appendChild(honeycombContainer);
    };/*end createHoneycomb*/

    function augmentData(){
        console.log("augmentData is launched");
    };

    function removeHoneycomb(){
        console.log("removeHoneycomb is launched");
    }

    function createRoundPaginationControls(){

        var paginationPrevious = document.createElement("div");

        if(displayedPageNumber > 0){
            paginationPrevious.className = "hc-pagination hc-pagination-previous";
            paginationPrevious.addEventListener("click", decrementPage);
        }
        else{
            paginationPrevious.className = "hc-pagination hc-pagination-disabled hc-pagination-previous";
        }

        var paginationNext = document.createElement("div");
        if(displayedPageNumber < totalPages - 1){
            paginationNext.className = "hc-pagination hc-pagination-next";
            paginationNext.addEventListener("click", incrementPage);
        }
        else{
            paginationNext.className = "hc-pagination hc-pagination-disabled hc-pagination-next";
        }

        honeycombContainer.appendChild(paginationPrevious);
        honeycombContainer.appendChild(paginationNext);
    };

    function createPaginationControls(){


        var paginationPrevious = createPaginationControl();// document.createElement("div");

        if(displayedPageNumber > 0){
            //paginationPrevious.className = "hc-pagination hc-pagination-previous";
            paginationPrevious.addEventListener("click", decrementPage);
        }
        else{
            //paginationPrevious.className = "hc-pagination hc-pagination-disabled hc-pagination-previous";
        }

        var paginationNext = createNextPaginationControl();// document.createElement("div");
        if(displayedPageNumber < totalPages - 1){
            /*paginationNext.className = "hc-pagination hc-pagination-next";*/
            paginationNext.addEventListener("click", incrementPage);
        }
        else{
            /*paginationNext.className = "hc-pagination hc-pagination-disabled hc-pagination-next";*/
        }

        honeycombContainer.appendChild(paginationPrevious);
        honeycombContainer.appendChild(paginationNext);
    };

    function createPaginationControl(){
        var cellContentHolder = document.createElement("div");
        cellContentHolder.className = "hc-pagination-previous-content";
        //cellContentHolder.style.backgroundImage = "url('" + cellData.backgroundImageUrl + "')";

        var innerBounder = document.createElement("div");
        innerBounder.className = "hc-pagination-previous-inner-bounder";
        innerBounder.appendChild(cellContentHolder);

        var middleBounder = document.createElement("div");
        middleBounder.className = "hc-pagination-previous-middle-bounder";
        middleBounder.appendChild(innerBounder);


        var outerBounder = document.createElement("div");
        outerBounder.className = "hc-pagination-previous-outer-bounder";
        outerBounder.appendChild(middleBounder);

        var cell = document.createElement("div");
        cell.className = "hc-pagination-previous-wrap";
        cell.appendChild(outerBounder);
        cell.style.top = "142px";
        cell.style.left = "20px";

        return cell;

    }

    function createNextPaginationControl(){
        var cellContentHolder = document.createElement("div");
        cellContentHolder.className = "hc-pagination-next-content";
        //cellContentHolder.style.backgroundImage = "url('" + cellData.backgroundImageUrl + "')";

        var innerBounder = document.createElement("div");
        innerBounder.className = "hc-pagination-next-inner-bounder";
        innerBounder.appendChild(cellContentHolder);

        var middleBounder = document.createElement("div");
        middleBounder.className = "hc-pagination-next-middle-bounder";
        middleBounder.appendChild(innerBounder);


        var outerBounder = document.createElement("div");
        outerBounder.className = "hc-pagination-next-outer-bounder";
        outerBounder.appendChild(middleBounder);

        var cell = document.createElement("div");
        cell.className = "hc-pagination-next-wrap";
        cell.appendChild(outerBounder);
        cell.style.top = "142px";
        cell.style.left = "886px";

        return cell;

    }


    function cutSlice(num){
        pageData = honeycombData.slice(20*num, 20*num + 20);
        return pageData;
    }/*end of cutSlice...*/

    function incrementPage(){
        honeycombContainer.innerHTML = "";
        cells = [];
        /*add checking here prior incrementing*/
        displayedPageNumber ++;
        createRoundPaginationControls();
        var pageData = cutSlice(displayedPageNumber);
        appendCells(pageData);
        renderCells();
    };/*end of incrementPage...*/

    function decrementPage(){
        honeycombContainer.innerHTML = "";
        /*add checking here prior incrementing*/
        displayedPageNumber --;
        createRoundPaginationControls();
        var pageData = cutSlice(displayedPageNumber);
        appendCells(pageData);
        renderCells();
    }/*end of decrementPage*/

    function createCell(top, left, cellData){
        var cellTopNav = document.createElement("div");
        cellTopNav.className = "hc-cell-top-nav";
        var cellTopNavText = document.createTextNode(cellData.topText);
        cellTopNav.appendChild(cellTopNavText);

        var cellTextHeader = document.createElement("div");
        cellTextHeader.className = "hc-cell-text-header";
        var cellTextHeaderText = document.createTextNode(cellData.headerText);
        cellTextHeader.appendChild(cellTextHeaderText);

        var cellTextBody = document.createElement("div");
        cellTextBody.className = "hc-cell-text-body";
        var cellTextBodyText = document.createTextNode(cellData.bodyText);
        cellTextBody.appendChild(cellTextBodyText);

        var cellBottomButton = document.createElement("div");
        cellBottomButton.className = "hc-cell-bottom-button";
        var cellBottomButtonText = document.createTextNode(cellData.buttonText);
        cellBottomButton.appendChild(cellBottomButtonText);

        var cellContentHolder = document.createElement("div");
        cellContentHolder.className = "hc-cell-content";
        cellContentHolder.style.backgroundImage = "url('" + cellData.backgroundImageUrl + "')";
        cellContentHolder.appendChild(cellTopNav);
        cellContentHolder.appendChild(cellTextHeader);
        cellContentHolder.appendChild(cellTextBody);
        cellContentHolder.appendChild(cellBottomButton);

        var innerBounder = document.createElement("div");
        innerBounder.className = "hc-cell-inner-bounder";
        innerBounder.appendChild(cellContentHolder);

        var middleBounder = document.createElement("div");
        middleBounder.className = "hc-cell-middle-bounder";
        middleBounder.appendChild(innerBounder);


        var outerBounder = document.createElement("div");
        outerBounder.className = "hc-cell-outer-bounder";
        outerBounder.appendChild(middleBounder);

        var cell = document.createElement("div");
        cell.className = "hc-cell-wrap";
        cell.appendChild(outerBounder);
        cell.style.top = top+"px";
        cell.style.left = left+"px";

        cell.isMagnified = false;

        cell.cellIndex = -1;

        cell.magnify = function(){
            cell.isMagnified = true;
            cell.classList.add("hc-cell-wrap-magnified");
        };

        cell.demagnify = function(){
            cell.isMagnified = false;
            cell.classList.remove("hc-cell-wrap-magnified");
        };

        cellContentHolder.addEventListener("click", function(){
            if (cell.isMagnified){
                cell.demagnify();

            }
            else{
                demagnifyAllCellsBut(cell.cellIndex);
                cell.magnify();
            }
        });

        cellBottomButton.addEventListener("click", function(e){cellData.cellBottomButtonFunction(); e.stopPropagation()});
        /*cellBottomButton.onclick=function(){alert("clicked button"); return null;}*/
        return cell;
    }/*end createCell*/

    function appendCells(pageData){
        cells=[];
        var cell;
        for(var i = 0; i<pageData.length; i++){
            if(0 <= i && i<7){
                cell = createCell(cellCentersOffsetsFromTop[0], cellCentersOffsetsFromLeftOddRows[i], pageData[i]);
                cell.cellIndex = i;
                cells.push(cell);
                /*honeycombContainer.appendChild(cell);*/
            }
            if(7 <= i && i < 13){
                cell = createCell(cellCentersOffsetsFromTop[1], cellCentersOffsetsFromLeftEvenRows[i - 7], pageData[i]);
                cell.cellIndex = i;
                cells.push(cell);
                /*honeycombContainer.appendChild(cell);*/
            }
            if(13 <= i && i<20){
                cell = createCell(cellCentersOffsetsFromTop[2], cellCentersOffsetsFromLeftOddRows[i - 13], pageData[i]);
                cell.cellIndex = i;
                cells.push(cell);
                /*honeycombContainer.appendChild(cell);	*/
            }
        }
    }/*end appendCells*/

    function renderCells(){
        for (var i = 0; i<cells.length; i++){
            honeycombContainer.appendChild(cells[i]);
        }
    };	/*end renderCells*/

    function demagnifyAllCellsBut(cellIndex){
        for (var i = 0; i<cells.length; i++){
            if(i == cellIndex){

            }
            else{
                cells[i].demagnify();
            }
        }
    }/*end demagnifyAllCellsBut*/


    return honeycomb;

})();