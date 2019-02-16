// Scrapes the UCR Dining Hall Menus to get Breakfast, Lunch, and Dinner options.

const rp = require('request-promise');
const $ = require('cheerio');
const url = 'http://138.23.12.141/foodpro/shortmenu.asp?sName=University+of+California%2C+Riverside+Dining+Services&locationNum=02&locationName=Lothian+Residential+Restaurant&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=2%2F19%2F2019'

rp(url)
    .then(function(html) {
        // Success
        // let pathToFoods = 'div > div > table > tbody > tr > td > table > tbody > tr > td > table';
        let pathToFoods = 'table > tbody > tr > td > div > span';
        // let pathToFoods = 'tr > td > div > span > a';
        let pathLength = $(pathToFoods, html).length;
        const mealOptions = [];
        for(let i = 0; i < pathLength; i++) {
            let raw = $(pathToFoods, html)[i].children[0].data;
            mealOptions.push(raw);
        }
        const breakfast = [];
        console.log("Number of meal options: " + pathLength);
        console.log("Today's menu");
        console.log(mealOptions);
    }).catch(function(err) {
        // Error
        console.log("Could not get web page");
    });