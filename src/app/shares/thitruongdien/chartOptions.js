export const TTDOptions = {
  chartOptions: {
    chart: {
      type: 'spline',
      scrollablePlotArea: {
        minWidth: 1200,
        width: 1200,
        scrollPositionX: 1,
      },
    },
    title: {
      text: 'Biểu đồ công suất',
    },
    // subtitle: {
    //   text: 'Source: WorldClimate.com',
    // },
    xAxis: {
      type: 'logarithmic',
      tickPixelInterval: 150,
      //categories: [],
    },

    yAxis: {
      title: {
        text: '(MW)',
      },
      type: 'logarithmic',
      minorTickInterval: 0.1,
    },
    // tooltip: {
    //   formatter: function () {
    //     return (
    //       '<b>' +
    //       this.series.name +
    //       '</b><br/>' +
    //       Highcharts.dateFormat('%H:%M', this.x) +
    //       '<br/>' +
    //       Highcharts.numberFormat(this.y, 2)
    //     );
    //   },
    // },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
        },
      },
    },
    // plotOptions: {
    //   line: {
    //     dataLabels: {
    //       enabled: true,
    //     },
    //     enableMouseTracking: false,
    //   },
    // },
    colors: [
      '#990099',
      '#3366CC',
      '#DC3912',
      '#FF9900',
      '#109618',
      '#0099C6',
      '#B77322',
    ],
    series: [],
  },
};

