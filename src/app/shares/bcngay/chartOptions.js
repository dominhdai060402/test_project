export const BaocaoSX = {
  chartOptions: {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      backgroundColor: '#f2f1f6',
    },
    title: {
      verticalAlign: 'middle',
      floating: true,
      text: ''
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        innerSize: '50%',
        cursor: 'pointer',
        // dataLabels: {
        //   enabled: true,
        //   format: '{point.percentage:.1f} %'
        // }
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f} %',
          distance: -30,
          filter: {
            property: 'percentage',
            operator: '>',
            value: 4
          }
        }
      }
    },
    colors: ['#84d5e8', '#ed8a8f', '#DC3912', '#FF9900', '#000', '#0099C6', '#B77322'],
    series: []
  },

  chartOptionsTD: {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      backgroundColor: '#f2f1f6',
    },
    title: {
      verticalAlign: 'middle',
      floating: true,
      text: ''
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        innerSize: '50%',
        cursor: 'pointer',
        // dataLabels: {
        //   enabled: true,
        //   format: '{point.percentage:.1f} %'
        // }
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f} %',
          distance: -50,
          filter: {
            property: 'percentage',
            operator: '>',
            value: 4
          }
        }
      }
    },
    colors: ['#84d5e8', '#ed8a8f', '#DC3912', '#FF9900', '#000', '#0099C6', '#B77322'],
    series: []
  }
};
