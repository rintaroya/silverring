const PRICE_PER_PERSON = 23200;

const TOUR_DATES = [
  "24-26 апреля",
  "1-3 мая",
  "15-17 мая",
  "22-24 мая",
  "29-31 мая",
  "5-7 июня",
  "12-14 июня",
  "19-21 июня",
  "26-28 июня",
  "3-5 июля",
  "10-12 июля",
  "17-18 июля",
  "24-26 июля",
  "31 июля - 2 августа",
  "7-8 августа",
  "14-16 августа",
  "21-23 августа",
  "28-30 августа",
  "4-6 сентября",
  "11-13 сентября"
];


const datesGrid = document.getElementById("datesGrid");
const selectDate = document.getElementById("tourDate");
const peopleSelect = document.getElementById("touristsCount");
const touristsValue = document.getElementById("touristsValue");
const priceEl = document.getElementById("totalPrice");
const expandBtn = document.getElementById("expandDatesBtn");
const phoneInput = document.querySelector('input[type="tel"]');
const phoneError = document.getElementById("phoneError");


let selectedDate = TOUR_DATES[0];
let expanded = false;



if (phoneInput) {
  phoneInput.addEventListener("input", (e) => {
    let digits = phoneInput.value.replace(/\D/g, "").slice(0, 11);

    if (digits.length > 0 && digits[0] !== "7") {
      digits = "7" + digits;
      digits = digits.slice(0, 11);
    }

    let formatted = "";

    if (digits.length === 0) {
      phoneInput.value = "";
      return;
    }

    formatted = "+7";

    if (digits.length > 1) formatted += " " + digits.slice(1, 4);
    if (digits.length > 4) formatted += " " + digits.slice(4, 7);
    if (digits.length > 7) formatted += " " + digits.slice(7, 9);
    if (digits.length > 9) formatted += " " + digits.slice(9, 11);

    phoneInput.value = formatted;
  });
}


function renderDates() {
  datesGrid.innerHTML = "";
  selectDate.innerHTML = "";

  TOUR_DATES.forEach((date, index) => {

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "date-btn";
    btn.textContent = date;

    if (date === selectedDate) {
      btn.classList.add("active");
    }

    if (!expanded && index >= 6) {
      btn.classList.add("hidden-date");
    }

    btn.addEventListener("click", () => {
      selectedDate = date;
      sync();
    });

    datesGrid.appendChild(btn);

    const option = document.createElement("option");
    option.value = date;
    option.textContent = date;

    selectDate.appendChild(option);
  });

  selectDate.value = selectedDate;
}


function updatePrice() {
    const count = Number(peopleSelect.value) || 1;
    const total = count * PRICE_PER_PERSON;

    priceEl.textContent = `${total.toLocaleString("ru-RU")} ₽`;

    if (touristsValue) {
        touristsValue.textContent = `${count}`;
    }
}

const bookingBtn = document.querySelector(".booking-submit");
const bookingModal = document.getElementById("bookingModal");
const closeModalBtn = document.getElementById("closeBookingModal");

const bookedUntil = localStorage.getItem("tourBookedUntil");

bookingBtn?.addEventListener("click", () => {

    if (localStorage.getItem("tourBooked") === "true") return;

    const phoneDigits = phoneInput.value.replace(/\D/g, "");

    if (phoneDigits.length !== 11) {
        alert("Пожалуйста, введите номер телефона полностью.");
        phoneInput.focus();
        return;
    }

    const count = Number(peopleSelect.value) || 1;

    emailjs.send("service_f3vtmgk", "template_yjiburw", {
        phone: phoneInput.value,
        tour_date: selectedDate,
        people_count: count,
        total_price: priceEl.textContent
    });

    bookingBtn.textContent = "Заявка отправлена ✓";
    bookingBtn.classList.add("success");
    bookingBtn.disabled = true;

    bookingModal.classList.add("show");

    localStorage.setItem("tourBooked", "true");
});

if (bookedUntil && Date.now() < Number(bookedUntil)) {
    bookingBtn.textContent = "Заявка отправлена ✓";
    bookingBtn.classList.add("success");
    bookingBtn.disabled = true;
} else {
    localStorage.removeItem("tourBookedUntil");
}

bookingBtn?.addEventListener("click", () => {

    const phoneDigits = phoneInput.value.replace(/\D/g, "");

    if (phoneDigits.length !== 11) {

        alert(
            "Пожалуйста, введите номер телефона полностью."
        );

        phoneInput.focus();
        return;
    }

    bookingModal.classList.add("show");

    bookingBtn.textContent = "Заявка отправлена ✓";
    bookingBtn.classList.add("success");
    bookingBtn.disabled = true;

    const expiresAt = Date.now() + 15 * 60 * 1000;

    localStorage.setItem("tourBookedUntil", expiresAt);
});

bookingModal?.addEventListener("click", (e) => {
    if (e.target === bookingModal) {
        bookingModal.classList.remove("show");
    }
});

closeModalBtn?.addEventListener("click", () => {
    bookingModal.classList.remove("show");
});

function sync() {
  renderDates();
  updatePrice();
  selectDate.value = selectedDate;
}


peopleSelect.addEventListener("change", updatePrice);

selectDate.addEventListener("change", (e) => {
  selectedDate = e.target.value;
  sync();
});

expandBtn.addEventListener("click", () => {
  expanded = !expanded;
  expandBtn.textContent = expanded
    ? "Скрыть даты"
    : "Показать все даты";

  sync();
});

updatePrice();
sync();
