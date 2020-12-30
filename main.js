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
  const rawSearchTerm = text.value.trim();
  const regex = /[ ]{2,}/gi;
  const searchTerm = rawSearchTerm.replaceAll(regex, " ");
  return searchTerm;
};

const getMaxChars = () => {
  const width = window.innerWidth || window.body.clientWidth;
  let maxChars;
  if (width < 414) maxChars = 65;
  if (width >= 414 && width < 1400) maxChars = 100;
  if (width >= 1400) maxChars = 130;
};

const getWikiSearchString = (searchTerm) => {
  const maxChars = getMaxChars();
  const rawSearchString = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`;
  const searchString = encodeURI(rawSearchString);
  return searchString;
};

const wikiRequestData = async (searchString) => {
  try {
    const response = await fetch(searchString);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const processWikiResults = (results) => {};

const retrieveSearchResults = async (searchTerm) => {
  const wikiSearchString = getWikiSearchString(searchTerm);
  const wikiSearchResults = await wikiRequestData(wikiSearchString);
  let resultArray = [];
  if (wikiSearchResults.hasOwnProperty("query")) {
    resultArray = processWikiResults(wikiSearchResults.query.pages);
  }
  return resultArray;
};

const showFormButton = (val) => {
  if (val) {
    submitBtn.style.display = "none";
    closeBtn.style.display = "inline";
  } else {
    closeBtn.style.display = "none";
    submitBtn.style.display = "inline";
  }
};

const submitHandler = async (e) => {
  e.preventDefault();
  // get search term
  const searchTerm = getSearchTerm();
  if (searchTerm === "") return;
  const resultArray = await retrieveSearchResults(searchTerm);
  console.log(resultArray);
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
