var Backbone = require ('backbone');
var _ = require ('underscore');
var $ = require ('jquery');


module.exports = Backbone.View.extend({
  el: "#fb_feed",

  render: function() {
    this.template = _.template( this.$('#fb_template').html() );
    this.$el.append(this.template(this.model.toJSON()));

    this.model.set({ loaded: true });

  },

  renderAvatar: function(avatarModel) {

    // find the alread rendered <li> from the DOM
    // and reach a little further for span.avatar
    var avatarSpan = this.$('li.id-' + this.model.get('id') + ' .avatar');
    var avatarTemplate = _.template( this.$('#fb_template_avatar').html() );

    // console.log(avatarModel.toJSON());
    avatarSpan.html(avatarTemplate(avatarModel.toJSON()));

  }

});
