var Backbone = require ('backbone');

module.exports = Backbone.Model.extend({

  defaults: {
    postCount: 0, // total number of posts to fetch
    fetchedPosts: '', // number of posts that are already gathered
    rendered: '', // increments as the posts are available to load to DOM
    readyCount: 0 // number of posts that are ready to render
  }

});
