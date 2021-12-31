const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");
const { up } = require("inquirer/lib/utils/readline");

// create our User Model
class User extends Model {
	// set up method to run instance data to check password
	checkPassword(loginPw) {
		return bcrypt.compareSync(loginPw, this.password);
	}
}

// define table columns and configuration
User.init(
	{
		// define an id column
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		// define username column
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// define email column
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			// there cannot be any duplicate email values in this table
			unique: true,
			// if allowNull is set to false, we can run out data through validators before creating the table data
			validate: {
				isEmail: true,
			},
		},
		// define a password column
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				// this means the password must be at least 4 characters long
				len: [4],
			},
		},
	},
	{
		hooks: {
			// set up beforeCreate lifecycle 'hook' functionality
			async beforeCreate(newUserData) {
				newUserData.password = await bcrypt.hash(newUserData.password, 10);
				return newUserData;
			},
			// set up beforeUpdate lifecycle 'hook' functionality
			async beforeUpdate(updatedUserData) {
				updatedUserData.password = await bcrypt.hash(
					updatedUserData.password,
					10
				);
				return updatedUserData;
			},
		},
		// TABLE CONFIGURATION OPTIONS GO HERE

		// pass in out imported sequelize connection (the direct connection to our database)
		sequelize,
		// don't automaticall create createdAt/updatedAt timestamp fields
		timestamps: false,
		// don't pluralize name of database table
		freezeTableName: true,
		// use underscores instead of camel-casing
		underscored: true,
		// make it do our model name stays lowercase in the database
		modelName: "user",
	}
);

module.exports = User;
