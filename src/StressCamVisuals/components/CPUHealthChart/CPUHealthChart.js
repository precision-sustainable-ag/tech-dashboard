import React, { useMemo } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from "prop-types";

const CPUHealthChart = (props) => {
    const data = props.data;
    
    const cpuChartData = useMemo(() => {
        return data.map((record) => {
          return [
            // new Date(record.timestamp_utc.split(" ").join("T")).getTime(),
            new Date(record.timestamp_local.split(" ").slice(0,-1).join("T")).getTime(),
            record.cpu_temp,
          ];
        });
      }, [data]);

    const chartOptions = {
        chart: {
            type: "scatter",
            zoomType: "xy",
        },
        title: {
            text: 'CPU Health'
        },
        subtitle: {
            text: 'Presents the health of the CPU for farm code '+ data[0].code + ' over time'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Temperature (Degrees F)'
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
        },
    
        plotOptions: {
            series: {
                marker: {
                    enabled: true
                }
            }
        },

        boost: {
            useGPUTranslations: true,
            seriesThreshold: 100
        },
    
        colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
        series: [{name: data[0].code, boostThreshold: 100, data: cpuChartData}]
      };

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

CPUHealthChart.propTypes = {
    data: PropTypes.object
  };

export default CPUHealthChart;
