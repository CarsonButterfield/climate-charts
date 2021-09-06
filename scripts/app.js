const fileReader = new FileReader();
let carbonData;
let stateCount = 0
const sortedCarbonData = {}
fetch('https://datas.carbonmonitor.org/API/downloadFullDataset.php?source=carbon_us')
    .then(res => res.text())
    .then(data => {
        Papa.parse(data, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                results.data.forEach(({
                    state,
                    sector,
                    ...data
                }) => {
                    // console.log(state, sector, data)
                    if (sortedCarbonData[state]) {
                        if (sortedCarbonData[state][sector]) {
                            sortedCarbonData[state][sector].push(data)
                        } else {
                            sortedCarbonData[state][sector] = [data]
                        }
                    } else {
                        sortedCarbonData[state] = {
                            [sector]: [data]
                        }
                    }
                })
                for(state in sortedCarbonData){
                    stateCount++
                    generateStateChart(state)
                }
                console.log(stateCount)
            }
        })
       
        
    
    
    })



const generateStateChart = (state) => {
    $('body').append(`<figure class="highcharts-figure"> <div id="${state}"></div></figure>`)
    Highcharts.chart(`${state}`, {

        title: {
            text: `Carbon Chart ${state}`
        },
    
        subtitle: {
            text: 'Source: thesolarfoundation.com'
        },
    
        yAxis: {
            title: {
                text: 'Carbon Emissions'
            }
        },
    
        xAxis: {
            accessibility: {
                rangeDescription: 'Range: 2010 to 2017'
            }
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
            }
        },
    
        series: [{
            name: 'Power',
            data: sortedCarbonData[state].Power.map(datum => {
                return datum.value
            })
        }, {
            name: 'Industry',
            data: sortedCarbonData[state].Industry.map(datum => {
                return datum.value
            })
        }, {
            name: 'Domestic Aviation',
            data: sortedCarbonData[state]["Domestic Aviation"].map(datum => {
                return datum.value
            })
        }, {
            name: 'Ground Transport',
            data: sortedCarbonData[state]["Ground Transport"].map(datum => {
                return datum.value
            })
        }, {
            name: 'Residential',
            data: sortedCarbonData[state]["Residential"].map(datum => {
                return datum.value
            })
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    });
}