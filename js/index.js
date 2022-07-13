const context = document.querySelector('.js-chart').getContext('2d');
const GLOBAL_MEAN_TEMP = 14;

fetchData()
  .then(parseData)
  .then(getYearsAndTemps)
  .then(({ years, temps, nhem, shem }) => drawChart(years, temps, nhem, shem));

function fetchData() {
  return fetch('./ZonAnn.Ts+dSST.csv').then(response => response.text());
}

function parseData(data) {
  return Papa.parse(data, { header: true }).data;
}

function getYearsAndTemps(data) {
  return data.reduce(
    (acc, entry) => {
      acc.years.push(entry.Year);
      acc.temps.push(Number(entry.Glob) + GLOBAL_MEAN_TEMP);
      acc.nhem.push(Number(entry.NHem) + GLOBAL_MEAN_TEMP);
      acc.shem.push(Number(entry.SHem) + GLOBAL_MEAN_TEMP);

      return acc;
    },
    {
      years: [],
      temps: [],
      nhem: [],
      shem: [],
    },
  );
}

function drawChart(years, temps, nhem, shem) {
  new Chart(context, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: '# Средняя глобальная температура',
          data: temps,
          hoverBackgroundColor: 'green',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
        },
        {
          label: '# Средняя температура северного полушария',
          data: nhem,
          hoverBackgroundColor: 'green',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        },
        {
          label: '# Средняя температура южного полушария',
          data: shem,
          hoverBackgroundColor: 'green',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            callback(value) {
              return value + '°';
            },
          },
        },
      },
    },
  });
}
