import _ from 'lodash';
import {useEffect, useState} from 'react';
import CommonHttp from '../../services/commonHttp';
import SanluongURL from '../../services/thitruongdien/sanluongURL';
import {format, subDays} from 'date-fns';
import {OptionSanluong} from './ChartOption';

const http = new CommonHttp();

export const useFetchAPI = date => {
  const [state, setStates] = useState({
    slNgay: [],
    slThang: [],
    slNam: [],
    //slMuakho: [],
    tSLNgay: [],
    tSLThang: [],
    tSLNam: [],
    khoiND: null,
    khoiTD: null,
    chartNam: null,
    chartND: null,
    chartTD: null,
    loading: true,
    error: '',
  });
  useEffect(() => {
    const onInit = async () => {
      let slNgay = [];
      let slThang = [];
      let slNam = [];
      let chartND = null;
      let chartTD = null;
      //let slMuakho = [];
      let error = '';
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const cDate = _.cloneDeep(date);
      const ngayd1 = subDays(cDate, 1);
      const ngayxem = format(ngayd1, 'dd-MM-yyyy');
      let chartNam = {}; // OptionSanluong.luykenamOptions;
      await http
        .post(SanluongURL.GetSanLuongD1(), {
          Ngay: ngayxem,
        })
        .then(async res => {
          //console.log('data:', res.data);
          const data = res.data;

          if (data) {
            slNgay = _.orderBy(
              data,
              ['idLoaiNhaMay', 'tenNhaMay'],
              ['asc', 'asc'],
            );
            addSumGroup(slNgay);
          }
        })
        .catch(err => {
          error = `${err}`;
        });
      await http
        .post(SanluongURL.GetSanLuongThang(), {
          Thang: month,
          Nam: year,
        })
        .then(async res => {
          const data = res.data;
          //console.log('GetSanLuongThang:', data);
          if (data) {
            slThang = _.orderBy(
              data,
              ['idLoaiNhaMay', 'tenNhaMay'],
              ['asc', 'asc'],
            );
            addSumGroup(slThang);
          }
        })
        .catch(err => {
          error = `${err}`;
        });
      await http
        .post(SanluongURL.GetSanLuongNam(), {
          Nam: year,
        })
        .then(async res => {
          const data = res.data;
          //console.log('GetSanLuongNam:', data);
          if (data) {
            slNam = _.orderBy(
              data,
              ['idLoaiNhaMay', 'tenNhaMay'],
              ['asc', 'asc'],
            );
            addSumGroup(slNam);
          }
        })
        .catch(err => {
          error = `${err}`;
        });
      // await http
      //   .post(SanluongURL.GetSanLuongTheoKhoi(), {
      //     IdLoaiHinh: 1,
      //     Ngay: ngayxem,
      //   })
      //   .then(async res => {
      //     const data = res.data;
      //     if (data) {
      //       slMuakho = _.orderBy(
      //         data,
      //         ['idLoaiNhaMay', 'tenNhaMay'],
      //         ['asc', 'asc'],
      //       );
      //       addSumGroup(slMuakho);
      //     }
      //   })
      //   .catch(err => {
      //     error = `${err}`;
      //   });

      // await http
      //   .post(SanluongURL.GetSanLuongTheoKhoi(), {
      //     IdLoaiHinh: 2,
      //     Ngay: ngayxem,
      //   })
      //   .then(async res => {
      //     const data = res.data;
      //     if (data) {
      //       slMuakho = _.orderBy(
      //         data,
      //         ['idLoaiNhaMay', 'tenNhaMay'],
      //         ['asc', 'asc'],
      //       );
      //       addSumGroup(slMuakho);
      //     }
      //   })
      //   .catch(err => {
      //     error = `${err}`;
      //   });

      // await http
      //   .post(SanluongURL.GetSanLuongMuaKho(), {
      //     Nam: year,
      //   })
      //   .then(async res => {
      //     const data = res.data;
      //     if (data) {
      //       slMuakho = _.orderBy(
      //         data,
      //         ['idLoaiNhaMay', 'tenNhaMay'],
      //         ['asc', 'asc'],
      //       );
      //       addSumGroup(slMuakho);
      //     }
      //   })
      //   .catch(err => {
      //     error = `${err}`;
      //   });
      const tSLNgay = onTHLuykeThang(slNgay);
      const tSLThang = onTHLuykeThang(slThang);
      const tSLNam = onTHLuykeThang(slNam);

      // const series = [
      //   {
      //     name: 'Genco 1',
      //     data: [tSLNam[4]?.tyLe, 0, 0],
      //   },
      //   {
      //     name: 'Cty con, liên kết',
      //     data: [0, tSLNam[3]?.tyLe, 0],
      //   },
      //   {
      //     name: 'Trực thuộc',
      //     data: [0, 0, tSLNam[2]?.tyLe],
      //   },
      // ];

      // const categories = [
      //   `<b>${tSLNam[4]?.thucHien.toLocaleString('vi-VN')}</b>` +
      //     '</span></span>',
      //   `<b>${tSLNam[3]?.thucHien.toLocaleString('vi-VN')}</b>` +
      //     '</span></span>',
      //   `<b>${tSLNam[2]?.thucHien.toLocaleString('vi-VN')}</b>` +
      //     '</span></span>',
      // ];
      // chartNam.xAxis.categories = categories;
      // chartNam.series = series;
      chartNam = createDataBieudo(tSLNgay);
      chartND = createDataBieudoND(tSLNgay);
      chartTD = createDataBieudoTD(tSLNgay);
      setStates({
        loading: false,
        slNgay,
        slThang,
        slNam,
        //slMuakho,
        tSLNgay,
        tSLThang,
        tSLNam,
        chartNam,
        chartND,
        chartTD,
        error,
      });
    };
    onInit();
  }, [date]);

  const addSumGroup = lsData => {
    let tkh = 0;
    let tth = 0;
    let pkh = 0;
    let pth = 0;
    let lkkh = 0;
    let lkth = 0;

    let tdkh = 0;
    let tdth = 0;
    let ndkh = 0;
    let ndth = 0;

    let lktdkh = 0;
    let lktdth = 0;
    let lkndkh = 0;
    let lkndth = 0;

    // Theo khối ND,
    //let
    // Theo khối TD;

    lsData.map((item, index) => {
      tkh += item.keHoach;
      tth += item.thucHien;
      if (item.idLoaiDonVi === 1) {
        pkh += item.keHoach;
        pth += item.thucHien;
        if (item.idLoaiNhaMay === 1) {
          tdkh += item.keHoach;
          tdth += item.thucHien;
        }
        if (item.idLoaiNhaMay === 2) {
          ndkh += item.keHoach;
          ndth += item.thucHien;
        }
      }
      if (item.idLoaiDonVi === 2 || item.idLoaiDonVi === 3) {
        lkkh += item.keHoach;
        lkth += item.thucHien;
        if (item.idLoaiNhaMay === 1) {
          lktdkh += item.keHoach;
          lktdth += item.thucHien;
        }
        if (item.idLoaiNhaMay === 2) {
          lkndkh += item.keHoach;
          lkndth += item.thucHien;
        }
      }
    });
    let genco1 = createObject('Genco 1', null);

    let thuydien = createObject('Thủy điện', 1);
    let nhietdien = createObject('Nhiệt điện', 1);
    let phuth = createObject('Trực thuộc', 1);

    let lkthuydien = createObject('Thủy điện', 2);
    let lknhietdien = createObject('Nhiệt điện', 2);
    let conlk = createObject('Liên kết', 2);

    // Theo khoi nhiệt diện
    //let tt_nd = createObject('Trực thuộc nhiệt điện', 1);
    //let lk_nd = createObject('Liên kết nhiệt điện', 2);
    // Theo khối thuỷ điện
    //let tt_td = createObject('Trực thuộc thuỷ điện', 2);
    //let lk_td = createObject('Liên kết thuỷ điện', 2);

    genco1.keHoach = parseFloat(tkh.toFixed(1));
    genco1.thucHien = parseFloat(tth.toFixed(1));
    genco1.tyLe = parseFloat(((tth / tkh) * 100).toFixed(1));

    phuth.keHoach = parseFloat(pkh.toFixed(1));
    phuth.thucHien = parseFloat(pth.toFixed(1));
    phuth.tyLe = parseFloat(((pth / pkh) * 100).toFixed(1));

    conlk.keHoach = parseFloat(lkkh.toFixed(1));
    conlk.thucHien = parseFloat(lkth.toFixed(1));
    conlk.tyLe = parseFloat(((lkth / lkkh) * 100).toFixed(1));

    thuydien.keHoach = parseFloat(tdkh.toFixed(1));
    thuydien.thucHien = parseFloat(tdth.toFixed(1));
    thuydien.tyLe = parseFloat(((tdth / tdkh) * 100).toFixed(1));

    nhietdien.keHoach = parseFloat(ndkh.toFixed(1));
    nhietdien.thucHien = parseFloat(ndth.toFixed(1));
    nhietdien.tyLe = parseFloat(((ndth / ndkh) * 100).toFixed(1));

    lkthuydien.keHoach = parseFloat(lktdkh.toFixed(1));
    lkthuydien.thucHien = parseFloat(lktdth.toFixed(1));
    lkthuydien.tyLe = parseFloat(((lktdth / lktdkh) * 100).toFixed(1));

    lknhietdien.keHoach = parseFloat(lkndkh.toFixed(1));
    lknhietdien.thucHien = parseFloat(lkndth.toFixed(1));
    lknhietdien.tyLe = parseFloat(((lkndth / lkndkh) * 100).toFixed(1));

    lsData.splice(0, 0, thuydien);
    lsData.splice(0, 0, lkthuydien);
    const ndIndex = lsData.findIndex(e => e.idLoaiNhaMay === 2);
    lsData.splice(ndIndex, 0, nhietdien);
    lsData.splice(ndIndex, 0, lknhietdien);

    lsData.push(phuth);
    lsData.push(conlk);
    lsData.push(genco1);
    // Theo khối ND
    //lsData.push(tt_nd);
    //lsData.push(lk_nd);
    // Theo khối TD
    //lsData.push(tt_td);
    //lsData.push(lk_td);
  };

  return state;
};

