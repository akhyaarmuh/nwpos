export const addZero = (numb) => {
  const number = Number(numb);
  if (isNaN(number)) return "0";

  if (number < 10 && number >= 0) {
    return `0${number}`;
  }

  return numb;
};

export const getDate = () => {
  const date = new Date();

  return `${addZero(date.getDate())} ${date.getMonth()} ${date.getFullYear()}`;
};

export const getDateYesterday = () => {
  const yesterday = new Date(Date.now() - 86400000);
  return `${addZero(
    yesterday.getDate()
  )} ${yesterday.getMonth()} ${yesterday.getFullYear()}`;
};

export const toRupiah = (subject) => {
  // if (subject === null) return "";

  // if (subject === undefined) return "0";

  const rupiah = subject.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  return `${rupiah}`;
};

export const displayDate = (date) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const splited = date.split(" ");
  return `${splited[0]} ${months[Number(splited[1])]} ${splited[2]}`;
};

export const findValueInObject = (obj, select) => {
  const arr = Object.values(obj);
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  if (select === "max") {
    return max;
  } else {
    return min;
  }
};
