// Scrapes the UCR Dining Hall Menus to get Breakfast, Lunch, and Dinner options.

const rp = require('request-promise');
const $ = require('cheerio');
const url = 'http://138.23.12.141/foodpro/shortmenu.asp?sName=University+of+California%2C+Riverside+Dining+Services&locationNum=02&locationName=Lothian+Residential+Restaurant&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=2%2F19%2F2019'

rp(url)
    .then(function(html) {
        // Success
        let pathToFoods = 'table > tbody > tr > td > div > span';
        let pathLength = $(pathToFoods, html).length;
        const mealOptions = [];
        for(let i = 0; i < pathLength; i++) {
            let rawHTML = $(pathToFoods, html)[i].children[0];
            mealOptions.push(rawHTML);
        }
        const breakfast = [];
        const lunch = [];
        const dinner = [];
        let count = 0;
        // Split into Breakfast, Lunch, and Dinner
        mealOptions.forEach(function(element) {
            if(element.data === '-- Soup & Deli Bar --') {
                count++;
            }
            if(element.name === 'a') {
                if(count === 0) {
                    breakfast.push(element.children[0].data);
                } else if(count === 1) {
                    lunch.push(element.children[0].data);
                } else {
                    dinner.push(element.children[0].data);
                }
            }
        });
        
        console.log("Number of Breakfast Options: " + breakfast.length);
        console.log("Breakfast: ");
        console.log(breakfast);

        console.log("Number of Lunch Options: " + lunch.length);
        console.log("Lunch:");
        console.log(lunch);

        console.log("Number of Dinner Options: " + dinner.length);
        console.log("Dinner:");
        console.log(dinner);
    }).catch(function(err) {
        // Error
        console.log("Could not get web page");
    });