export const onTHLuykeThang = data => {
  console.log('onTHLuykeThang:', data);
  const lIndex = data.length;
  const ndIndex = data.findIndex(e => e.idLoaiNhaMay === 2);
  const tThuydien = onSumTHND_TD(data[0], data[1]);
  const tNhiendien = onSumTHND_TD(data[ndIndex - 2], data[ndIndex - 1]);
  // Theo khoi nhiệt diện
  let tt_nd = data.find(item => item.idLoaiDonVi == 1 && item.tenNhaMay =='Nhiệt điện');
  let lk_nd = data.find(item => item.idLoaiDonVi == 2 && item.tenNhaMay =='Nhiệt điện');
  // Theo khối thuỷ điện
  let tt_td = data.find(item => item.idLoaiDonVi == 1 && item.tenNhaMay =='Thủy điện');
  let lk_td = data.find(item => item.idLoaiDonVi == 2 && item.tenNhaMay =='Thủy điện');

  let dataTH = [
    tThuydien,
    tNhiendien,
    data[lIndex - 3],
    data[lIndex - 2],
    data[lIndex - 1],
    tt_nd,lk_nd,
    tt_td,lk_td,
  ];
  dataTH.map((item, index) => {
    item.group = true;
  });
  return dataTH;
};

const createObject = (name, type) => {
  return {
    idLoaiDonVi: type,
    idLoaiNhaMay: 0,
    tenNhaMay: name,
    keHoach: 0,
    thucHien: 0,
    tyLe: 0,
    sumGroup: true,
  };
};

