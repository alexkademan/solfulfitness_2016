var Backbone = require ('backbone');
var _ = require ('underscore');
var $ = require ('jquery');

module.exports = Backbone.View.extend({

  el: window,

  initialize: function() {

    this.updatePageSize();
    this.$el.on('resize', this.updatePageSize);
    this.$el.on('scroll', this.updatePageSize);

  },

  updatePageSize: function() {
    var windowWidth = $(window).width(), //retrieve current window width
        windowHeight = $(window).height(), //retrieve current window height
        documentWidth = $(document).width(), //retrieve current document width
        documentHeight = $(document).height(), //retrieve current document height
        vScrollPosition = $(document).scrollTop(); //retrieve the document scroll TOP position
        // hScrollPosition = $(document).scrollLeft();


    app.windowStatus.set({
      windowWidth: windowWidth,
      windowHeight: windowHeight,
      documentWidth: documentWidth,
      documentHeight: documentHeight,
      vScrollPosition: vScrollPosition
    });

    if (windowWidth > app.windowStatus.get('palmWidth')){
      app.windowStatus.set({'palmSize': false});
    } else {
      app.windowStatus.set({'palmSize': true});
    };

  }

});
