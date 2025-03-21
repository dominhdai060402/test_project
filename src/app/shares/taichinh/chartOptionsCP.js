export const ChartOptions = {
  optionsPieG1: {
    chart: {
      backgroundColor: '#f2f1f6',
      type: 'pie',
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      borderWidth: 0,
      borderColor: 'red',
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f} %',
          distance: -20,
          filter: {
            property: 'percentage',
            operator: '>',
            value: 4,
          },
        },
      },
    },
    colors: [
      '#7f18f9',
      '#4daffa',
      '#b79334',
      '#FF9900',
      '#000',
      '#0099C6',
      '#B77322',
    ],
    series: [
      {
        name: 'Share',
        innerSize: '40%',
        data: [
          {name: 'Thị trường điện', y: 61.41},
          {name: 'Doanh thu CFD', y: 11.84},
          {name: 'Doan thu khác', y: 10.85},
        ],
      },
    ],
  },
  // Chi Phí

  optionsPieCPG1: {
    chart: {
      backgroundColor: '#f2f1f6',
      type: 'pie',
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      borderWidth: 0,
      borderColor: 'red',
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f} %',
          distance: -20,
          filter: {
            property: 'percentage',
            operator: '>',
            value: 4,
          },
        },
      },
    },
    colors: [
      '#FB8832',
      '#007AFF',
      '#b79334',
      '#FF9900',
      '#000',
      '#0099C6',
      '#B77322',
    ],
    series: [
      {
        name: 'Share',
        innerSize: '40%',
        data: [
          {name: 'Biến đổi', y: 61.41},
          {name: 'Cố định', y: 11.84},
        ],
      },
    ],
  },
};
// 8*************** NEW CHART G!
export const ChartG1 = {
  demoCol: {
    chart: {
      type: 'column',
      backgroundColor: '#f2f1f6',
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      borderWidth: 0,
    },
    title: {
      text: null,
    },
    yAxis: {
      visible: true,
      allowDecimals: false,
      title: {
        text: null,
      },
    },
    xAxis: {
      visible: false,
      //categories: ['Apples', 'Oranges', 'Pears'],
    },
    legend: {
      visible: false,
      itemMarginTop: 8,
      itemMarginBottom: 8,
      align: 'right',
      verticalAlign: 'center',
      layout: 'vertical',
      //x: 0,
      //y: 100
    },
    credits: {
      enabled: false,
    },
    colors: [
      '#3596C1',
      '#E7683F',
      '#7F72E1',
      '#FF9900',
      '#000',
      '#0099C6',
      '#B77322',
    ],
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        borderRadius: 4,
      },
    },
    tooltip: {
      formatter: function () {
        return false;
      },
    },
    series: [
      {
        showInLegend: false,
        name: 'Thị trường điện',
        data: [5],
      },
      {
        showInLegend: false,
        name: 'Doanh thu CFD',
        data: [2],
      },
      {
        showInLegend: false,
        name: 'Doanh thu khác',
        data: [-3],
      },
    ],
  },
};
