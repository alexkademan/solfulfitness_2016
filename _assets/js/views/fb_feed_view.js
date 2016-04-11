var Backbone = require ('backbone');
var _ = require ('underscore');
var $ = require ('jquery');

var FBposts = require('./../models/fb_post_collection');
var FBavatars = require('./../models/fb_avatar_collection');
var FBpostView = require ('./fb_post_view');


module.exports = Backbone.View.extend({
  el: '#fb_feed',

  initialize: function() {
    if( this.$el.length === 1){
      // empty collection for the posts:
      app.fbPosts = new FBposts();

      // empty collection for the Avatars (profile pic of whoever made the post):
      app.fbAvatars = new FBavatars();

      this.getFBdata();
      // fire new ajax request every time there is a new post added to the collection:
      app.fbFeedModel.on(
        'change:fetchedPosts', this.getIndividualPost
      );

    };
  },

  getFBdata: function() {
    // this function pulls all the IDs for each post that we need.
    $.ajax({
      url: './fb_feed/?postID=IDs',
      dataType: 'json'

    }).done(function( data ) {

      // add the post to the collection:
      for(var key in data) {
        data[key]['order'] = key;
        app.fbPosts.add( data[key] );
      };
      // record the total number of posts we're looking for:
      app.fbFeedModel.set({
        postCount: app.fbPosts.length,
        fetchedPosts: 0
      });
    });
  },

  getIndividualPost: function( post ) {
    var thisID = app.fbFeedModel.get('fetchedPosts');
    var thisNumber = app.fbPosts.models[thisID].id;

    $.ajax({
      url: 'fb_feed/?postID=' + app.fbPosts.models[thisID].id,
      dataType: 'json'

    })
    .done(function( data ) {

      if( app.fbAvatars.get(data.from.id) === undefined){
        app.fbFeed.collectAvatar( data.from.id );
      };

      // match the ID to the array collection of posts that we're looking for
      // so that we can load to the page in order.
      var postModel = app.fbPosts.get(data.id);

      // use a jquery utility to merge the object already created
      // with the results of my request to the FB server:
      postModel.attributes = $.extend(postModel.attributes, data);

      var view = new FBpostView({ model: postModel });

      var readyCountVal = app.fbFeedModel.get('readyCount') + 1;
      app.fbFeedModel.set({ readyCount: readyCountVal });

      // EVERYTHING about the post has been gathered
      // including the avatar,
      // so we're ready to render to the DOM:
      app.fbFeed.renderInOrder(view);

    })
    .fail(function() {
      console.log('error fetching results of page.');
    });

    if( thisID < ( app.fbFeedModel.get('postCount') -1 ) ){
      // only set fetchedPosts if there are more posts to pull from FB.
      // The event listener waiting for this will cause
      // this function to execute from the top immediately after this line.
      app.fbFeedModel.set({
        fetchedPosts: ++thisID
      });
    };

  },

  renderInOrder: function(view) {
    // as the posts load back into framework, this method makes sure that they
    // render to the DOM in the proper order:
    var thisCount = parseInt(view.model.get('order'));
    if( thisCount === 0 ){
      // previous doesn't need to be loaded, because there IS no previous post
      this.renderPost(view);

    } else if(
      thisCount > 0
      && thisCount < app.fbFeedModel.get('postCount')
    ) {

      if(app.fbPosts.models[thisCount - 1].get('loaded') === true){
        // the previous one is loaded, so render away!:
        this.renderPost(view);
      } else {
        // listen for the previous to render so this one can render:
        app.fbPosts.models[thisCount - 1].on(
          'change:loaded', function(){
            // view.render();
            app.fbFeed.renderPost(view); // "this" is now out of scope. so call this by its full name.
          }
        );
      }

    };
  },

  renderPost: function(view) {
    if(parseInt(view.model.get('order')) === 0) {
      // this is the first post to render,
      // so hide the loader:
      this.hideLoadingSpinner();
    };

    view.render();

    var avatarModel = app.fbAvatars.get( view.model.get('from').id );
    if(avatarModel.get('loaded') === false){
      // console.log(view.model.get('from').id);
      // console.log(avatarModel);
      avatarModel.on('change:loaded', function(){
        view.renderAvatar(avatarModel);
      });
    } else if(avatarModel.get('loaded') === true){
      view.renderAvatar(avatarModel);
    };
  },

  hideLoadingSpinner: function() {
    this.$('li.loading').addClass('hid');
  },

  collectAvatar: function( avatarID ) {
    // add to the collection before casting the request
    app.fbAvatars.add( { id: avatarID } );
    $.ajax({
      url: 'fb_feed/?avatarID=' + avatarID,
      dataType: 'json'
    })
    .done(function( data ) {
      // once the successful request is back, then move to the collection:
      if(data.picture.data.url){
        app.fbAvatars.get( avatarID ).set({
          imgURL: data.picture.data.url,
          loaded: true
        });
      }

    }).fail(function(){
      console.log("nuthin' came back.");
    });
  }

});
