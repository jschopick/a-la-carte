const connection = require('../connection');
// Scrapes the UCR Dining Hall Menus to get Breakfast, Lunch, and Dinner options.
const rp = require('request-promise');
const $ = require('cheerio');
const today = new Date();
const day = today.getDate() + 3; // Get tomorrow's date
const month = today.getMonth() + 1;
const year = today.getFullYear();
let returnValue = JSON.parse('[]');
let info;

// Post request to populate database with current user information.
module.exports = function(router) {
  router.post('/userinfo', function(req, res) {
    info = req.body;
    console.log(info);
    let sql = "SET @calories = ?; SET @carbohydrates = ?; SET @proteins = ?; SET @fats = ?; SET @allergies = ?; SET @meals = ?; SET @activity = ?; SET @experience = ?; SET @weight = ?; SET @goalWeight = ?; SET @feet = ?; SET @inches = ?; SET @gender = ?; SET @age = ?; CALL UserAddOrUpdate(@calories, @carbohydrates, @proteins, @fats, @allergies, @meals, @activity, @experience, @weight, @goalWeight, @feet, @inches, @gender, @age);"
    connection.query(sql, [info.calories, info.carbohydrates, info.proteins, info.fats, info.allergies, info.meals, info.activity, info.experience, info.weight, info.goalWeight, info.feet, info.inches, info.gender, info.age], function(err, rows) {
      if(err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        console.log('\nSuccessful Post to DB');
        getMenu(); // Call backend calculation
        console.log(JSON.stringify(returnValue));
        return res.send(returnValue); // TODO: Return JSON object for AI and Lothian Meal Plans
      }
    });
  });
};

// Calclations

const lothianURL = 'http://138.23.12.141/foodpro/shortmenu.asp?sName=University+of+California%2C+Riverside+Dining+Services&locationNum=02&locationName=Lothian+Residential+Restaurant&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=' + month + '%2F' + day + '%2F' + year;

const aiURL = 'http://138.23.12.141/foodpro/shortmenu.asp?sName=University+of+California%2C+Riverside+Dining+Services&locationNum=03&locationName=A+-+I+Residential+Restaurant&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=' + month + '%2F' + day + '%2F' + year;

let LothianMenu = JSON.parse('{"breakfast":[], "lunch": [], "dinner" : []}')
let AIMenu = JSON.parse('{"breakfast":[], "lunch": [], "dinner" : []}')

let Database = null;
let usr;
// //USER INFO

// let usr = JSON.parse('{' +
//     '"activity": "Lightly active (1 - 3 days/week)",' +
//     '"age": "21",' +
//     '"allergies": ["peanuts"],' +
//     '"calories": "2000",' +
//     '"carbohydrates": 34,' +
//     '"experience": "beginner",' +
//     '"fats": 33,' +
//     '"feet": "5",' +
//     '"gender": "Male",' +
//     '"goalWeight": "100",' +
//     '"inches": "7",' +
//     '"meals": "3",' +
//     '"proteins": 33,' +
//     '"weight": "130"' +
//     '}')

function getMenu() {
    usr = info;
    if(usr.allergies[0] === '') {
        usr.allergies[0] = 'xyz';
    }
    console.log("User");
    console.log(usr);
    console.log("REACH LOTHIAN SEARCH")
    parse(lothianURL, "Lothian",function () {
        console.log("REACH AI SEARCH")
        parse(aiURL, "AI", function () {
            retrieveDatabase();
        });
    });
}

