export const chartOptions = {
  optDientudungTD: {
    chart: {
      type: 'column',
      zoomType: 'xy',
      scrollablePlotArea: {
        minWidth: 600,
        width: 600,
        scrollPositionX: 1,
      },
    },
    title: {
      text: null,//'Monthly Average Rainfall',
    },
    subtitle: {
      text: null,
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: null,
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          rotation: -90,
          verticalAlign: 'top',
          align: 'center',
          x: 0,
          y: -16,
          formatter: function () {
            //return this.y;
            return Highcharts.numberFormat(this.y,2, ".", ",");
          },
        },
      },
    },
    colors: [
      '#c3f0d4',
      '#72dc99',
      '#38c86d',
      '#FF9900',
      '#109618',
      '#0099C6',
      '#B77322',
    ],
    series: [
      {
        name: 'PPA',
        data: [
          49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
          95.6, 54.4,
        ],
      },
      {
        name: 'Năm',
        data: [
          83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6,
          92.3,
        ],
      },
      {
        name: 'Ngày',
        data: [
          48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3,
          51.2,
        ],
      },
    ],
  },

  optDientudung: {
    chart: {
      type: 'column',
      zoomType: 'xy',
      scrollablePlotArea: {
        minWidth: 600,
        width: 600,
        scrollPositionX: 1,
      },
    },
    title: {
      text: null,//'Monthly Average Rainfall',
    },
    subtitle: {
      text: null,
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: null,
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          rotation: -90,
          verticalAlign: 'top',
          align: 'center',
          x: 0,
          y: -16,
          formatter: function () {
            //return this.y;
            return Highcharts.numberFormat(this.y,2, ".", ",");
          },
        },
      },
    },
    colors: [
      '#c6d8f0',
      '#7aa4dc',
      '#407ccc',
      '#FF9900',
      '#109618',
      '#0099C6',
      '#B77322',
    ],
    series: [
      {
        name: 'PPA',
        data: [
          49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
          95.6, 54.4,
        ],
      },
      {
        name: 'Năm',
        data: [
          83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6,
          92.3,
        ],
      },
      {
        name: 'Ngày',
        data: [
          48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3,
          51.2,
        ],
      },
    ],
  },

  optSuathaonhiet: {
    chart: {
      type: 'column',
      zoomType: 'xy',
      scrollablePlotArea: {
        minWidth: 600,
        width: 600,
        scrollPositionX: 1,
      },
    },
    title: {
      text: null,//'Monthly Average Rainfall',
    },
    subtitle: {
      text: null,
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: null,
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          rotation: -90,
          verticalAlign: 'top',
          align: 'center',
          x: 0,
          y: -16,
          formatter: function () {
            //return this.y;
            return Highcharts.numberFormat(this.y,2, ".", ",");
          },
        },
      },
    },
    colors: [
      '#abcbda',
      '#70b1cd',
      '#3596c1',
      '#FF9900',
      '#109618',
      '#0099C6',
      '#B77322',
    ],
    series: [
      {
        name: 'PPA',
        data: [
          49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
          95.6, 54.4,
        ],
      },
      {
        name: 'Năm',
        data: [
          83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6,
          92.3,
        ],
      },
      {
        name: 'Ngày',
        data: [
          48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3,
          51.2,
        ],
      },
    ],
  },
  optHesokhadung: {
    chart: {
      type: 'column',
      zoomType: 'xy',
      scrollablePlotArea: {
        minWidth: 600,
        width: 600,
        scrollPositionX: 1,
      },
    },
    title: {
      text: null,//'Hệ số khả dụng',
    },
    subtitle: {
      text: null,
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: null,
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          rotation: -90,
          verticalAlign: 'top',
          align: 'center',
          x: 0,
          y: -16,
          formatter: function () {
            //return this.y;
            return Highcharts.numberFormat(this.y,2, ".", ",");
          },
        },
      },
    },
    colors: [
      '#f5c3b2',
      '#e7683f',
      '#DC3912',
      '#FF9900',
      '#109618',
      '#0099C6',
      '#B77322',
    ],
    series: [
      {
        name: 'Kế hoạch',
        data: [
          83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6,
          92.3,
        ],
      },
      {
        name: 'Thực hiện',
        data: [
          48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3,
          51.2,
        ],
      },
    ],
  },
  optTyledungmay: {
    chart: {
      type: 'column',
      zoomType: 'xy',
      scrollablePlotArea: {
        minWidth: 600,
        width: 600,
        scrollPositionX: 1,
      },
    },
    title: {
      text: null,//'Hệ số khả dụng',
    },
    subtitle: {
      text: null,
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: null,
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          rotation: -90,
          verticalAlign: 'top',
          align: 'center',
          x: 0,
          y: -16,
          formatter: function () {
            //return this.y;
            return Highcharts.numberFormat(this.y,2, ".", ",");
          },
        },
      },
    },
    colors: [
      '#bcb7e3',
      '#7f72e1',
      '#DC3912',
      '#FF9900',
      '#109618',
      '#0099C6',
      '#B77322',
    ],
    series: [
      {
        name: 'Kế hoạch',
        data: [
          83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6,
          92.3,
        ],
      },
      {
        name: 'Thực hiện',
        data: [
          48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3,
          51.2,
        ],
      },
    ],
  },
};

/*

var chart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Summer Olympics 2016 - Top 5 countries by Gold medals',
        align: 'left'
    },

    plotOptions: {
        series: {
            grouping: false,
            borderWidth: 0
        }
    },
    legend: {
        enabled: true
    },
    tooltip: {
        shared: true,
        headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} medals</b><br/>'
    },
    xAxis: {
        type: 'category',
        labels: {
            useHTML: true,
            animate: true,

        }
    },
    yAxis: [{
        title: {
            text: 'Gold medals'
        },
        showFirstLabel: true
    }],
    series: [{
        color: 'rgb(158, 159, 163)',
        pointPlacement: -0.2,
        linkedTo: 'main',
        data: [
        ['GENCO1', 46],
        ['NS1', 0],
        ['UB', 0],
        ['DH1', 11],
        ['DH3', 24],
        ['QN', 38],
        ['DH3MR', 29],
    ],
        name: '2012',
         dataLabels: [{
            enabled: true,
            inside: true,

        }],
    }, {
        name: '2016',
        dataLabels: [{
            enabled: true,
            inside: true,

        }],
        data: [{
  color: "rgb(201, 36, 39)",
  name: "GENCO1",
  y: 10
}, {
  color: "rgb(201, 36, 39)",
  name: "NS1",
  y: 0
}, {
  color: "rgb(0, 82, 180)",
  name: "UB",
  y: 0
}, {
  color: "rgb(0, 0, 0)",
  name: "DH1",
  y: 17
}, {
  color: "rgb(240, 240, 240)",
  name: "DH3",
  y: 19
}, {
  color: "rgb(255, 217, 68)",
  name: "QN",
  y: 26
}, {
  color: "rgb(0, 82, 180)",
  name: "DH3MR",
  y: 27
}]
    }],
});


*/
