import {format} from 'date-fns';
//import {utcToZonedTime} from 'date-fns-tz';

export const numberFormat = number => {
  if (number == null || number == undefined) return '';
  else return Number(number.toFixed(1)).toLocaleString('vi-VN');
};

export const numberFormat2 = number => {
  if (number == null || number == undefined) return '';
  else return Number(number.toFixed(2)).toLocaleString('vi-VN');
};

export const renderDateGMT = date => {
  try {
    const d = new Date(date);
    const m = d.getMonth();
    if (m < 2) return format(d, 'dd/MM/yyyy');
    else return format(d, 'dd/M/yyyy');
  } catch (err) {
    // alert(err);
    return '';
  }
};

export const renderDate = date => {
  try {
    // const d = new Date(date);
    // const m = d.getMonth();
    // if (m < 2) return format(d, 'dd/MM/yyyy');
    // else return format(d, 'dd/M/yyyy');
    if (date == null) {
      return '';
    } else {
      const d = new Date(date);
      d.setHours(d.getHours() - 7);
      //const nyTimeZone = 'Europe/London'; , {timeZone: 'Europe/London'}
      //const nyDate = utcToZonedTime(d, nyTimeZone); , {timeZone: 'Europe/London'}
      const m = d.getMonth();
      if (m < 2) return format(d, 'dd/MM/yyyy');
      else return format(d, 'dd/M/yyyy');
    }
  } catch (err) {
    // alert(err);
    return '';
  }
};

export const renderDate2 = date => {
  try {
    // const d = new Date(date);
    // const m = d.getMonth();
    // if (m < 2) return format(d, 'dd/MM/yyyy');
    // else return format(d, 'dd/M/yyyy');
    if (date == null) {
      return '';
    } else {
      const d = new Date(date);
      d.setHours(d.getHours() - 7);
      //const nyTimeZone = 'Europe/London'; , {timeZone: 'Europe/London'}
      //const nyDate = utcToZonedTime(d, nyTimeZone); , {timeZone: 'Europe/London'}
      const m = d.getMonth();
      if (m < 2) return format(d, 'MM/dd/yyyy');
      else return format(d, 'M/dd/yyyy');
    }
  } catch (err) {
    return '';
  }
};

export const renderFullDate = date => {
  try {
    if (date == null) {
      return '';
    } else {
      const d = new Date(date);
      d.setHours(d.getHours() - 7);
      //const nyTimeZone = 'Europe/London';
      //const nyDate = utcToZonedTime(d, nyTimeZone);
      const m = d.getMonth();
      if (m < 2) return format(d, 'dd/MM/yyyy hh:mm a');
      else return format(d, 'dd/M/yyyy hh:mm a');
    }
  } catch (err) {
    return '';
  }
};

export const renderFullDate2 = date => {
  try {
    if (date == null) {
      return '';
    } else {
      const d = new Date(date);
      const m = d.getMonth();
      if (m < 2) return format(d, 'dd/MM/yyyy hh:mm a');
      else return format(d, 'dd/M/yyyy hh:mm a');
    }
  } catch (err) {
    return '';
  }
};

export const renderDateSmartbox = (date, module) => {
  if (module && (module === 'VBDI' || module === 'VBDINB')) {
    // Bỏ Z trong ngày giờ
    date = date.substring(0, date.length - 1);
  }
  const d = new Date(date);
  return `${d.getDate() <= 9 ? '0' : ''}${d.getDate()}/${
    d.getMonth() < 2 ? '0' : ''
  }${d.getMonth() + 1}/${d.getFullYear()}`;
};

export const formatNumber = num => {
  if (num === null || num === undefined) return 'N/A';
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
