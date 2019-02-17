
const connection = require('../connection');
// Scrapes the UCR Dining Hall Menus to get Breakfast, Lunch, and Dinner options.
const rp = require('request-promise');
const $ = require('cheerio');
const today = new Date();
const day = today.getDate() + 1; // Get tomorrow's date
const month = today.getMonth() + 1;
const year = today.getFullYear();

const lothianURL = 'http://138.23.12.141/foodpro/shortmenu.asp?sName=University+of+California%2C+Riverside+Dining+Services&locationNum=02&locationName=Lothian+Residential+Restaurant&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=' + month + '%2F' + day + '%2F' + year;

const aiURL = 'http://138.23.12.141/foodpro/shortmenu.asp?sName=University+of+California%2C+Riverside+Dining+Services&locationNum=03&locationName=A+-+I+Residential+Restaurant&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=' + month + '%2F' + day + '%2F' + year;

let LothianMenu = JSON.parse('{"breakfast":[], "lunch": [], "dinner" : []}')
let AIMenu = JSON.parse('{"breakfast":[], "lunch": [], "dinner" : []}')

let Database = null;

getMenu();
//USER INFO
let usr = JSON.parse('{' +
    '"activity": "Lightly active (1 - 3 days/week)",' +
    '"age": "21",' +
    '"allergies": ["peanuts"],' +
    '"calories": "2000",' +
    '"carbohydrates": 34,' +
    '"experience": "expert",' +
    '"fats": 33,' +
    '"feet": "5",' +
    '"gender": "Male",' +
    '"goalWeight": "undefined",' +
    '"inches": "7",' +
    '"meals": "3",' +
    '"proteins": 33,' +
    '"weight": "130"' +
    '}')

//console.log(usr)



function getMenu() {
    console.log("REACH LOTHIAN SEARCH")
    parse(lothianURL, "Lothian",function () {
        console.log("Lothian Menu")
        console.log(LothianMenu)

        console.log("REACH AI SEARCH")
        parse(aiURL, "AI", function () {
            console.log("AI Menu");
            console.log(AIMenu);
            retrieveDatabase();
        });
    });
}

function retrieveDatabase(callback){
    let sql = "SELECT * FROM UCRDining";
    if(AIMenu.breakfast !== null) {
        connection.connect(function (err) {
            if (err) throw err;
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                //console.log(result);
                Database = result;
                //console.log(Database);
                returnMealAI();
            });
        });
    }
}

function parse(url, location,callback) {
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
                //console.log("Lothian Menu for " + month + "/" + day + "/" + year);
            } else if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "AI"){
                //console.log("AI Menu for " + month + "/" + day + "/" + year);
            }

            if(breakfast.length !== 0) {
                //console.log("Number of Breakfast Options: " + breakfast.length);
                //console.log("Breakfast: ");
                //console.log(breakfast);
                if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "Lothian") {
                    LothianMenu.breakfast = breakfast;
                } else if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "AI"){
                    AIMenu.breakfast = breakfast;
                }
            }

            if(lunch.length !== 0) {
                //console.log("Number of Lunch Options: " + lunch.length);
                //console.log("Lunch:");
                //console.log(lunch);
                if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "Lothian") {
                    LothianMenu.lunch = lunch;
                } else if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "AI"){
                    AIMenu.lunch = lunch;
                }
            }

            if(dinner.length !== 0) {
                //console.log("Number of Dinner Options: " + dinner.length);
                //console.log("Dinner:");
                //console.log(dinner);
                if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "Lothian") {
                    LothianMenu.dinner = dinner;
                } else if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "AI"){
                    AIMenu.dinner = dinner;
                }
            }
            console.log("SUCCESS");
            callback();
        }).catch(function(err) {
        // Error
        callback();
        console.log("Could not get web page");

    });
}