const onSumTHND_TD = (obj1, obj2) => {
  const nData = createObject(obj1?.tenNhaMay, obj1?.idLoaiDonVi);
  const kh = obj1.keHoach + obj2.keHoach;
  const th = obj1.thucHien + obj2.thucHien;
  nData.keHoach = parseFloat(kh.toFixed(1));
  nData.thucHien = parseFloat(th.toFixed(1));
  nData.tyLe = parseFloat(((th / kh) * 100).toFixed(1));
  return nData;
};

export const createDataBieudo = tSLNam => {
  let chartNam = _.cloneDeep(OptionSanluong.luykenamOptions);
  const series = [
    {
      name: 'Genco 1',
      data: [tSLNam[4]?.tyLe, 0, 0],
    },
    {
      name: 'Cty con, liên kết',
      data: [0, tSLNam[3]?.tyLe, 0],
    },
    {
      name: 'Trực thuộc',
      data: [0, 0, tSLNam[2]?.tyLe],
    },
  ];

  const categories = [
    `<b>${tSLNam[4]?.thucHien.toLocaleString('vi-VN')}</b>` + '</span></span>',
    `<b>${tSLNam[3]?.thucHien.toLocaleString('vi-VN')}</b>` + '</span></span>',
    `<b>${tSLNam[2]?.thucHien.toLocaleString('vi-VN')}</b>` + '</span></span>',
  ];
  chartNam.xAxis.categories = categories;
  chartNam.series = series;
  return chartNam;
};

export const createDataBieudoND = tSLNam => {
  let chartNam = _.cloneDeep(OptionSanluong.luykenamOptions);
  const series = [
    {
      name: 'Tổng khối nhiệt điện',
      data: [tSLNam[1]?.tyLe, 0, 0],
    },
    {
      name: 'Cty con, liên kết',
      data: [0, tSLNam[5]?.tyLe, 0],
    },
    {
      name: 'Trực thuộc',
      data: [0, 0, tSLNam[6]?.tyLe],
    },
  ];

  const categories = [
    `<b>${tSLNam[1]?.thucHien.toLocaleString('vi-VN')}</b>` + '</span></span>',
    `<b>${tSLNam[5]?.thucHien.toLocaleString('vi-VN')}</b>` + '</span></span>',
    `<b>${tSLNam[6]?.thucHien.toLocaleString('vi-VN')}</b>` + '</span></span>',
  ];
  chartNam.xAxis.categories = categories;
  chartNam.series = series;
  return chartNam;
};

export const createDataBieudoTD = tSLNam => {
  let chartNam = _.cloneDeep(OptionSanluong.luykenamOptions);
  const series = [
    {
      name: 'Tổng khối thuỷ điện',
      data: [tSLNam[0]?.tyLe, 0, 0],
    },
    {
      name: 'Cty con, liên kết',
      data: [0, tSLNam[7]?.tyLe, 0],
    },
    {
      name: 'Trực thuộc',
      data: [0, 0, tSLNam[8]?.tyLe],
    },
  ];

  const categories = [
    `<b>${tSLNam[0]?.thucHien.toLocaleString('vi-VN')}</b>` + '</span></span>',
    `<b>${tSLNam[7]?.thucHien.toLocaleString('vi-VN')}</b>` + '</span></span>',
    `<b>${tSLNam[8]?.thucHien.toLocaleString('vi-VN')}</b>` + '</span></span>',
  ];
  chartNam.xAxis.categories = categories;
  chartNam.series = series;
  return chartNam;
};
