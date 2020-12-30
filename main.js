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

const processWikiResults = (results) => {
  const resultsArray = [];
  Object.keys(results).map((key) => {
    const id = key;
    const title = results[key].title;
    const text = results[key].extract;
    const img = results[key].hasOwnProperty("thumbnail")
      ? results[key].thumbnail.source
      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARIAAAC4CAMAAAAYGZMtAAAAdVBMVEVpXM2HfdFeUc7/8rbdyr7/7LiFe9H/87ZZTM9mWc1kV87/8LedjsdiVc5xZMzn1L6hlM1/ddKtncTz37qyosTWw7+XjM5+ccr96LmUhciGeMrXxb7/97VrXs1dUM6tn8p6cdPLucDiz72Rhs90bNTv27q6qcNOvLJNAAABwUlEQVR4nO3bXXPSQBiAUUyMdBPSKh9FpB+olf//EwUGCs72YsNY0Ow5V9wwszyThJdhdzAAAAAAAAAAAAAAAAAAAAAAAPjvtEUX7bWXewH1+GMX0xyaTJoyXTW8ufZ6L2DSPH9Odf81jyTl/adUq3ySfEgkiSSS7EkSkSQiyUFoQ9hNopLshUVVNd+3TSTZa6dNNZxJcmKTZDlw45xqp+Ws2L2SZE+SiCQRSSKSRCQ5CnVdB0lOhPloNFrUkhw9VU1TPiyCJK9uhtXd3Y9bV8nRJsmqKDxLTmySzDdPV0mOJIlIEpEk8laSn19SvWSSZPOtnKyPf5NHScKvDhsHyqZ6uvIH+PviJNsJP93uzf0S3zjb34Hp+lfkjSQpQp/3Hp2VJLyMH99xTVd2VpJi9jDu73VyZpKyx9v2JImcJkkeMZ4ySdIsB7eJBssmjyRVk6zKIcl2M0UXix7OaHuHJJuhNXTQx6n14DUJB92SZHGwolOSx+U6gyZdkoRvw8m7Lubf0C1JKcmf8kmyKto0xTyXJOtxoud1k0mS9INrTRZJ2mmn043j+toLvgBnYAEAAAAAAAAAAAAAAAAAAACA3vsNEW1B3Y++7NIAAAAASUVORK5CYII=";
    const item = {
      id,
      title,
      text,
      img,
    };
    resultsArray.push(item);
  });
  return resultsArray;
};

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

const processSearchResults = () => {
// get search term
const searchTerm = getSearchTerm();
  if (searchTerm === "") return;
  const resultsArray = await retrieveSearchResults(searchTerm);
  if(resultsArray.length) {
    // build search results

    // set stats line
  } else {

  }
  console.log(resultsArray);

}

const submitHandler = async (e) => {
  e.preventDefault();
  // delete prev search results

  processSearchResults();
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
