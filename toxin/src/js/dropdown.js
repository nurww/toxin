const $ = require("jquery");

let $guests = {
  parent: $(".guests"),
  title: "Гости",
  placeholder: [["Гости", "Гость", "Гостя", "Гостей"], "Сколько гостей"],
  countSeparate: [2],
  rowNames: [
    ["Взрослые", "Взрослый", "Взрослых", "Взрослых"],
    ["Дети", "Ребенок", "Ребенка", "Детей"],
    ["Младенцы", "Младенец", "Младенца", "Младенцев"],
  ],
  nameTypes: function (value, nameArr, idx = 0) {
    let typeIdx;
    if ((value === "1" || value.endsWith("1")) && value !== "11") {
      typeIdx = 1;
    } else if (
      (value === "2" ||
        value === "3" ||
        value === "4" ||
        value.endsWith("2") ||
        value.endsWith("3") ||
        value.endsWith("4")) &&
      value !== "12" &&
      value !== "13" &&
      value !== "14"
    ) {
      typeIdx = 2;
    } else {
      typeIdx = 3;
    }

    if (nameArr === 0) {
      return `${value} ${this.placeholder[idx][typeIdx]}`;
    } else if (nameArr === 1) {
      return `${value} ${this.rowNames[idx][typeIdx]}`;
    }
  },
};

let $convenience = {
  parent: $(".convenience"),
  title: "Удобства номера",
  placeholder: [[""], "Удобства"],
  countSeparate: [0, 1, 2],
  rowNames: [
    ["Спальни", "Спальня", "Спальни", "Спален"],
    ["Кровати", "Кровать", "Кровати", "Кроватей"],
    ["Ванные комнаты", "Ванная комната", "Ванные комнаты", "Ванных комнат"],
  ],
  nameTypes: function (value, nameArr, idx = 0) {
    let typeIdx;
    if ((value === "1" || value.endsWith("1")) && value !== "11") {
      typeIdx = 1;
    } else if (
      (value === "2" ||
        value === "3" ||
        value === "4" ||
        value.endsWith("2") ||
        value.endsWith("3") ||
        value.endsWith("4")) &&
      value !== "12" &&
      value !== "13" &&
      value !== "14"
    ) {
      typeIdx = 2;
    } else {
      typeIdx = 3;
    }

    if (nameArr === 0) {
      return `${value} ${this.placeholder[idx][typeIdx]}`;
    } else if (nameArr === 1) {
      return `${value} ${this.rowNames[idx][typeIdx]}`;
    }
  },
};

class Dropdown {
  constructor(options) {
    const { parent, countSeparate } = options;
    this.parent = parent;

    this.countSeparate = countSeparate;
    this.options = options;

    this.title();
    this.placeholder();
    this.children();
    this.show();
  }

  show() {
    $(document).on("click", (e) => {
      if (
        this.parent.find(".dropdown")[0] ===
          $(e.target).parents(".dropdown")[0] ||
        e.target === this.parent.find(".dropdown-input")[0] ||
        e.target === this.parent.find(".dropdown")[0]
      ) {
        this.parent.find(".dropdown").removeClass("hide");
      } else {
        this.parent.find(".dropdown").addClass("hide");
      }
    });
  }

  title() {
    this.parent.find(".dropdown-title").html(this.options.title);
  }

  placeholder() {
    this.parent
      .find(".dropdown-input")
      .attr("placeholder", this.options.placeholder[1]);
  }

  children() {
    this.parent
      .find(".dropdown")
      .children(".dropdown-row")
      .each((idx, el) => {
        $(el).find(".dropdown-row__name").html(this.options.rowNames[idx][0]);
        this.sub($(el).find(".sub"), $(el).find(".value"));
        this.add($(el).find(".sub"), $(el).find(".add"), $(el).find(".value"));
      });
  }

  value(value, acc) {
    acc !== 0
      ? this.parent.find(".dropdown-input").attr("placeholder", value)
      : this.parent
          .find(".dropdown-input")
          .attr("placeholder", this.placeholder());
  }

  counter() {
    let placeholder = "";
    let acc = 0;

    if (!(this.parent.find(".value").length === this.countSeparate.length)) {
      acc = Array.prototype.reduce.call(
        this.parent.find(".value"),
        (acc, currentValue, idx) => {
          return !this.countSeparate.includes(idx)
            ? acc + parseInt($(currentValue).html())
            : acc + 0;
        },
        0
      );
      placeholder += `${this.options.nameTypes(`${acc}`, 0)}`;
    }

    Array.prototype.forEach.call(
      this.parent.find(".value"),
      (el, idx) => {
        acc += parseInt($(el).html());
        return this.countSeparate.includes(idx)
          ? (placeholder += ` ${this.options.nameTypes($(el).html(), 1, idx)}`)
          : null;
      },
      0
    );

    this.value(placeholder, acc);
  }

  sub(subBtn, value) {
    subBtn.on("click", () => {
      let counter = parseInt(subBtn.next().html());
      counter <= 1
        ? (value.html(`0`), subBtn.addClass("disabled"))
        : value.html(`${--counter}`);
      this.counter();
    });
  }

  add(subBtn, addBtn, value) {
    addBtn.on("click", () => {
      let counter = addBtn.prev().html();
      value.html(`${++counter}`);
      counter > 0 ? subBtn.removeClass("disabled") : null;
      this.counter();
    });
  }
}

let dropdownGuests = new Dropdown($guests);
let dropdownConvenience = new Dropdown($convenience);