export const TTDspOptions = {
  chartOptions: {
    chart: {
      type: 'spline',
      //zoomType: 'x',
      scrollablePlotArea: {
        minWidth: 1100,
        width: 1100,
        scrollPositionX: 1,
      },
    },
    title: {
      text: null, //'Biểu đồ công suất',
    },
    subtitle: {
      text: null, //'Nguồn dữ liệu từ hệ thống scada',
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        hour: '%H %p',
        minute: '%I:%M %p',
        // second: '%I:%M:%S %p',
        // minute: '%I:%M %p',
        // hour: '%I %p',
      },
      title: {
        text: 'Thời gian',
      },
    },
    yAxis: {
      title: {
        text: null, // '(MW)',
      },
      min: 0,
    },
    // tooltip: {
    //   headerFormat: '<b>{series.name}</b><br>',
    //   pointFormat: '{point.x:%e. %b}: {point.y:.2f} m',
    // },
    tooltip: {
      //useHTML: true,
      shared: true,
      crosshairs: true,
      formatter: function () {
        return this.points.reduce(function (s, point) {
          return (
            s +
            '<br/><span style="color:' +
            point.color +
            '">' +
            point.series.name +
            ': ' +
            point.y +
            ' (MW)</span>'
          );
        }, '<b>Thời gian: ' +
          Highcharts.dateFormat('%d/%m/%Y %H:%M:%S', new Date(this.x)) +
          '</b>');
      },
    },

    plotOptions: {
      series: {
        marker: {
          enabled: true,
        },
      },
    },

    colors: [
      '#990099',
      '#3366CC',
      '#DC3912',
      '#FF9900',
      '#109618',
      '#0099C6',
      '#B77322',
    ],

    // Define the data points. All series have a dummy year
    // of 1970/71 in order to be compared on the same x axis. Note
    // that in JavaScript, months start at 0 for January, 1 for February etc.
    series: [],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            plotOptions: {
              series: {
                marker: {
                  radius: 2.5,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export const TTThitruong = {
  chartOptions: {
    chart: {
      type: 'line',
      scrollablePlotArea: {
        minWidth: 1000,
        width: 1000,
        scrollPositionX: 1,
      },
    },
    title: {
      text: null,
    },
    subtitle: {
      text: null,
    },
    xAxis: {
      categories: [],
    },
    yAxis: [
      {
        min: 0,
        title: {
          text: 'Phụ tải (MW)',
        },
      },
      {
        title: {
          text: 'Giá FMP (VNĐ)',
        },
        opposite: true,
      },
    ],
    legend: {
      shadow: false,
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      column: {
        grouping: false,
        shadow: false,
        borderWidth: 0,
      },
    },
    colors: [
      '#990099',
      '#3366CC',
      '#DC3912',
      '#FF9900',
      '#109618',
      '#0099C6',
      '#B77322',
    ],
    series: [],
  },
  chartOption2: {
    chart: {
      zoomType: 'xy',
      scrollablePlotArea: {
        minWidth: 900,
        width: 900,
        scrollPositionX: 1,
      },
    },
    title: {
      text: null, //'Average Monthly Weather Data for Tokyo',
      align: 'left',
    },

    xAxis: [
      {
        categories: [],
        crosshair: true,
      },
    ],
    yAxis: [
      {
        title: {
          text: null, // 'Giá FMP (VNĐ)',
        },
        opposite: true,
      },
      {
        gridLineWidth: 0,
        title: {
          text: null, //'Phụ tải (MW)',
          style: {
            color: '#006B1E',
          },
        },
      },
    ],
    tooltip: {
      shared: true,
      crosshairs: true,
      formatter: function () {
        return this.points.reduce(function (s, point) {
          return (
            s +
            '<br/><span style="color:' +
            point.color +
            '">' +
            point.series.name +
            ': ' +
            Highcharts.numberFormat(point.y, 0, '', ',') +
            ' ' +
            point.series.options.measure +
            '</span>'
          );
        }, '<b>Chu kỳ: ' + this.x + '</b>');
      },
    },
    colors: [
      '#dcaff3',
      '#92c6f7',
      '#4fd280',
      '#f9936e',
      '#109618',
      '#0099C6',
      '#B77322',
    ],
    plotOptions: {
      area: {
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    series: [],
  },

  // Option3
  chartOption3: {
    chart: {
      type: 'spline',
      zoomType: 'xy',
      scrollablePlotArea: {
        minWidth: 900,
        width: 900,
        scrollPositionX: 1,
      },
      spline: {
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 2,
          },
        },
        marker: {
          enabled: false,
        },
      },
    },

    title: {
      text: null,
    },
    xAxis: {
      allowDecimals: false,
      labels: {
        formatter: function () {
          return this.value;
        },
      },
      categories: [1, 2, 3, 4, 5, 6, 7, 8],
      crosshair: true,
    },
    yAxis: [
      {
        // Primary yAxis
        title: {
          text: null,
        },
      },
      {
        // Secondary yAxis
        title: {
          text: null,
        },
        opposite: true,
      },
    ],

    plotOptions: {
      column: {
        stacking: 'normal'
      },
      // series: {
      //   borderRadius: 4,
      // }
    },
    tooltip: {
      shared: true,
    },
    colors: [
      '#dcaff3',
      '#92c6f7',
      '#4fd280',
      '#f9936e',
      '#109618',
      '#0099C6',
      '#B77322',
    ],
    legend: {
      //padding: 8,
      itemMarginTop: 8,
      itemMarginBottom:8,
    },
    series: [
      {
        name: 'Hệ thống điện',
        type: 'column',
        yAxis: 1,
        data: [
          20920.3, 20739.4, 20773.5, 20621.9, 20281.2, 19757.6, 19821.3,
          19646.2,
        ],
      },
      {
        name: 'Genco 1',
        type: 'column',
        yAxis: 1,
        data: [2446, 2439.612, 2446, 2430.236, 2418.961, 2412, 2412, 2412],
      },
      {
        name: 'Giá thị trường',
        data: [
          1229.209, 1216.383, 1209.143, 1202.421, 1196.339, 1178.517, 1183.169,
          1191.584,
        ],
      },
      {
        name: 'Giá biên KRB',
        data: [768, 750, 680, 750, 719, 1, 1, 1],
      },
    ],
  },
};
