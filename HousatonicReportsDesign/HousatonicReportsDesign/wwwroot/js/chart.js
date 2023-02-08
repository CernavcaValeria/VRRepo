function initChartUsingJsonData(jsonData, chartId) {
    var chartDataParams = convertJsonDataToChartParameters(jsonData);
    var chartLabels = chartDataParams[0];
    var sums = chartDataParams[1];
    createChartUsingData(chartId, chartLabels, sums);
}

function convertJsonDataToChartParameters(jsonData) {
    var chartLabels = [];
    var sums = [];
    for (const key in jsonData[0]) {
        chartLabels.push(key);
        sums.push(0);
    }
    for (var i = 0; i < jsonData.length; i++) {
        var index = 0;
        rowData = jsonData[i];
        for (const key in rowData) {
            sums[index] += parseFloat(rowData[key]);
            index++;
        }
    }
    return [chartLabels, sums];
}

function createChartUsingData(chartId, chartLabels, sums) {
    return new Chart(document.getElementById(chartId), {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    backgroundColor: ["#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                    data: sums
                }
            ]
        },
       options: {
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                    }
                }],
            },
            legend: {
                display: false,
            }
        }
    });
}


function createResizibleFrameForChart(mainDivId, insideMainDivId, chartId, jsonData) {
    var htmlContentForImageContainer = "<div class='resizers' id = '" + insideMainDivId.toString() + "'><div class='resizer top-left'></div> <div class='resizer top-right'></div><div class='resizer bottom-left'></div> <div class='resizer bottom-right'></div></div >";
    const mainDiv = document.createElement('div');
    mainDiv.id = mainDivId.toString();
    mainDiv.className = 'resizable';
    mainDiv.innerHTML = htmlContentForImageContainer;
    document.body.appendChild(mainDiv);

    const chart = document.createElement('canvas');
    chart.id = chartId;
    mainDiv.style.width = '450px';
    mainDiv.style.height = '250px';

    var insideMainDiv = document.getElementById(insideMainDivId);
    insideMainDiv.style.width = '447px';
    insideMainDiv.style.height = '247px';
    chart.style.width = '447px';
    chart.style.height = '247px';
    insideMainDiv.appendChild(chart);
    initChartUsingJsonData(jsonData, chartId);
    initElementMoveAction(mainDiv, chart, insideMainDivId);
}


function insertChartAction() {
    const data = [
        { actual_cost: 5, remainig_cost: 2, cost: 3, cost1: 3 },
        { actual_cost: 1, remainig_cost: 5, cost: 9, cost1: 5 },
        { actual_cost: 5, remainig_cost: 2, cost: 3, cost1: 3 },
        { actual_cost: 1, remainig_cost: 6, cost: 1, cost1: 4 },
        { actual_cost: 3, remainig_cost: 2, cost: 3, cost1: 3 }
    ];

    const suffix = document.getElementsByTagName('canvas').length.toString() + 'Id';
    const chartId = 'chart' + suffix;
    var mainDivId = 'chartMainDivContainer' + suffix;
    var insideMainDivId = 'chartInsideDivContainer' + suffix;
    createResizibleFrameForChart(mainDivId, insideMainDivId, chartId, data);
    createResizableDivForVisualElement(mainDivId, chartId, 'chart');
    bringToFrontCurrentClickedContainer(document.getElementById(mainDivId), insideMainDivId);
}



