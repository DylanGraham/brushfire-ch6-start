/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'localMongoServer',
    migrate: 'drop',
    attributes: {
        email: {
            type: 'string',
            email: true,
            unique: true,
            required: true
        },
        username: {
            type: 'string',
            unique: true,
            required: true
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
        },

        toJSON: () => {
            const modelAttributes = this.toObject();
            delete modelAttributes.password;
            delete modelAttributes.confirmation;
            delete modelAttributes.encryptedPassword;
            return modelAttributes;
        }
    }
};
