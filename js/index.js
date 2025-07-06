$(function () {
    function eventTrigger(element) {
        if (!element) return;
        const event = new Event("input", {
            bubbles: true, // If the event should propagate upward
            cancelable: true, // If the event can be canceled
        });
        element.dispatchEvent(event);
    }
    //THIS IS FOR THE SINGLE SLIDER
    let idOfSlider = "slider-single";
    let idOfSliderValue = "slider-single-value";
    $("#" + idOfSlider).css("display", "none");
    $("<div></div>").insertAfter("#" + idOfSlider);
    var single = $("#" + idOfSlider).next()[0];
    noUiSlider.create(single, {
        start: [520],
        range: {
            min: 0.1,
            max: 0.5,
        },
        step: 0.01,
        tooltips: [wNumb({ decimals: 1.0, prefix: "" })],
    });
    var valueSingle = document.getElementById(idOfSlider);
    window.addEventListener("slider_input_value_changed", (e) => {
        single.noUiSlider.set(e.detail);
    });
    single.noUiSlider.on("update", function (values) {
        $("#" + idOfSlider).val(values[0]);
        $("#" + idOfSliderValue).text(values[0]);
        eventTrigger($("#" + idOfSlider)[0]);
        eventTrigger($("#" + idOfSliderValue)[0]);
    });
    $("[data-tooltip-pos]")
        .next()
        .children()
        .find(".noUi-tooltip")
        .addClass("bottom");
    //THIS IS FOR THE RANGE SLIDER.
    //Sorry for yelling...
    let idOfRangeSlider = "slider-range";
    var range = $("#" + idOfRangeSlider).next()[0];
    if (range !== undefined) {
        $("#" + idOfRangeSlider).css("display", "none");
        $("<div></div>").insertAfter("#" + idOfRangeSlider);
        noUiSlider.create(range, {
            connect: true,
            start: [10000, 18000],
            range: {
                min: 1000,
                max: 20000,
            },
            step: 500,
            tooltips: [
                wNumb({ decimals: 2, prefix: "$" }),
                wNumb({ decimals: 2, prefix: "$" }),
            ],
        });
        range.noUiSlider.on("update", function (values) {
            $("#" + idOfRangeSlider).val(values.join(" - "));
        });
    }
});


$(function () {
    function eventTrigger(element) {
        if (!element) return;
        const event = new Event("input", {
            bubbles: true, // If the event should propagate upward
            cancelable: true, // If the event can be canceled
        });
        element.dispatchEvent(event);
    }
    //THIS IS FOR THE SINGLE SLIDER
    let idOfSlider = "slider-single-2";
    let idOfSliderValue = "slider-single-value";
    $("#" + idOfSlider).css("display", "none");
    $("<div></div>").insertAfter("#" + idOfSlider);
    var single = $("#" + idOfSlider).next()[0];
    noUiSlider.create(single, {
        start: [0],
        range: {
            min: 0,
            max: 1,
        },
        step: 0.01,
        tooltips: [wNumb({ decimals: 1.0, prefix: "" })],
    });
    var valueSingle = document.getElementById(idOfSlider);
    window.addEventListener("slider_input_value_changed_2", (e) => {
        single.noUiSlider.set(e.detail);
    });
    single.noUiSlider.on("update", function (values) {
        $("#" + idOfSlider).val(values[0]);
        $("#" + idOfSliderValue).text(values[0]);
        eventTrigger($("#" + idOfSlider)[0]);
        eventTrigger($("#" + idOfSliderValue)[0]);
    });
    $("[data-tooltip-pos]")
        .next()
        .children()
        .find(".noUi-tooltip")
        .addClass("bottom");
    //THIS IS FOR THE RANGE SLIDER.
    //Sorry for yelling...
    let idOfRangeSlider = "slider-range";
    var range = $("#" + idOfRangeSlider).next()[0];
    if (range !== undefined) {
        $("#" + idOfRangeSlider).css("display", "none");
        $("<div></div>").insertAfter("#" + idOfRangeSlider);
        noUiSlider.create(range, {
            connect: true,
            start: [10000, 18000],
            range: {
                min: 1000,
                max: 20000,
            },
            step: 500,
            tooltips: [
                wNumb({ decimals: 2, prefix: "$" }),
                wNumb({ decimals: 2, prefix: "$" }),
            ],
        });
        range.noUiSlider.on("update", function (values) {
            $("#" + idOfRangeSlider).val(values.join(" - "));
        });
    }
});


