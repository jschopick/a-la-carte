const connection = require('../connection');

// Get request for everything in Top Genres database
module.exports = function(router) {
  router.post('/userinfo', function(req, res) {
    let info = req.body;
    console.log(info);
    let sql = "SET @calories = ?; SET @carbohydrates = ?; SET @proteins = ?; SET @fats = ?; SET @allergies = ?; SET @meals = ?; SET @activity = ?; SET @experience = ?; SET @weight = ?; SET @goalWeight = ?; SET @feet = ?; SET @inches = ?; SET @gender = ?; SET @age = ?; CALL UserAddOrUpdate(@calories, @carbohydrates, @proteins, @fats, @allergies, @meals, @activity, @experience, @weight, @goalWeight, @feet, @inches, @gender, @age);"
    connection.query(sql, weight.weight, function(err, rows) {
      if(err) {
        console.log('Error: could not execute query');
        return res.status(500).send(err);
      } else {
        console.log('\nSuccessful Post to DB');
        console.log(rows);
        return res.send(rows);
      }
    });
  });
};