function retrieveDatabase(callback){
    let sql = "SELECT * FROM UCRDining";
    if(AIMenu.breakfast !== null || LothianMenu.breakfast !== null) {
      connection.query(sql, function (err, result, fields) {
          if (err) throw err;
          Database = result;
          returnMealAI();
          returnMealLothian();
          console.log(JSON.stringify(returnValue));
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

            if(breakfast.length !== 0) {
                if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "Lothian") {
                    LothianMenu.breakfast = breakfast;
                } else if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "AI"){
                    AIMenu.breakfast = breakfast;
                }
            }

            if(lunch.length !== 0) {
                if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "Lothian") {
                    LothianMenu.lunch = lunch;
                } else if((breakfast.length !== 0 || lunch.length !== 0 || dinner.length !== 0) && location === "AI"){
                    AIMenu.lunch = lunch;
                }
            }

            if(dinner.length !== 0) {
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
        console.log(err);
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
    let breakfastMeal = null;
    let lunchMeal = null;
    let dinnerMeal = null;
    let totalCalories = null;
    // if(usr.experience !== undefined){
    if(usr.experience === "expert"){
        numCaloriesBreakfast = usr.calories * 0.3;
        numCaloriesLunch = usr.calories * 0.3;
        numCaloriesDinner = usr.calories * 0.4;
        carbRatio = usr.carbohydrates/100;
        fatRatio = usr.fats/100;
        proteinRatio = usr.proteins/100;
    }else{
        if(usr.gender === 'Male'){
            let BMR = (((parseInt(usr.feet)*12 + parseInt(usr.inches))*2.54*6.25) + (parseInt(usr.weight)*0.454*9.99) - (parseInt(usr.age) *4.92) + 5);
            console.log('BMR');
            console.log(BMR)
            if(usr.activity.toLowerCase().includes("little")){
                totalCalories = BMR * 1.2;
            } else if (usr.activity.toLowerCase().includes("lightly")){
                totalCalories = BMR * 1.375;
            } else if (usr.activity.toLowerCase().includes("moderately")){
                totalCalories = BMR * 1.55;
            } else if (usr.activity.toLowerCase().includes("very")){
                totalCalories = BMR * 1.725;
            }
        }else{
            let BMR = ((parseInt(usr.feet)*12 + parseInt(usr.inches))*2.54*6.25) + (parseInt(usr.weight)*0.454*9.99) - (parseInt(usr.age) *4.92) - 161;
            if(usr.activity.toLowerCase().includes("little")){
                totalCalories = BMR * 1.1;
            } else if (usr.activity.toLowerCase().includes("lightly")){
                totalCalories = BMR * 1.275;
            } else if (usr.activity.toLowerCase().includes("moderately")){
                totalCalories = BMR * 1.35;
            } else if (usr.activity.toLowerCase().includes("very")){
                totalCalories = BMR * 1.525;
            }
        }
        if(parseInt(usr.goalWeight) < parseInt(usr.weight)){
            usr.calories = totalCalories - 500;
        }else if (parseInt(usr.goalWeight) === parseInt(usr.weight)){
            usr.calories = totalCalories;
        }else{
            usr.calories = totalCalories+500;
        }

        numCaloriesBreakfast = usr.calories * 0.3;
        numCaloriesLunch = usr.calories * 0.3;
        numCaloriesDinner = usr.calories * 0.4;
        carbRatio = 33/100;
        fatRatio = 33/100;
        proteinRatio = 34/100;
    }
  // }

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

        breakfastMeal = mealForwardSelection(breakFastArray, idealCarb, idealFat, idealProtein);
    }

    let lunchOptions = JSON.stringify(AIMenu.lunch);
    let lunchArray = JSON.parse('[]');
    if(AIMenu.lunch !== null){
        for(let i = 0; i < Database.length; i++){
            if((lunchOptions.includes(Database[i].foodName))){
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
                    lunchArray.push(temp)
                }
            }
        }
        let idealCarb = (numCaloriesLunch * carbRatio) / 4;
        let idealFat = (numCaloriesLunch * fatRatio) / 9;
        let idealProtein = (numCaloriesLunch * proteinRatio) / 4;

        lunchMeal = mealForwardSelection(lunchArray, idealCarb, idealFat, idealProtein);
    }

    console.log("Reached Dinner")

    let dinnerOptions = JSON.stringify(AIMenu.dinner);
    let dinnerArray = JSON.parse('[]');
    if(AIMenu.dinner !== null){
        for(let i = 0; i < Database.length; i++){
            if((dinnerOptions.includes(Database[i].foodName))){
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
                    dinnerArray.push(temp)
                }
            }
        }
        let idealCarb = (numCaloriesDinner * carbRatio) / 4;
        let idealFat = (numCaloriesDinner * fatRatio) / 9;
        let idealProtein = (numCaloriesDinner * proteinRatio) / 4;

        dinnerMeal = mealForwardSelection(dinnerArray, idealCarb, idealFat, idealProtein);
    }
    let ret = JSON.parse('{"breakfast" : [], "lunch": [], "dinner" : []}')
    ret.breakfast = breakfastMeal;
    ret.lunch = lunchMeal;
    ret.dinner = dinnerMeal;
    console.log(ret);
    returnValue.push(ret);
}

