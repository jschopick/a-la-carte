
let numCalories = 500;
let carbRatio = .33;
let fatRatio = .33;
let proteinRatio = .34;
let text = '[' +
    '{ "foodName":"Assorted Bagels" , "fat":0.3 ,"carb":9.6, "protein":1.8},' +
    '{ "foodName":"Assorted Donuts" , "fat":8 ,"carb":23, "protein":1.8},' +
    '{ "foodName":"Cereal Toppings" , "fat":4.4 ,"carb":10.2, "protein":0.4},' +
    '{ "foodName":"Oatmeal" , "fat":1.5 ,"carb":13.4, "protein":2.5},' +
    '{ "foodName":"Breakfast Omelet Toppings" , "fat":8 ,"carb":1.8, "protein":9},' +
    '{ "foodName":"Egg Omelets" , "fat":11.4 ,"carb":0.9, "protein":11.1},' +
    '{ "foodName":"Egg White Omelets" , "fat":2.9 ,"carb":1.8, "protein":9.2},' +
    '{ "foodName":"Honey and Brown Sugar Baked Ham" , "fat":4.9 ,"carb":7.1, "protein":19.7},' +
    '{ "foodName":"Oven Roasted Jersey Sweet Yams" , "fat":0.1 ,"carb":22.8, "protein":1.8},' +
    '{ "foodName":"Fresh Blended Mushroom Burger" , "fat":20.5 ,"carb":21.4, "protein":16.9},' +
    '{ "foodName":"Natural Cut Fries" , "fat":6.4 ,"carb":28, "protein":2.7} ]';

let mealsArray = JSON.parse(text);
let idealCarb = (numCalories*carbRatio)/4;
let idealFat = (numCalories*fatRatio)/9;
let idealProtein = (numCalories*proteinRatio)/4;

console.log(idealCarb);
console.log(idealFat);
console.log(idealProtein);

let meal = mealForwardSelection(mealsArray,idealCarb,idealFat,idealProtein);
console.log(meal);

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
            meal.push(mealsArray[location])
        }
    }while(bestCurrentError <= bestTotalError);
    console.log(totalCarb);
    console.log(totalFat);
    console.log(totalProtein);
    console.log(totalCarb*4 + totalFat*9 + totalProtein*4);
    return meal;
}

function oneNN(idealCarb,idealFat,idealProtein,checkCarb,checkFat,checkProtein){
    return Math.abs(idealCarb - checkCarb) + Math.abs(idealFat - checkFat) + Math.abs(idealProtein - checkProtein);
}