function returnMealAI() {
    console.log("REACH return Meal AI")
    let numCaloriesBreakfast = 0;
    let numCaloriesLunch = 0;
    let numCaloriesDinner = 0;
    let carbRatio = 0;
    let fatRatio = 0;
    let proteinRatio = 0;

    if(usr.experience === "expert"){
        numCaloriesBreakfast = usr.calories * 0.3;
        numCaloriesLunch = usr.calories * 0.3;
        numCaloriesDinner = usr.calories * 0.4;
        carbRatio = usr.carbohydrates/100;
        fatRatio = usr.fats/100;
        proteinRatio = usr.proteins/100;
    }

    let breakfastOptions = JSON.stringify(AIMenu.breakfast);
    let breakFastArray = JSON.parse('[]');
    if(AIMenu.breakfast !== null){
        for(let i = 0; i < Database.length; i++){
            if((breakfastOptions.includes(Database[i].foodName))){
                let temp = Database[i]
                let include = true
                for(let j=0; j < usr.allergies.length; j++){
                    if((temp.ingredients.toLowerCase()).includes(usr.allergies[j])){
                        if(include === true){
                            include = false
                        }
                    }
                }
                if(include === true){
                    breakFastArray.push(temp)
                }
            }
        }
        let idealCarb = (numCaloriesBreakfast * carbRatio) / 4;
        let idealFat = (numCaloriesBreakfast * fatRatio) / 9;
        let idealProtein = (numCaloriesBreakfast * proteinRatio) / 4;

        console.log(idealCarb);
        console.log(idealFat);
        console.log(idealProtein);

        let meal = mealForwardSelection(breakFastArray, idealCarb, idealFat, idealProtein);
        console.log(meal);

    }
    //console.log('AI BF Menu: ')
    //console.log(AIMenu);

    //console.log('AI Array')
    //console.log(breakFastArray);



//let test = mealsArray[0];
//console.log(test)
//console.log(oneNN(idealCarb,idealFat,idealProtein,test));
}

function mealForwardSelection(mealsArray,idealCarb,idealFat,idealProtein){
    let bestTotalError = 999;
    let totalCarb = 0;
    let totalFat = 0;
    let totalProtein = 0;
    let meal = JSON.parse('[]');
    do{
        var bestCurrentError = 999;
        let currentCarb = totalCarb;
        let currentFat = totalFat;
        let currentProtein = totalProtein;
        let location = 0;
        for(let i = 0; i < mealsArray.length; i++) {
            let obj = mealsArray[i];
            let error = oneNN(idealCarb, idealFat, idealProtein, totalCarb + obj.carb, totalFat + obj.fat, totalProtein + obj.protein,);
            if(error < bestCurrentError){
                bestCurrentError = error;
                currentCarb = totalCarb + obj.carb;
                currentFat = totalFat + obj.fat;
                currentProtein = totalProtein + obj.protein;
                location = i;
            }
        }
        if(bestCurrentError < bestTotalError){
            bestTotalError = bestCurrentError;
            totalCarb = currentCarb;
            totalFat = currentFat;
            totalProtein = currentProtein;
            let temp = JSON.parse('{"foodName": "", "numGrams": 0}');
            temp.foodName = mealsArray[location].foodName;
            temp.numGrams = mealsArray[location].serving_size;
            meal.push(temp);
        }
    }while(bestCurrentError <= bestTotalError);
    console.log(totalCarb);
    console.log(totalFat);
    console.log(totalProtein);
    console.log(totalCarb*4 + totalFat*9 + totalProtein*4);
    return meal;
}



function oneNN(idealCarb,idealFat,idealProtein,checkCarb,checkFat,checkProtein){
    //return Math.abs(idealCarb - checkCarb) + Math.abs(idealFat - checkFat) + Math.abs(idealProtein - checkProtein);
    return Math.sqrt(Math.pow((idealCarb-checkCarb),2) + Math.pow((idealFat-checkFat),2) + Math.pow((idealProtein-checkProtein),2));
}