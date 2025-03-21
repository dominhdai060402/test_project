import React, {useState, useEffect} from 'react';
import CommonHttp from '../../services/commonHttp';
import TtdURL from '../../services/thitruongdien/ttdURL';
import {format} from 'date-fns';

const http = new CommonHttp();

export const useFetchAPI = year => {
  const [state, setStates] = useState({
    data: [],
    loading: true,
    lenDaitu: 0,
    lenTrungtu: 0,
    lenTieudu: 0,
    error: '',
  });
  useEffect(() => {
    const onInit = async () => {
      let factorys = [];
      let lenDaitu = 0;
      let lenTrungtu = 0;
      let lenTieudu = 0;
      await http
        .post(TtdURL.GetSuaChuaToMay(), {
          Nam: year,
        })
        .then(res => {
          const data = res.data;
          if (data) {
            const daitu = data.filter(a => a.loaiBaoDuong === 'SCLDT');
            const trungtu = data.filter(a => a.loaiBaoDuong === 'SCLTrT');
            const tieutu = data.filter(a => a.loaiBaoDuong === 'SCTT');

            lenDaitu = daitu ? daitu.length : 0;
            lenTrungtu = trungtu ? trungtu.length : 0;
            lenTieudu = tieutu ? tieutu.length : 0;

            data.map((item, index) => {
              const startKH = new Date(item.thoiGianBatDauKeHoach);
              const endKH = new Date(item.thoiGianKetThucKeHoach);

              item.loaiTuSua =
                item.loaiBaoDuong === 'SCLDT'
                  ? 'Đại tu'
                  : item.loaiBaoDuong === 'SCTT'
                  ? 'Tiểu tu'
                  : 'Trung tu';
              let startTH = null;
              let endTH = null;

              if (item.thoiGianBatDauThucTe) {
                startTH = new Date(item.thoiGianBatDauThucTe);
                item.thoiGianBatDauThucTe = format(startTH, 'dd-MM-yyyy');
              }
              if (item.thoiGianKetThucThucTe) {
                endTH = new Date(item.thoiGianKetThucThucTe);
                item.thoiGianKetThucThucTe = format(endTH, 'dd-MM-yyyy');

                item.timeTH = (
                  (endTH - startTH) / (24 * 60 * 60 * 1000) +
                  1
                ).toFixed(1);
              }

              let month1 = startKH.getMonth() + 1;
              let month2 = endKH.getMonth() + 1;

              item.timeKH = Math.round(
                (endKH - startKH) / (24 * 60 * 60 * 1000),
              );

              item.thoiGianBatDauKeHoach = format(startKH, 'dd-MM-yyyy');
              item.thoiGianKetThucKeHoach = format(endKH, 'dd-MM-yyyy');

              if (month1 === month2) {
                let nItem = {tomay: item, name: item.tenToMay, event: [month1]};
                factorys.push(nItem);
              } else {
                let nItem = {
                  tomay: item,
                  name: item.tenToMay,
                  event: [month1, month2],
                };
                factorys.push(nItem);
              }
            });
          }
          setStates({
            data: factorys,
            loading: false,
            error: '',
            lenDaitu,
            lenTrungtu,
            lenTieudu,
          });
          //setData(factorys);
        })
        .catch(error => {
          setStates({data: [], loading: false, error: `${error}`});
        });
      //setLoading(false);
    };
    onInit();
  }, [year]);
  return state;
};
