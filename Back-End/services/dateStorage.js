let date = {};

function setData(data) {
  date = data;
}

function getData() {
  return date;
}

module.exports = {
  setData,
  getData
};