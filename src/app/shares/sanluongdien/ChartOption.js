export const OptionSanluong = {
  luykenamOptions: {
    chart: {
      type: 'column',
      inverted: true,
      polar: true,
    },
    title: {
      text: null,
    },
    tooltip: {
      outside: true,
    },
    pane: {
      size: '85%',
      innerSize: '20%',
      endAngle: 270,
    },
    xAxis: {
      tickInterval: 1,
      labels: {
        align: 'right',
        useHTML: true,
        allowOverlap: true,
        step: 1,
        y: 3,
        style: {
          fontSize: '13px',
        },
      },
      lineWidth: 0,
      categories: [
        'Tổng công ty' + '</span></span>',
        'Cty con, liên kết' + '</span></span>',
        'Trực thuộc' + '</span></span>',
      ],
    },
    yAxis: {
      crosshair: {
        enabled: true,
        color: '#333',
      },
      lineWidth: 0,
      tickInterval: 10,
      reversedStacks: false,
      endOnTick: true,
      showLastLabel: true,
      max: 100,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        pointPadding: 0,
        groupPadding: 0.15,
      },
      series: {
        pointPadding: 0,
        groupPadding: 0,
        dataLabels: {
          enabled: true,
          //inside: true,
          allowOverlap: true
        },
      },
    },
    legend: {
      itemMarginTop: 8,
      itemMarginBottom:8,
    },
    colors: ['#83d5e7', '#8676ff', '#ec8a8f'],
    series: [],
  },
};
