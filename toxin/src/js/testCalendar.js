const moment = require('moment');

const calendar = document.querySelector('.calendar');
const calendarContainer = document.querySelector('.calendar__container');
const calendarTitle = document.querySelector('.calendar__title');
const calendarControlButtons = document.querySelector('.calendar__control-buttons');

let currentYear = moment().get('year');
let currentMonth = moment().get('month');

let daysInYearArr = [];

for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
  let daysInMonth = moment(`${currentYear}-${monthIndex + 1}`).daysInMonth();
  daysInYearArr[monthIndex] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    daysInYearArr[monthIndex].push(day);
  }
}

let firstMonthWeekDay = moment(`${currentYear}-${currentMonth + 1}-01`).day();

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];


function createTable() {
  const fragment = document.createDocumentFragment();
  const table = document.createElement('table');
  table.classList.add('fs-12');

  table.appendChild(generateThead());
  table.appendChild(generateTbody());

  fragment.appendChild(table);
  
  calendarContainer.appendChild(fragment);
  calendar.appendChild(calendarContainer);
}

function generateThead() {
  let thead = document.createElement('thead');
  let tr = document.createElement('tr');
  tr.classList.add('primaryColor', 'bold');

  for (let i = 0; i < daysOfWeek.length; i++) {
    let th = document.createElement('th');
    th.textContent = daysOfWeek[i];
    tr.appendChild(th);
  }

  thead.appendChild(tr);
  
  return thead;
}

function generateTbody() {
  let tbody = document.createElement('tbody');
  tbody.classList.add('dark50');
  
  let monthDays = [];
  let pastMonthDays = [];
  let nextMonthDays = [];
  let calendarDays = [];

  daysInYearArr[currentMonth].forEach(day => {
    monthDays.push(day);
  })

  daysInYearArr[currentMonth - 1].forEach(day => {
    pastMonthDays.push(day);
  })

  pastMonthDays = pastMonthDays.slice(-`${firstMonthWeekDay}`);

  daysInYearArr[currentMonth + 1].forEach(day => {
    nextMonthDays.push(day);
  })
  
  nextMonthDays = nextMonthDays.slice(0, 35 - (pastMonthDays.length + monthDays.length));

  calendarDays = [...pastMonthDays, ...monthDays, ...nextMonthDays];

  for (let week = 0; week < calendarDays.length / 7; week++) {
    let calendarChunk = calendarDays.slice([week * 7], week * 7 + 7);

    let tr = document.createElement('tr');

    for (let day = 0; day < calendarChunk.length; day++) {
      let td = document.createElement('td');
      if(
        week === 0 && day < firstMonthWeekDay
        ||
        week === calendarDays.length / 7 - 1 && day >= 7 - nextMonthDays.length
        ) {
        td.classList.add('dark25');
      }
      td.textContent = calendarChunk[day];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  return tbody;
}

createTable();





let selectedArr = [];

document.querySelectorAll('td').forEach(el => {
  el.addEventListener('mouseover', e => {
    e.target.classList.add('hover');
  })
  el.addEventListener('mouseleave', e => {
    e.target.classList.remove('hover');
  })
  el.addEventListener('click', e => {
    selectedArr.unshift(e.target);

    if (selectedArr.length > 2) {
      selectedArr[2].classList.remove('selected');
      selectedArr.pop();
    };

    e.target.classList.add('selected');
    
    if (selectedArr[0] && selectedArr[1]) {
      let first = parseInt(selectedArr[0].textContent);
      let second = parseInt(selectedArr[1].textContent);
      
      if (first < second) {
        selectedArr[0].classList.add('left');
        selectedArr[0].classList.remove('right');
        selectedArr[1].classList.add('right');
        selectedArr[1].classList.remove('left');
      } else if (first > second) {
        selectedArr[0].classList.add('right');
        selectedArr[0].classList.remove('left');
        selectedArr[1].classList.add('left');
        selectedArr[1].classList.remove('right');          
      };

      let intermediate = Array.prototype.slice.call(document.querySelectorAll('td'));
      
      let selectedElements = Array.prototype.slice.call(document.getElementsByClassName('selected'));

      intermediate.forEach(el => {
        el.classList.remove('mid-selected');
      });

      for (let i = 1; i < parseInt(selectedElements[1].textContent) - parseInt(selectedElements[0].textContent); i++) {
        intermediate[intermediate.indexOf(selectedElements[0]) + i].classList.add('mid-selected');
      };
      
    }
  })
})





const months = ['Январь', 'Февраль', 'Март',
          'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь',
          'Октябрь', 'Ноябрь', 'Декабрь'];

const prevMonth = document.querySelector('.calendar__prev');
const nextMonth = document.querySelector('.calendar__next');

prevMonth.addEventListener('click', e => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  console.log(currentMonth);
})

nextMonth.addEventListener('click', e => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  console.log(currentMonth);
})


calendarTitle.textContent = `${months[currentMonth]} ${currentYear}`;













































































