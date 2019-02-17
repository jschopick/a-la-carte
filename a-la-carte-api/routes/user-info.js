const connection = require('../connection');

// Post request to populate database with current user information.
module.exports = function(router) {
  router.post('/userinfo', function(req, res) {
    let info = req.body;
    console.log(info);
    let sql = "SET @calories = ?; SET @carbohydrates = ?; SET @proteins = ?; SET @fats = ?; SET @allergies = ?; SET @meals = ?; SET @activity = ?; SET @experience = ?; SET @weight = ?; SET @goalWeight = ?; SET @feet = ?; SET @inches = ?; SET @gender = ?; SET @age = ?; CALL UserAddOrUpdate(@calories, @carbohydrates, @proteins, @fats, @allergies, @meals, @activity, @experience, @weight, @goalWeight, @feet, @inches, @gender, @age);"
    connection.query(sql, [info.calories, info.carbohydrates, info.proteins, info.fats, info.allergies, info.meals, info.activity, info.experience, info.weight, info.goalWeight, info.feet, info.inches, info.gender, info.age], function(err, rows) {
      if(err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        console.log('\nSuccessful Post to DB');
        return res.send(rows); // TODO: Return JSON object for AI and Lothian Meal Plans
      }
    });
  });
};

