var Backbone = require ('backbone');
var Post = require ('./fb_post_model');

module.exports = Backbone.Collection.extend({
    model: Post
});
