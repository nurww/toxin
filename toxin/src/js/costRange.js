const $ = require("jquery");

const range = $(".multi-range");

const leftThumb = $(".left-thumb");
const rightThumb = $(".right-thumb");

let midRange = $(".mid-range");
let lowerCost = $(".lower-cost");
let higherCost = $(".higher-cost");
let lowNum = 0;
let highNum = 0;
let stepNum = 1000;

const step = (parseFloat(leftThumb.css("left")) + range.width() - 20) / 15;
let anchor = 0;

leftThumb.on("mousedown", (e) => {
  const shiftX = e.pageX - leftThumb.position().left;

  moveAt(e);

  function moveAt(e) {
    let midRangeWidth;
    if (e.pageX - shiftX < anchor - step && anchor > 0) {
      leftThumb.css("left", parseFloat(leftThumb.css("left")) - step);
      anchor = anchor - step;
    }
    if (
      e.pageX - shiftX >= anchor + step &&
      anchor < range.width() - step - step
    ) {
      leftThumb.css("left", parseFloat(leftThumb.css("left")) + step);
      anchor = anchor + step;
    }

    midRange.css(
      "width",
      `${Math.abs(
        parseInt(leftThumb.css("left")) - parseInt(rightThumb.css("left"))
      )}`
    );
    parseInt(leftThumb.css("left")) < parseInt(rightThumb.css("left"))
      ? (midRangeWidth = parseInt(leftThumb.css("left")) + 10)
      : (midRangeWidth = parseInt(rightThumb.css("left")) + 10);
    midRange.css("left", `${midRangeWidth}px`);

    test(anchor, anchor2);
  }

  $(document).on("mousemove", (e) => {
    moveAt(e);
  });

  $(document).on("mouseup", (e) => {
    $(document).unbind("mousemove");
    $(document).unbind("mouseup");
  });
});

leftThumb.on("dragstart", () => {
  return false;
});

const step2 = (parseFloat(rightThumb.css("left")) + range.width() - 20) / 15;
let anchor2 = 0;

rightThumb.on("mousedown", (e) => {
  const shiftX = e.pageX - rightThumb.position().left;

  moveAt(e);

  function moveAt(e) {
    let midRangeWidth;
    if (e.pageX - shiftX < anchor2 - step2 && anchor2 > 0) {
      rightThumb.css("left", parseFloat(rightThumb.css("left")) - step2);
      anchor2 = anchor2 - step2;
    }
    if (
      e.pageX - shiftX >= anchor2 + step2 &&
      anchor2 < range.width() - step2 - step2
    ) {
      rightThumb.css("left", parseFloat(rightThumb.css("left")) + step2);
      anchor2 = anchor2 + step2;
    }

    midRange.css(
      "width",
      `${Math.abs(
        parseInt(leftThumb.css("left")) - parseInt(rightThumb.css("left"))
      )}`
    );
    parseInt(leftThumb.css("left")) < parseInt(rightThumb.css("left"))
      ? (midRangeWidth = parseInt(leftThumb.css("left")) + 10)
      : (midRangeWidth = parseInt(rightThumb.css("left")) + 10);
    midRange.css("left", `${midRangeWidth}px`);

    test(anchor, anchor2);
  }

  $(document).on("mousemove", (e) => {
    moveAt(e);
  });

  $(document).on("mouseup", (e) => {
    $(document).unbind("mousemove");
    $(document).unbind("mouseup");
  });
});

rightThumb.on("dragstart", () => {
  return false;
});

function test(a1, a2) {
  lowNum = Math.ceil(a1 / step) * stepNum;
  // lowerCost.html(`${lowNum}`)

  highNum = Math.ceil(a2 / step) * stepNum;
  // higherCost.html(`${highNum}`)

  a1 > a2
    ? (lowerCost.html(`${highNum}`), higherCost.html(`${lowNum}`))
    : (higherCost.html(`${highNum}`), lowerCost.html(`${lowNum}`));
}
