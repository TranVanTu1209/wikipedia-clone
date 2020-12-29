const form = document.querySelector("#form");
const text = document.querySelector("#text");
const submitBtn = document.querySelector("#submitBtn");
const closeBtn = document.querySelector("#closeBtn");
const stats = document.querySelector("#stats");
const results = document.querySelector("#results");

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const getSearchTerm = () => {
  // const rawSearchTerm = 
}

const showFormButton = (val) => {
  if (val) {
    submitBtn.style.display = "none";
    closeBtn.style.display = "inline";
  } else {
    closeBtn.style.display = "none";
    submitBtn.style.display = "inline";
  }
};

const submitHandler = (e) => {
  e.preventDefault();
};

const clearInput = () => {
  closeBtn.style.display = "none";
  submitBtn.style.display = "inline";
  text.value = "";
  stats.value = "";
};

const initApp = () => {
  form.addEventListener("submit", submitHandler);
  text.addEventListener("input", (e) => {
    showFormButton(e.target.value.trim());
  });
  closeBtn.addEventListener("click", clearInput);
  showFormButton("");
};
