/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Emailaddresses = require('machinepack-emailaddresses');
var Passwords = require('machinepack-passwords');
var Gravatar = require('machinepack-gravatar');

module.exports = {
    signup: function (req, res) {

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
            error: function (err) {
                return res.serverError(err);
            },
            // The provided string is not an email address.
            invalid: function () {
                return res.badRequest('Doesn\'t look like an email address to me!');
            },
            // OK.
            success: function () {
                // Encrypt the password
                Passwords.encryptPassword({
                    password: req.param('password'),
                }).exec({

                    error: function (err) {
                        return res.serverError(err);
                    },

                    success: function (result) {
                        try {
                            // Create Gravatar URL
                            var gravatarURL = Gravatar.getImageUrl({
                                emailAddress: req.param('email'),
                            }).execSync();
                        } catch (err) {
                            return res.serverError(err);
                        }

                        // Build up options
                        var options = {
                            email: req.param('email'),
                            username: req.param('username'),
                            encryptedPassword: result,
                            gravatarURL: gravatarURL
                        };

                        User.create(options).exec(function (err, createdUser) {
                            if (err) {

                                if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique') {

                                    return res.send(409, 'Email address is already taken by another user, please try again.');
                                }

                                if (err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0] && err.invalidAttributes.username[0].rule === 'unique') {

                                    return res.send(409, 'Username is already taken by another user, please try again.');
                                }

                                return res.negotiate(err);
                            }

                            return res.json(createdUser);
                        });
                    }
                });
            }
        });
    }
};
