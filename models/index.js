'use strict';

/**
 * Required modules
 */

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

/**
 * Set configuration variables for Sequelize instance
 */
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/**
 * <p>
 *     Read all files in directory and if it is a valid model file add it to the models in the sequelize instance.
 */
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

/**
 * <p>
 *     Initiate all defined associations in the models.
 */
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

/**
 * Add sequelize instances to the database
 */
db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * Export database object
 */
module.exports = db;
