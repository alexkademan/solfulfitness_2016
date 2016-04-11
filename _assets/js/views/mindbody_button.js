// app.mindBodyButton

var Backbone = require ('backbone');
var _ = require ('underscore');
var $ = require ('jquery');

module.exports = Backbone.View.extend({
  el: '#sign_up_now',

  events: {
    'click': 'launchMINDBODY'
  },

  initialize: function() {
    if(this.$el.length === 1) {
      // the "sign up now" button is within the dom
      this.$el.attr('style', 'height: 0px');

      setTimeout(function(){
        app.mindBodyButton.enlargeBanner();
      }, 750);
    };
  },

  enlargeBanner: function() {
    var callOutHeight = this.$('.classes').outerHeight();
    this.$el.attr('style', 'height: ' + callOutHeight + 'px');
    // console.log(this.$el);
  },

  launchMINDBODY: function(e) {
    e.preventDefault();
    var theLink = this.$el[0].href;

    //window height and width
    var myWidth = 1050;
    var myHeight = screen.height*.80;
    if( myWidth > screen.width ) { myWidth = screen.width; } // keep it from being wider than the user's screen

    //widow height bounds
    if ( myHeight < 550 ) {
      myHeight = 550;
    } else if (myHeight>900) {
      myHeight = 900;
    }

    //get screen size, and cacl center screen positioning
    var height = screen.height;
    var width = screen.width;
    var leftpos = width / 2 - myWidth / 2;
    var toppos = (height / 2 - myHeight / 2) - 40;

     //open window
     msgWindow=window.open(theLink,"ws_window","toolbar=no,location=no,directories=no,resizable=yes,menubar=no,scrollbars=no,status=yes,width=" + myWidth + ",height="+ myHeight + ", left=" + leftpos + ",top=" + toppos);

     //focus window
     setTimeout('msgWindow.focus()',1);
  }

});
