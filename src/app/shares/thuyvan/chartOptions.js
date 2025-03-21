export const Thuyvan = {
  chartOptions: {
    chart: {
      type: 'spline',
      // scrollablePlotArea: {
      //   minWidth: 1000,
      //   width: 1000,
      //   scrollPositionX: 1,
      // },
    },
    title: {
      text: null,
    },
    // subtitle: {
    //   text: 'Irregular time data in Highcharts JS',
    // },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%m',
        // millisecond: '%H:%M:%S.%L',
        // second: '%H:%M:%S',
        // minute: '%H:%M',
        // hour: '%H:%M',
        // day: '%e. %b',
        // week: '%e. %b',
        // month: '%b \'%y',
        // year: '%Y'
      },
      //max: Date.UTC(2021, 12, 31, 0)
      //categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      // title: {
      //   text: 'Thời gian (Tháng)',
      // },
      // Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',new Date(this.x)) + '</b>');
    },
    yAxis: {
      title: {
        text: '',
      },
      min: 150,
    },
    legend: {
      //padding: 8,
      itemMarginTop: 8,
      itemMarginBottom: 8,
    },

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
            point.y +
            ' (m)</span>'
          );
        }, '<b>Thời gian: ' +
          Highcharts.dateFormat('%d/%m/%Y', new Date(this.x)) +
          '</b>');
      },
    },

    plotOptions: {
      //   spline: {
      //     lineWidth: 2,
      //     states: {
      //         hover: {
      //             lineWidth: 2
      //         }
      //     },
      //     marker: {
      //         enabled: false
      //     },
      // },
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
      '#000',
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
                  radius: 0.1,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export const ThuyvanNgayD = {
  chartOptions: {
    chart: {
      type: 'line',
      //zoomType: 'x',
      // scrollablePlotArea: {
      //   minWidth: 1100,
      //   width: 1100,
      //   scrollPositionX: 1,
      // },
    },
    title: {
      text: null, //'Biểu đồ công suất',
    },
    subtitle: {
      text: 'Mực nước và lưu lượng về hồ', //'Nguồn dữ liệu từ hệ thống scada',
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
    yAxis: [
      {
        title: {
          text: null, // '(MW)',
        },
        min: 0,
      },
      { 
        title: {
            text: null,
            style: {
                color: '#3366CC'
            }
        },
        labels: {
            //format: '{value} mm',
            style: {
                color: '#3366CC'
            }
        },
        opposite: true
    }
    ],
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
            '</span>'
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
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: true,
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