$(function () {
    function eventTrigger(element) {
        if (!element) return;
        const event = new Event("input", {
            bubbles: true, // If the event should propagate upward
            cancelable: true, // If the event can be canceled
        });
        element.dispatchEvent(event);
    }
    //THIS IS FOR THE SINGLE SLIDER
    let idOfSlider = "slider-single-3";
    let idOfSliderValue = "slider-single-value";
    $("#" + idOfSlider).css("display", "none");
    $("<div></div>").insertAfter("#" + idOfSlider);
    var single = $("#" + idOfSlider).next()[0];
    noUiSlider.create(single, {
        start: [0],
        range: {
            min: 0,
            max: 1,
        },
        step: 0.01,
        tooltips: [wNumb({ decimals: 1.0, prefix: "" })],
    });
    var valueSingle = document.getElementById(idOfSlider);
    window.addEventListener("slider_input_value_changed_2", (e) => {
        single.noUiSlider.set(e.detail);
    });
    single.noUiSlider.on("update", function (values) {
        $("#" + idOfSlider).val(values[0]);
        $("#" + idOfSliderValue).text(values[0]);
        eventTrigger($("#" + idOfSlider)[0]);
        eventTrigger($("#" + idOfSliderValue)[0]);
    });
    $("[data-tooltip-pos]")
        .next()
        .children()
        .find(".noUi-tooltip")
        .addClass("bottom");
    //THIS IS FOR THE RANGE SLIDER.
    //Sorry for yelling...
    let idOfRangeSlider = "slider-range";
    var range = $("#" + idOfRangeSlider).next()[0];
    if (range !== undefined) {
        $("#" + idOfRangeSlider).css("display", "none");
        $("<div></div>").insertAfter("#" + idOfRangeSlider);
        noUiSlider.create(range, {
            connect: true,
            start: [10000, 18000],
            range: {
                min: 1000,
                max: 20000,
            },
            step: 500,
            tooltips: [
                wNumb({ decimals: 2, prefix: "$" }),
                wNumb({ decimals: 2, prefix: "$" }),
            ],
        });
        range.noUiSlider.on("update", function (values) {
            $("#" + idOfRangeSlider).val(values.join(" - "));
        });
    }
});


$(function () {
    function eventTrigger(element) {
        if (!element) return;
        const event = new Event("input", {
            bubbles: true, // If the event should propagate upward
            cancelable: true, // If the event can be canceled
        });
        element.dispatchEvent(event);
    }
    //THIS IS FOR THE SINGLE SLIDER
    let idOfSlider = "slider-single-4";
    let idOfSliderValue = "slider-single-value";
    $("#" + idOfSlider).css("display", "none");
    $("<div></div>").insertAfter("#" + idOfSlider);
    var single = $("#" + idOfSlider).next()[0];
    noUiSlider.create(single, {
        start: [0],
        range: {
            min: 0,
            max: 1,
        },
        step: 0.01,
        tooltips: [wNumb({ decimals: 1.0, prefix: "" })],
    });
    var valueSingle = document.getElementById(idOfSlider);
    window.addEventListener("slider_input_value_changed_2", (e) => {
        single.noUiSlider.set(e.detail);
    });
    single.noUiSlider.on("update", function (values) {
        $("#" + idOfSlider).val(values[0]);
        $("#" + idOfSliderValue).text(values[0]);
        eventTrigger($("#" + idOfSlider)[0]);
        eventTrigger($("#" + idOfSliderValue)[0]);
    });
    $("[data-tooltip-pos]")
        .next()
        .children()
        .find(".noUi-tooltip")
        .addClass("bottom");
    //THIS IS FOR THE RANGE SLIDER.
    //Sorry for yelling...
    let idOfRangeSlider = "slider-range";
    var range = $("#" + idOfRangeSlider).next()[0];
    if (range !== undefined) {
        $("#" + idOfRangeSlider).css("display", "none");
        $("<div></div>").insertAfter("#" + idOfRangeSlider);
        noUiSlider.create(range, {
            connect: true,
            start: [10000, 18000],
            range: {
                min: 1000,
                max: 20000,
            },
            step: 500,
            tooltips: [
                wNumb({ decimals: 2, prefix: "$" }),
                wNumb({ decimals: 2, prefix: "$" }),
            ],
        });
        range.noUiSlider.on("update", function (values) {
            $("#" + idOfRangeSlider).val(values.join(" - "));
        });
    }
});


