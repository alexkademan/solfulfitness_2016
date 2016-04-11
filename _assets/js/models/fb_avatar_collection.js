var Backbone = require ('backbone');
var Avatar = require ('./fb_avatar_model');

module.exports = Backbone.Collection.extend({
    model: Avatar
});
