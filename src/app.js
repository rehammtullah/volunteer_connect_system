const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
const path = require("path");
const hbs = require("hbs");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const staticpath = path.join(__dirname, "../public");
const partialpath = path.join(__dirname, "../templates/partials");
const templatepath = path.join(__dirname, "../templates/views");
app.set("view engine", "hbs");
app.set("views", templatepath);
app.use(express.json());
app.use(express.static(staticpath));
hbs.registerPartials(partialpath);
const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/WebSearchAPI',
  params: {
    q: 'hello',
    pageNumber: '1',
    pageSize: '10',
    autoCorrect: 'true'
  },
  headers: {
    'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
    'X-RapidAPI-Host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
  }
};
const start = async function() {
try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}
}
start();
app.listen(5007, () => {
    console.log("connected");
});