function returnMealLothian() {
    console.log("REACH return Meal Lothian")
    let numCaloriesBreakfast = 0;
    let numCaloriesLunch = 0;
    let numCaloriesDinner = 0;
    let carbRatio = 0;
    let fatRatio = 0;
    let proteinRatio = 0;
    let breakfastMeal = null;
    let lunchMeal = null;
    let dinnerMeal = null;
    // if(usr.experience !== undefined){
    if(usr.experience === "expert"){
        numCaloriesBreakfast = usr.calories * 0.3;
        numCaloriesLunch = usr.calories * 0.3;
        numCaloriesDinner = usr.calories * 0.4;
        carbRatio = usr.carbohydrates/100;
        fatRatio = usr.fats/100;
        proteinRatio = usr.proteins/100;
    }else{
        if(usr.gender === 'Male'){
            let BMR = (((parseInt(usr.feet)*12 + parseInt(usr.inches))*2.54*6.25) + (parseInt(usr.weight)*0.454*9.99) - (parseInt(usr.age) *4.92) + 5);
            console.log('BMR');
            console.log(BMR)
            if(usr.activity.toLowerCase().includes("little")){
                totalCalories = BMR * 1.2;
            } else if (usr.activity.toLowerCase().includes("lightly")){
                totalCalories = BMR * 1.375;
            } else if (usr.activity.toLowerCase().includes("moderately")){
                totalCalories = BMR * 1.55;
            } else if (usr.activity.toLowerCase().includes("very")){
                totalCalories = BMR * 1.725;
            }
        }else{
            let BMR = ((parseInt(usr.feet)*12 + parseInt(usr.inches))*2.54*6.25) + (parseInt(usr.weight)*0.454*9.99) - (parseInt(usr.age) *4.92) - 161;
            if(usr.activity.toLowerCase().includes("little")){
                totalCalories = BMR * 1.1;
            } else if (usr.activity.toLowerCase().includes("lightly")){
                totalCalories = BMR * 1.275;
            } else if (usr.activity.toLowerCase().includes("moderately")){
                totalCalories = BMR * 1.35;
            } else if (usr.activity.toLowerCase().includes("very")){
                totalCalories = BMR * 1.525;
            }
        }
        if(parseInt(usr.goalWeight) < parseInt(usr.weight)){
            usr.calories = totalCalories - 500
        }else if (parseInt(usr.goalWeight) === parseInt(usr.weight)){
            usr.calories = totalCalories
        }else{
            usr.calories = totalCalories+500
        }

        numCaloriesBreakfast = usr.calories * 0.3;
        numCaloriesLunch = usr.calories * 0.3;
        numCaloriesDinner = usr.calories * 0.4;
        carbRatio = 33/100;
        fatRatio = 33/100;
        proteinRatio = 34/100;
    }
  // }
    let breakfastOptions = JSON.stringify(LothianMenu.breakfast);
    let breakFastArray = JSON.parse('[]');
    if(LothianMenu.breakfast !== null){
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

        breakfastMeal = mealForwardSelection(breakFastArray, idealCarb, idealFat, idealProtein);
    }

    let lunchOptions = JSON.stringify(LothianMenu.lunch);
    let lunchArray = JSON.parse('[]');
    if(LothianMenu.lunch !== null){
        for(let i = 0; i < Database.length; i++){
            if((lunchOptions.includes(Database[i].foodName))){
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
                    lunchArray.push(temp)
                }
            }
        }
        let idealCarb = (numCaloriesLunch * carbRatio) / 4;
        let idealFat = (numCaloriesLunch * fatRatio) / 9;
        let idealProtein = (numCaloriesLunch * proteinRatio) / 4;

        lunchMeal = mealForwardSelection(lunchArray, idealCarb, idealFat, idealProtein);
    }

    let dinnerOptions = JSON.stringify(LothianMenu.dinner);
    let dinnerArray = JSON.parse('[]');
    if(LothianMenu.dinner !== null){
        for(let i = 0; i < Database.length; i++){
            if((dinnerOptions.includes(Database[i].foodName))){
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
                    dinnerArray.push(temp)
                }
            }
        }
        let idealCarb = (numCaloriesDinner * carbRatio) / 4;
        let idealFat = (numCaloriesDinner * fatRatio) / 9;
        let idealProtein = (numCaloriesDinner * proteinRatio) / 4;

        dinnerMeal = mealForwardSelection(dinnerArray, idealCarb, idealFat, idealProtein);
    }
    let ret = JSON.parse('{"breakfast" : [], "lunch": [], "dinner" : []}')
    ret.breakfast = breakfastMeal;
    ret.lunch = lunchMeal;
    ret.dinner = dinnerMeal;
    console.log(ret);
    returnValue.push(ret);
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
            let error = oneNN(idealCarb, idealFat, idealProtein, totalCarb + obj.carb, totalFat + obj.fat, totalProtein + obj.protein);
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
    return meal;
}

function oneNN(idealCarb,idealFat,idealProtein,checkCarb,checkFat,checkProtein){
  return Math.sqrt(Math.pow((idealCarb-checkCarb),2) + Math.pow((idealFat-checkFat),2) + Math.pow((idealProtein-checkProtein),2));
}