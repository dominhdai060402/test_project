import React, {useState, useEffect} from 'react';
import CommonHttp from '../../services/commonHttp';
import TtdURL from '../../services/thitruongdien/ttdURL';
import {format} from 'date-fns';
import {TTThitruong} from './chartOptions';

const http = new CommonHttp();

export const useFetchAPI = ngayxem => {
  const [state, setStates] = useState({
    loading: true,
    error: '',
    giaBienMien: [],
    chartOptions: null,
    dataTT: null,
  });
  useEffect(() => {
    const onInit = async () => {
      let giaBienMien = [];
      let chartOptions = TTThitruong.chartOption3;
      let chartData = [];
      let error = '';
      let dataTT = null;
      await http
        .post(TtdURL.GetThongTinThiTruong(), {
          Ngay: ngayxem,
        })
        .then(async res => {
          giaBienMien = res.data;
        })
        .catch(err => {
          error = `${err}`;
        });

      await http
        .post(TtdURL.GetDataBieuDoThongTinThiTruong(), {
          Ngay: ngayxem,
        })
        .then(async res => {
          const data = res.data;
          dataTT = data;
          //console.log('GetDataBieuDoThongTinThiTruong:', data);
          if (data) {
            let hethong = {
              name: 'Hệ thống điện',
              //type: 'area',
              type: 'column',
              yAxis: 1,
              measure: '(MW)',
              data: [],
            };
            let genco1 = {
              name: 'Genco 1',
              //type: 'area',
              type: 'column',
              yAxis: 1,
              measure: '(MW)',
              data: [],
            };
            let thitruong = {
              name: 'Giá thị trường',
              type: 'spline',
              measure: '(đ/kWh)',
              data: [],
            };
            let giabienKRB = {
              name: 'Giá biên KRB',
              type: 'spline',
              measure: '(đ/kWh)',
              data: [],
            };

            let chuky = [];
            let i = 0;
            data.thongTinThiTruongs.map((item, index) => {
              chuky.push(item.chuKy);
              if (item.heThongDien === null) {
                i += 1;
              }
              if (i < 3) {
                hethong.data.push(item.heThongDien);
                genco1.data.push(item.genco1);
                thitruong.data.push(item.giaFMP);
                giabienKRB.data.push(item.giaBienKRB);
              }
              // if (minMN > item.heThongDien) minMN = item.heThongDien ? item.heThongDien : minMN;
              // if (minMN > item.genco1) minMN = item.genco1? item.genco1: minMN;
              // if (minMN > item.giaFMP) minMN = item.giaFMP ? item.giaFMP : minMN;
              // if (minMN > item.giaBienKRB) minMN = item.giaBienKRB ? item.giaBienKRB: minMN;
            });
            // console.log('minMN: ', minMN);
            // add data tochart
            chartData.push(hethong);
            chartData.push(genco1);
            chartData.push(thitruong);
            chartData.push(giabienKRB);
            chartOptions.xAxis.categories = chuky;
            //chartOptions.yAxis.min = minMN - 5000;
            //console.log('chartData data:', chartData);
            chartOptions.series = chartData;
          }
        })
        .catch(err => {
          error = `${err}`;
        });
        //console.log('chartOptions:', chartOptions);
      setStates({
        loading: false,
        error: error,
        giaBienMien,
        chartOptions,
        dataTT
      });
    };
    onInit();
  }, [ngayxem]);
  return state;
};