$(function () {
    function eventTrigger(element) {
        if (!element) return;
        const event = new Event("input", {
            bubbles: true, // If the event should propagate upward
            cancelable: true, // If the event can be canceled
        });
        element.dispatchEvent(event);
    }
    //THIS IS FOR THE SINGLE SLIDER
    let idOfSlider = "slider-single-5";
    let idOfSliderValue = "slider-single-value";
    $("#" + idOfSlider).css("display", "none");
    $("<div></div>").insertAfter("#" + idOfSlider);
    var single = $("#" + idOfSlider).next()[0];
    noUiSlider.create(single, {
        start: [0],
        range: {
            min: 0,
            max: 1,
        },
        step: 0.01,
        tooltips: [wNumb({ decimals: 1.0, prefix: "" })],
    });
    var valueSingle = document.getElementById(idOfSlider);
    window.addEventListener("slider_input_value_changed_2", (e) => {
        single.noUiSlider.set(e.detail);
    });
    single.noUiSlider.on("update", function (values) {
        $("#" + idOfSlider).val(values[0]);
        $("#" + idOfSliderValue).text(values[0]);
        eventTrigger($("#" + idOfSlider)[0]);
        eventTrigger($("#" + idOfSliderValue)[0]);
    });
    $("[data-tooltip-pos]")
        .next()
        .children()
        .find(".noUi-tooltip")
        .addClass("bottom");
    //THIS IS FOR THE RANGE SLIDER.
    //Sorry for yelling...
    let idOfRangeSlider = "slider-range";
    var range = $("#" + idOfRangeSlider).next()[0];
    if (range !== undefined) {
        $("#" + idOfRangeSlider).css("display", "none");
        $("<div></div>").insertAfter("#" + idOfRangeSlider);
        noUiSlider.create(range, {
            connect: true,
            start: [10000, 18000],
            range: {
                min: 1000,
                max: 20000,
            },
            step: 500,
            tooltips: [
                wNumb({ decimals: 2, prefix: "$" }),
                wNumb({ decimals: 2, prefix: "$" }),
            ],
        });
        range.noUiSlider.on("update", function (values) {
            $("#" + idOfRangeSlider).val(values.join(" - "));
        });
    }
});


