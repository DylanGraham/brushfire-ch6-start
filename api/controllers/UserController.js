/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const Emailaddresses = require('machinepack-emailaddresses');
const Passwords = require('machinepack-passwords');

module.exports = {
    signup: function(req, res) {

        // email is required
        if (_.isUndefined(req.param('email'))) {
            return res.badRequest('An email address is required!');
        }

        // password is required
        if (_.isUndefined(req.param('password'))) {
            return res.badRequest('A password is required!');
        }

        // password must be at least 6 characters
        if (req.param('password').length < 6) {
            return res.badRequest('Password must be at least 6 characters!');
        }

        // username is required
        if (_.isUndefined(req.param('username'))) {
            return res.badRequest('A username is required!');
        }

        // username must be at least 6 characters
        if (req.param('username').length < 6) {
            return res.badRequest('Username must be at least 6 characters!');
        }

        // Username must contain only numbers and letters.
        if (!_.isString(req.param('username')) || req.param('username').match(/[^a-z0-9]/i)) {
            return res.badRequest('Invalid username: must consist of numbers and letters only.');
        }

        // Determine whether or not the provided string is an email address.
        Emailaddresses.validate({
            string: req.param('email'),
        }).exec({
            // An unexpected error occurred.
            error: function(err) {
                return res.serverError(err);
            },
            // The provided string is not an email address.
            invalid: function() {
                return res.badRequest('Doesn\'t look like an email address to me!');
            },
            // OK.
            success: function() {

                Passwords.encryptPassword({
                    password: req.param('password'),
                }).exec({

                    error: function(err) {
                        return res.serverError(err);
                    },

                    success: function(result) {
                        return res.json(result);
                    }
                });
            }
        });
    }
};
