import React, { useMemo } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from "prop-types";

const SDSpaceChart = (props) => {
    const data = props.data;
    
    const sdSpaceChartData = useMemo(() => {
        return data.map((record) => {
          return [
            // new Date(record.timestamp_utc.split(" ").join("T")).getTime(),
            new Date(record.timestamp_local.split(" ").slice(0,-1).join("T")).getTime(),
            record.sd_free,
          ];
        });
      }, [data]);

    const chartOptions = {
        chart: {
            type: "scatter",
            zoomType: "xy",
        },
        title: {
            text: 'Free SD Card Space'
        },
        subtitle: {
            text: 'Presents the available SD Card Space in the CPU memory for farm code '+ data[0].code + ' over time'
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
                text: 'Free Space (in MBs)'
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
    
        colors: ['#06C', '#036', '#000', '#6CF', '#39F', ],
        series: [{name: data[0].code, boostThreshold: 100, data: sdSpaceChartData}]
      };

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

SDSpaceChart.propTypes = {
    data: PropTypes.object
  };

export default SDSpaceChart;