$(function () {
    function eventTrigger(element) {
        if (!element) return;
        const event = new Event("input", {
            bubbles: true, // If the event should propagate upward
            cancelable: true, // If the event can be canceled
        });
        element.dispatchEvent(event);
    }
    //THIS IS FOR THE SINGLE SLIDER
    let idOfSlider = "slider-single-6";
    let idOfSliderValue = "slider-single-value";
    $("#" + idOfSlider).css("display", "none");
    $("<div></div>").insertAfter("#" + idOfSlider);
    var single = $("#" + idOfSlider).next()[0];
    noUiSlider.create(single, {
        start: [0],
        range: {
            min: 0,
            max: 1,
        },
        step: 0.01,
        tooltips: [wNumb({ decimals: 1.0, prefix: "" })],
    });
    var valueSingle = document.getElementById(idOfSlider);
    window.addEventListener("slider_input_value_changed_2", (e) => {
        single.noUiSlider.set(e.detail);
    });
    single.noUiSlider.on("update", function (values) {
        $("#" + idOfSlider).val(values[0]);
        $("#" + idOfSliderValue).text(values[0]);
        eventTrigger($("#" + idOfSlider)[0]);
        eventTrigger($("#" + idOfSliderValue)[0]);
    });
    $("[data-tooltip-pos]")
        .next()
        .children()
        .find(".noUi-tooltip")
        .addClass("bottom");
    //THIS IS FOR THE RANGE SLIDER.
    //Sorry for yelling...
    let idOfRangeSlider = "slider-range";
    var range = $("#" + idOfRangeSlider).next()[0];
    if (range !== undefined) {
        $("#" + idOfRangeSlider).css("display", "none");
        $("<div></div>").insertAfter("#" + idOfRangeSlider);
        noUiSlider.create(range, {
            connect: true,
            start: [10000, 18000],
            range: {
                min: 1000,
                max: 20000,
            },
            step: 500,
            tooltips: [
                wNumb({ decimals: 2, prefix: "$" }),
                wNumb({ decimals: 2, prefix: "$" }),
            ],
        });
        range.noUiSlider.on("update", function (values) {
            $("#" + idOfRangeSlider).val(values.join(" - "));
        });
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("myCanvas");
    const btnPortrait = document.getElementById("btnportrait");
    const btnAuto = document.getElementById("btnauto");
    btnPortrait.addEventListener("click", function () {
        canvas.classList.remove("automatic");
        canvas.classList.add("portrait");
    });
    btnAuto.addEventListener("click", function () {
        canvas.classList.remove("portrait");
        canvas.classList.add("automatic");
    });
});





document.addEventListener("DOMContentLoaded", function () {
    const colorInputs = document.querySelectorAll('input[type="color"]');
    const popup = document.getElementById('colorWarningPopup');
    const overlay = document.getElementById('colorWarningOverlay');
    const confirmBtn = document.getElementById('confirmColorBtn');
    const cancelBtn = document.getElementById('cancelColorBtn');
    let selectedColor = null;

    // Check if user has previously confirmed
    const hasConfirmedColorWarning = localStorage.getItem('hasConfirmedColorWarning');

    function showColorWarning(color) {
        // If user has previously confirmed, apply color directly
        if (hasConfirmedColorWarning === 'true') {
            applyColor(color);
            return;
        }
        selectedColor = color;
        popup.classList.add('active');
        overlay.classList.add('active');
    }

    function hideColorWarning() {
        popup.classList.remove('active');
        overlay.classList.remove('active');
        selectedColor = null;
    }

    function applyColor(color) {
        // Trigger color change event
        const event = new CustomEvent('color_changed', {
            detail: { color: color }
        });
        window.dispatchEvent(event);
        hideColorWarning();
    }

    // Add event listeners to color inputs
    colorInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            e.preventDefault();
            showColorWarning(e.target.value);
        });
    });

    // Handle confirm button click
    confirmBtn.addEventListener('click', () => {
        if (selectedColor) {
            // Store user preference
            localStorage.setItem('hasConfirmedColorWarning', 'true');
            applyColor(selectedColor);
        }
    });

    // Handle cancel button click
    cancelBtn.addEventListener('click', () => {
        hideColorWarning();
        if (confirm('Bạn có muốn tải lại trang không?')) {
            window.location.reload();
        }
    });

    // Handle overlay click
    overlay.addEventListener('click', hideColorWarning);
});

window.addEventListener('message', (event) => {
    if (!event.data || event.data.type !== 'initData') return;

    const { userId, productId, authorization } = event.data;

    console.log("📥 Nhận dữ liệu từ parent:", event.data);

    if (userId) {
        localStorage.setItem('userId', userId || '');
    }

    if (productId) {
        localStorage.setItem('productId', productId);
    }

    // Lưu authorization vào localStorage hoặc biến toàn cục
    if (authorization) {
        localStorage.setItem('authorization', authorization);
        // hoặc window.AUTHORIZATION = authorization;
    }
});