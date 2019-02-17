// Scrapes the UCR Dining Hall Menus to get Breakfast, Lunch, and Dinner options.

const rp = require('request-promise');
const $ = require('cheerio');
const today = new Date();
const day = today.getDate() + 1; // Get tomorrow's date
const month = today.getMonth() + 1;
const year = today.getFullYear();

const lothianURL = 'http://138.23.12.141/foodpro/shortmenu.asp?sName=University+of+California%2C+Riverside+Dining+Services&locationNum=02&locationName=Lothian+Residential+Restaurant&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=' + month + '%2F' + day + '%2F' + year;

const aiURL = 'http://138.23.12.141/foodpro/shortmenu.asp?sName=University+of+California%2C+Riverside+Dining+Services&locationNum=03&locationName=A+-+I+Residential+Restaurant&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=' + month + '%2F' + day + '%2F' + year;

parse(lothianURL, "Lothian");
parse(aiURL, "AI");

function parse(url, location) {
    rp(url)
    .then(function(html) {
        // Success
        let pathToFoods = 'table > tbody > tr > td > div > span';
        let pathLength = $(pathToFoods, html).length;
        let numMeals = $('div.shortmenumeals', html).length; // 3 for weekday. 2 for weekend.
        const mealOptions = [];
        for(let i = 0; i < pathLength; i++) {
            let rawHTML = $(pathToFoods, html)[i].children[0];
            mealOptions.push(rawHTML);
        }

        const breakfast = [];
        const lunch = [];
        const dinner = [];
        // Only populate Lunch and Dinner on Weekends
        let count = 0;
        let weekend = false;
        if(numMeals == 2) {
            weekend = true;
            count = 1;
        }

        // Split into Breakfast, Lunch, and Dinner
        mealOptions.forEach(function(element) {
            if(element.data === '-- Soup & Deli Bar --' || element.data === '-- Soups & Deli --') {
                if(!weekend) { // On weekends, only increment count once. Otherwise twice.
                    count++;
                } else {
                    weekend = false;
                }
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

        if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "Lothian") {
            console.log("Lothian Menu for " + month + "/" + day + "/" + year);
        } else if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "AI"){
            console.log("AI Menu for " + month + "/" + day + "/" + year);
        }
        
        if(breakfast.length !== 0) {
            console.log("Number of Breakfast Options: " + breakfast.length);
            console.log("Breakfast: ");
            console.log(breakfast);
        }
        
        if(lunch.length !== 0) {
            console.log("Number of Lunch Options: " + lunch.length);
            console.log("Lunch:");
            console.log(lunch);
        }
        
        if(dinner.length !== 0) {
            console.log("Number of Dinner Options: " + dinner.length);
            console.log("Dinner:");
            console.log(dinner);
        }
        console.log();
    }).catch(function(err) {
        // Error
        console.log("Could not get web page");
    });
}