// ====== Configure answers here ======
// Case-insensitive comparison.
// We also "normalize" spaces
const ANSWERS = {
  q1: "Aileen",
  q2: "王大鹅",
  q3: "Dae",
  q4: ["小潼咪", "放不下的潼子", "王艺潼潼咪"],
};

// Redirect target
const SUCCESS_REDIRECT = "birthday.html";

// LocalStorage keys
const LS_UNLOCKED = "birthday_unlocked";
const LS_NAME = "birthday_name";
const LS_JUST_UNLOCKED = "birthday_just_unlocked";

const form = document.getElementById("gateForm");
const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const q3 = document.getElementById("q3");
const clearBtn = document.getElementById("clearBtn");
const errorEl = document.getElementById("error");

function norm(s){
  return (s ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function showError(msg){
  errorEl.textContent = msg;
  errorEl.classList.add("show");
}

function hideError(){
  errorEl.textContent = "";
  errorEl.classList.remove("show");
}

function alreadyUnlocked(){
  return localStorage.getItem(LS_UNLOCKED) === "1";
}

function unlockAndGo(displayName){
  localStorage.setItem(LS_UNLOCKED, "1");
  localStorage.setItem(LS_NAME, displayName);
  // NEW: tell birthday page to celebrate once
  localStorage.setItem(LS_JUST_UNLOCKED, "1");
  window.location.href = SUCCESS_REDIRECT;
}

// If already unlocked, skip login
if (alreadyUnlocked()) {
  window.location.href = SUCCESS_REDIRECT;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  hideError();

  const a1 = norm(q1.value);
  const a2 = q2.value;
  const a3 = norm(q3.value);
  const a4 = q4.value;

  if (!a1 || !a2 || !a3 || !a4) {
    showError("怎么没回答完就点确认dae :M");
    return;
  }

  const q4Matches = ANSWERS.q4.some(
    answer => answer === a4
  );

  const ok =
    a1 === norm(ANSWERS.q1) &&
    a2 === ANSWERS.q2 &&
    a3 == norm(ANSWERS.q3) &&
    q4Matches;

  if (!ok) {
    showError("验证失败 再考虑一下 实在不行请联系客服🙂‍↔️");
    return;
  }

  // Use the entered name (original casing) for the birthday page greeting
  unlockAndGo("DAE");
});

clearBtn.addEventListener("click", () => {
  q1.value = "";
  q2.value = "";
  q3.value = "";
  hideError();
  q1.focus();
});
