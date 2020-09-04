const moment = require('moment');
moment.locale('ru');
const $ = require('jquery');

window.onload = function() {
	class Model {
		constructor(parent) {
			this.currentYear = moment().get('year');
			this.currentMonth = moment().get('month');

			this.createTable(this.currentYear, this.currentMonth);
			this.selectedArr = [];
			this.addEventListener();
			this.show();
		}

		show() {
			$(document).on('click', (e) => {
				if (
					$('.calendar')[0] === $(e.target).parents('.calendar')[0] ||
					e.target === $('.input-dates')[0] ||
					e.target === $('.input-dates')[1] ||
					e.target === $('.calendar')[0]
				) {
					$('.calendar').removeClass('hide');
				} else {
					$('.calendar').addClass('hide');
				}
			});
		}

		createTable(year, month) {
			$('.calendar__container').html('');

			const fragment = $(document.createDocumentFragment());
			const table = $('<table/>');
			table.addClass('fs-12');

			table.append(this.generateThead(year, month));

			let { calendarDays, tbody } = this.generateTbody(year, month);
			table.append(tbody);

			fragment.append(table);

			$('.calendar__container').append(fragment);

			this.selectedArrFunc(calendarDays, year, month, tbody);
			return { year, month };
		}

		generateThead(year, month) {
			let months = [
				'Январь',
				'Февраль',
				'Март',
				'Апрель',
				'Май',
				'Июнь',
				'Июль',
				'Август',
				'Сентябрь',
				'Октябрь',
				'Ноябрь',
				'Декабрь',
			];

			let daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

			$('.calendar__title').html(`${months[month]} ${year}`);

			let thead = $('<thead/>');
			let tr = $('<tr/>');
			tr.addClass('primaryColor', 'bold');

			for (let i = 0; i < daysOfWeek.length; i++) {
				let th = $('<th/>');
				th.html(daysOfWeek[i]);
				tr.append(th);
			}

			thead.append(tr);

			return thead;
		}

		generateTbody(year, month) {
			let pastMonth = month - 1;
			if (pastMonth < 0) {
				pastMonth = 11;
			}
			let nextMonth = month + 1;
			if (nextMonth > 11) {
				nextMonth = 0;
			}

			let tbody = $('<tbody/>');
			tbody.addClass('dark50');

			let daysInYearArr = this.daysInYearArr(year);
			let monthDays = this.monthDays(daysInYearArr, year, month);
			let pastMonthDays = this.pastMonthDays(daysInYearArr, year, pastMonth);
			let nextMonthDays = this.nextMonthDays(daysInYearArr, pastMonthDays, monthDays, year, month);

			let calendarDays = [...pastMonthDays, ...monthDays, ...nextMonthDays];

			for (let week = 0; week < calendarDays.length / 7; week++) {
				let calendarChunk = calendarDays.slice([week * 7], week * 7 + 7);

				let tr = $('<tr/>');

				for (let day = 0; day < calendarChunk.length; day++) {
					let td = $('<td/>');

					if (calendarChunk[day].month === pastMonth) {
						td.addClass('dark25 past');
					} else if (calendarChunk[day].month === nextMonth) {
						td.addClass('dark25 next');
					}

					td.html(calendarChunk[day].day);
					tr.append(td);
				}

				tbody.append(tr);
			}

			this.intermediateSelectFunc(calendarDays, year, month, tbody);
			return { calendarDays, tbody };
		}

		intermediateSelectFunc(calendarDays, year, month, tbody) {
			let selectedSortedArr = this.selectedArr ? [...this.selectedArr] : [];

			if (selectedSortedArr) {
				selectedSortedArr.sort((a, b) => {
					if (a.getDate.isBefore(b.getDate)) {
						return -1;
					} else if (b.getDate.isBefore(a.getDate)) {
						return 1;
					}
					return 0;
				});
			}

			let left, right;

			if (selectedSortedArr) {
				selectedSortedArr.forEach((el, idx) => {
					idx === 0 ? (left = el) : (right = el);
				});
			}

			let dayElements = tbody.find('td');

			calendarDays.forEach((el, idx) => {
				dayElements[idx].classList.remove('mid-selected', 'left', 'right', 'selected');

				if (left && !(right && left)) {
					if (el.date().isSame(`${left.getDate}`)) {
						dayElements[idx].classList.add('selected');
					}
				}

				if (left && right) {
					if (
						moment(`${el.date()}`).isAfter(`${left.getDate}`) &&
						moment(`${el.date()}`).isBefore(`${right.getDate}`)
					) {
						dayElements[idx].classList.add('mid-selected');
					} else if (el.date().isSame(`${left.getDate}`)) {
						dayElements[idx].classList.add('selected', 'left');
					} else if (el.date().isSame(`${right.getDate}`)) {
						dayElements[idx].classList.add('selected', 'right');
          }
				}
			});
		}

		daysInYearArr(year) {
			let daysInYearArr = [];
			for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
				let daysInMonth = moment(`${year}-${monthIndex + 1}`).daysInMonth();
				daysInYearArr[monthIndex] = [];

				for (let day = 1; day <= daysInMonth; day++) {
					daysInYearArr[monthIndex].push(day);
				}
			}

			return daysInYearArr;
		}

		elObject(year, month, day) {
			return {
				year,
				month,
				day,
				date: function () {
					return moment(`${this.year}-${this.month + 1}-${this.day}`);
				},
			};
		}

		monthDays(daysInYearArr, year, month) {
			let monthDays = [];

			daysInYearArr[month].forEach((day) => {
				monthDays.push(this.elObject(year, month, day));
			});

			return monthDays;
		}

		pastMonthDays(daysInYearArr, year, pastMonth) {
			let pastMonthDays = [];

			if (pastMonth + 2 > 12) {
				pastMonth = -1;
				year--;
			}

			let firstMonthWeekDay = moment(`${year}-${pastMonth + 2}-01`).day();

			!firstMonthWeekDay ? (firstMonthWeekDay = 6) : (firstMonthWeekDay = firstMonthWeekDay - 1);

			if (pastMonth === -1) {
				pastMonth = 11;
			}

			for (let i = 0; i < firstMonthWeekDay; i++) {
				pastMonthDays.push(this.elObject(year, pastMonth, daysInYearArr[pastMonth].length - i));
			}

			pastMonthDays.reverse();

			return pastMonthDays;
		}

		nextMonthDays(daysInYearArr, pastMonthDays, monthDays, year, month) {
			let nextMonthDays = [];
			month++;

			if (month > 11) {
				month = 0;
				year++;
			}

			daysInYearArr[month].forEach((day) => {
				nextMonthDays.push(this.elObject(year, month, day));
			});

			nextMonthDays = nextMonthDays.slice(0, 42 - (pastMonthDays.length + monthDays.length));

			return nextMonthDays;
		}

		selectedArrFunc(calendarDays, year, month, tbody) {
			let test = this.parent;

			$('td').each((index, el) => {
				$(el).on('mouseover', (e) => {
					e.target.classList.add('hover');
				});
				$(el).on('mouseleave', (e) => {
					e.target.classList.remove('hover');
				});
				$(el).on('click', (e) => {
					let selectedObj = {
						element: $(e.target).addClass('selected'),
						year: this.currentYear,
						month: 0,
						day: parseInt(`${$(e.target).html()}`),
						getDate: null,
						date: function (currentYear, currentMonth) {
							let day = this.day;

							if (!this.month && this.month === 0) {
								this.month = currentMonth;
								if (this.element.hasClass('past')) {
									this.month = currentMonth - 1;
									if (this.month < 0) {
										this.month = 11;
										this.year = currentYear - 1;
									}
								} else if (this.element.hasClass('next')) {
									this.month = currentMonth + 1;
									if (this.month > 11) {
										this.month = 0;
										this.year = currentYear + 1;
									}
								}
							}

							this.getDate = moment(`${this.year}-${this.month + 1}-${day}`);
						},
					};

					selectedObj.date(year, month);

					this.selectedArr.push(selectedObj);

					let monthsNames = [
						'янв',
						'фев',
						'март',
						'апр',
						'май',
						'июнь',
						'июль',
						'авг',
						'сент',
						'окт',
						'нояб',
						'дек',
					];

					if ($('.input-dates').length === 1) {
						$('.input-dates')[0].setAttribute(
							'placeholder',
							`${selectedObj.day} ${moment.monthsShort(selectedObj.month)}`
						);

						if (this.selectedArr.length > 2) {
							this.selectedArr[0].element.removeClass('selected');
							this.selectedArr.shift();
						}

						if (this.selectedArr.length === 2) {
							let selectedSortedArr = [...this.selectedArr].sort((a, b) => {
								return a.year === b.year
									? a.month === b.month
										? a.day - b.day
										: a.month - b.month
									: a.year - b.year;
							});

							$('.input-dates')[0].setAttribute(
								'placeholder',
								`${selectedSortedArr[0].day} ${moment.monthsShort(selectedSortedArr[0].month)} - ${
									selectedSortedArr[1].day
								} ${moment.monthsShort(selectedSortedArr[1].month)}`
							);
						}
					} else if ($('.input-dates').length === 2) {
						$('.input-dates')[0].setAttribute('placeholder', selectedObj.getDate.format('dd.MM.yyyy'));

						if (this.selectedArr.length > 2) {
							this.selectedArr[0].element.removeClass('selected');
							this.selectedArr.shift();
						}

						if (this.selectedArr.length === 2) {
							let selectedSortedArr = [...this.selectedArr].sort((a, b) => {
								return a.year === b.year
									? a.month === b.month
										? a.day - b.day
										: a.month - b.month
									: a.year - b.year;
							});

							$('.input-dates').each((idx, input) => {
								selectedSortedArr[idx].element.removeClass('left right');

								idx === 0
									? selectedSortedArr[0].element.addClass('left')
									: selectedSortedArr[1].element.addClass('right');
								$('.input-dates')[idx].setAttribute(
									'placeholder',
									selectedSortedArr[idx].getDate.format('dd.MM.yyyy')
								);
							});
						}
					}

					this.intermediateSelectFunc(calendarDays, year, month, tbody);
				});
			});
		}

		addEventListener() {
			$('.calendar__prev').on('click', (e) => {
				this.currentMonth--;

				if (this.currentMonth < 0) {
					this.currentMonth = 11;
					this.currentYear--;
				}

				const { year, month } = this.createTable(this.currentYear, this.currentMonth);
			});

			$('.calendar__next').on('click', (e) => {
				this.currentMonth++;

				if (this.currentMonth > 11) {
					this.currentMonth = 0;
					this.currentYear++;
				}

				const { year, month } = this.createTable(this.currentYear, this.currentMonth);
			});
		}
	}

	class View {
		constructor() {}
	}

	class Controller {
		constructor(model, view) {
			this.model = model;
			this.view = view;
		}
	}

	const formCard = new Controller(new Model(), new View());
	// const formSelect = new Controller(
	//   new Model(),
	//   new View()
	// );
};

console.log(moment(`2020-06-15`));
console.log(moment(`2020-06-15`).toDate());
