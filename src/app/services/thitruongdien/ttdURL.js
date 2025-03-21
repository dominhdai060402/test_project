export default class TtdURL {
  static getCongSuatScada = () => {
    return `api/Scada/GetCongSuatScada`;
  };

  static GetDataBieuDoCongSuat = () => {
    return `api/Scada/GetDataBieuDoCongSuat`;
  };

  static GetTinHieuScada = () => {
    return `/api/HeThongThongBao/GetTinHieuScada`;
  };

  static GetThongTinThiTruong = () => {
    return `api/ThongTinThiTruong/GetThongTinThiTruong`;
  };

  static GetDoanhThuChiPhiNgay = () => {
    return `api/ThongTinThiTruong/GetDoanhThuChiPhiNgay`;
  };

  static GetDoanhThuChiPhiNam = () => {
    return `api/ThongTinThiTruong/GetDoanhThuChiPhiNam`;
  };

  //https://app-sxkd.evngenco1.vn/api/TinhHinhTaiChinh/GetTinhHinhTaiChinh

  static GetTinhHinhTaiChinh = () => {
    return `api/TinhHinhTaiChinh/GetTinhHinhTaiChinh`;
  };
  //https://app-sxkd.evngenco1.vn/api/TinhHinhTaiChinh/GetTaiChinhNhaMay
  static GetTaiChinhNhaMay = () => {
    return `api/TinhHinhTaiChinh/GetTaiChinhNhaMay`;
  };

  //https://app-sxkd.evngenco1.vn/api/TinhHinhTaiChinh/GetDanhSachNhaMayTaiChinh/
  static GetDanhSachNhaMayTaiChinh = () => {
    return `api/TinhHinhTaiChinh/GetDanhSachNhaMayTaiChinh`;
  };

  static GetDataBieuDoThongTinThiTruong = () => {
    return `api/ThongTinThiTruong/GetDataBieuDoThongTinThiTruong`;
  };

  static GetChiTieuKinhTeKyThuat = () => {
    return `api/ThongTinTongQuat/GetChiTieuKinhTeKyThuat`;
  };

  //https://app-sxkd.evngenco1.vn/api/ThongTinTongQuat/GetThongTinChiTieuKinhTeKyThuat/
  static GetThongTinChiTieuKinhTeKyThuat = () => {
    return `api/ThongTinTongQuat/GetThongTinChiTieuKinhTeKyThuat`;
  };

  static GetCungCapNLDauNgay = () => {
    return `api/ThongTinTongQuat/GetCungCapNLDauNgay`;
  };

  static GetCungCapNLThanNgay = () => {
    return `api/ThongTinTongQuat/GetCungCapNLThanNgay`;
  };

  static GetThongTinTramMoiTruong = () => {
    return `api/ThongTinTongQuat/GetChiTietMoiTruongOnline`;
  };

  static GetChiTietMoiTruongNgay = () => {
    return `api/ThongTinTongQuat/GetChiTietMoiTruongNgay`;
  };

  static GetChiTietMoiTruongNam = () => {
    return `api/ThongTinTongQuat/GetChiTietMoiTruongNam`;
  };

  static GetThongTinNhanSu = () => {
    return `api/ThongTinTongQuat/GetThongTinNhanSu`;
  };

  static GetSuaChuaToMay = () => {
    return `api/ThongTinTongQuat/GetSuaChuaToMay`;
  };

  static GetTinTucBanner = () => {
    return `api/ThongTinTongQuat/GetTinTucBanner`;
  };

  //http://117.0.37.184:8085/api/HeThongThongBao/GetThongBaoVanHanhChiTietToMay/
  static GetThongBaoVanHanhChiTietToMay = () => {
    return `api/HeThongThongBao/GetThongBaoVanHanhChiTietToMay`;
  };

  //https://app-sxkd.evngenco1.vn/api/ThongTinTongQuat/GetThongTinNhienLieuNgayTheoNhaMay
  static GetThongTinNhienLieuNgayTheoNhaMay = () => {
    return `api/ThongTinTongQuat/GetThongTinNhienLieuNgayTheoNhaMay`;
  };
}
