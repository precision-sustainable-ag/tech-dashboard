import React, { useMemo } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from "prop-types";

const ProbabilitiesChart = (props) => {
    const data = props.data;
    
    let hash = {};
    const probabilitiesChartData = useMemo(() => {
        data.forEach(element => {
            let dateTime = new Date(element.timestamp_local.split(" ").slice(0,-1).join("T")).getTime();
            hash['P_WS_0'] ? hash['P_WS_0'].push([dateTime,element.probabilities?.P_WS_0]) : hash['P_WS_0'] = [[dateTime,element.probabilities?.P_WS_0]];
            hash['P_WS_1'] ? hash['P_WS_1'].push([dateTime,element.probabilities?.P_WS_1]) : hash['P_WS_1'] = [[dateTime,element.probabilities?.P_WS_1]];
            hash['P_WS_2'] ? hash['P_WS_2'].push([dateTime,element.probabilities?.P_WS_2]) : hash['P_WS_2'] = [[dateTime,element.probabilities?.P_WS_2]];
            hash['P_WS_3'] ? hash['P_WS_3'].push([dateTime,element.probabilities?.P_WS_3]) : hash['P_WS_3'] = [[dateTime,element.probabilities?.P_WS_3]];
            hash['P_WS_4'] ? hash['P_WS_4'].push([dateTime,element.probabilities?.P_WS_4]) : hash['P_WS_4'] = [[dateTime,element.probabilities?.P_WS_4]];
            hash['P_WS_5'] ? hash['P_WS_5'].push([dateTime,element.probabilities?.P_WS_5]) : hash['P_WS_5'] = [[dateTime,element.probabilities?.P_WS_5]];
        });
        return hash;
    }, [data]);

    let seriesOptions = [],
    names = Object.keys(probabilitiesChartData);

    names.forEach((name) => {
        seriesOptions.push({name: name, data: probabilitiesChartData[name]});
    });

    const chartOptions = {
        chart: {
            type: "scatter",
            zoomType: "xy",
        },
        title: {
            text: 'Variation of Probabilities over time'
        },
    
        subtitle: {
            text: 'Display of Probabilities field (and the subprobabilities) tracked over a given time period'
        },
    
        yAxis: {
            title: {
                text: 'Probability'
            }
        },

        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { 
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date & Time'
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
    
        series: seriesOptions,
    
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
    
    };

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

ProbabilitiesChart.propTypes = {
    data: PropTypes.any
  };

export default ProbabilitiesChart;
