/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'localMongoServer',
    attributes: {
        email: {
            type: 'string'
        },
        username: {
            type: 'string'
        },
        encryptedPassword: {
            type: 'string'
        },
        gravatarURL: {
            type: 'string'
        },
        deleted: {
            type: 'boolean'
        },
        admin: {
            type: 'boolean'
        },
        banned: {
            type: 'boolean'
        }
    }
};
