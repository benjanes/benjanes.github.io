$(document).ready(function () {

  var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {return setTimeout(callback, 1);};

  // Positioning and sizing variables
  var $page_content      = $('.page-content'),
      $header             = $('.site-header'),
      $footer             = $('.site-footer'),
      $header_banner      = $('.site-banner'),
      $title_bar          = $('.title-menu-bar'),
      $menu_icon          = $('.menu-icon'),
      $trigger            = $('.trigger'),
      page_height         = window.innerHeight,
      page_width          = $(window).width(),
      doc_height          = document.body.offsetHeight,
      page_top            = window.scrollY,
      footer_height       = $footer.innerHeight(),
      title_bar_height    = $title_bar.outerHeight();

  // menu underline bar animation variables
  var underline_canvas  = document.getElementById('underline'),
      ctxU              = underline_canvas.getContext('2d'),
      menu_links        = document.getElementsByClassName('page-link'),
      menu_link_widths  = [0],
      menu_link_x       = [-2],
      underlineStroke   = 'black';

  $( document ).ajaxComplete(function(){
    doc_height = document.body.offsetHeight;
  });
  /*  All the sizing and positioning for the page  **
  **************************************************/

  // grab the new outer height of the footer
  var footer_outer_height = $footer.outerHeight();

  // toggle menu display via click on hamburger button
  var clickCtr = 0;
  $menu_icon.click(function(e){
    if (clickCtr === 0) {
      $trigger.css({
        display: 'block',
        'padding-bottom': '5px'
      });
      // the velocity.js animation of the svg icon
      $(burgerLine1).velocity({ y1: '+= 6', y2: '+= 6' }).velocity({ y1: '+= 6', y2: '-= 6'});
      $(burgerLine2).velocity({ strokeOpacity: '0' });
      $(burgerLine3).velocity({ y1: '-= 6', y2: '-= 6' }).velocity({ y1: '-= 6', y2: '+= 6'});
      clickCtr = 1;
    } else if (clickCtr === 1) {
      $trigger.css({
        display: 'none',
        'padding-bottom': '0'
      });
      // the velocity.js animation of the svg icon
      $(burgerLine1).velocity({ y1: '-= 6', y2: '+= 6' }).velocity({ y1: '-= 6', y2: '-= 6'});
      $(burgerLine2).velocity({ strokeOpacity: '1' });
      $(burgerLine3).velocity({ y1: '+= 6', y2: '-= 6' }).velocity({ y1: '+= 6', y2: '+= 6'});
      clickCtr = 0;
    }
    e.preventDefault();
  });

  banner_height = $header_banner.outerHeight();
  banner_width = $header_banner.outerWidth();

/* SCROLL FUNCTIONS HERE */
  $(window).scroll(function () {
    page_top = $(document).scrollTop();
    // Scroll function used to fix the title and navbar once the banner has been passed
    scrollBasedPositioning();
  });

  function socialBtnPositioning() {
    // if the footer is in view, social links displayed in footer instead of fixed on side
    if( page_top > (doc_height - page_height - footer_outer_height) || page_width < 800 ) {
      $('.social-buttons').css({
        position: 'static'
      });
      $('.social-buttons a').css({
        display: 'inline'
      });
    } else {
      if( page_top <= (doc_height - page_height - footer_outer_height) && page_width > 800 ) {
        $('.social-buttons').css({
          position: 'fixed'
        });
        $('.social-buttons a').css({
          display: 'block'
        });
      }
    }
  }
  socialBtnPositioning();

  function headerFixing() {
    if (page_top > banner_height) {
      $title_bar.css({
        position: 'fixed',
        top: '5px',
        width: banner_width + 'px',
        'border-bottom': '1px solid #E8E8E8'
      });
      $page_content.css({
        'padding-top': '66px'
      });

    } else {
      if( page_top < banner_height ){
        $('.title-menu-bar').css({
          position: 'relative',
          top: '0px',
          'border-bottom': 'none',
          width: 'auto'
        });
        $page_content.css({
          'padding-top': '10px'
        });
      }
    }
  }

  function scrollBasedPositioning() {
    headerFixing();
    socialBtnPositioning();
  }

  /* end of the sizing and placement business */

  /*  The menu underline bar animations  **
  ****************************************/
  var activeCallback = $.Callbacks();

  var unXpos, unWidth;
  // the links as jquery obj
  var $menu_links = $('.page-link');
  // if on one of the menu pages, set the currentIndex to that
  var currentIndex;
  if ( document.getElementsByClassName('active')[0] !== undefined ) {
    currentIndex = $('.page-link').index( $('.active') ) + 1;
  } else {
    currentIndex = 0;
  }
  var hovIndex = currentIndex;

  // set the size of the canvas... right now these are essentially fixed
  underline_canvas.setAttribute('height', 56);
  underline_canvas.setAttribute('width', 383);

  activeCallback.add(function(){
    measureLinks();
    setUnderline();

    animate();

  });

  // Update hovIndex on hover
  $menu_links.hover(function(){
    hovIndex = $menu_links.index($(this)) + 1;
    underlineStroke = 'red';
    unWidth = unWidth / 10;
  }, function(){
    hovIndex = currentIndex;
    underlineStroke = 'black';
  });

  // find the position and width of each menu link, store values in 2 arrays
  var measureLinks = function(){
    for( i = 0; i < menu_links.length; i++ ){
      var width = menu_links[i].offsetWidth - 6;
      var item_leftPos = menu_links[i].offsetLeft + 6;
      menu_link_widths.push(width);
      menu_link_x.push(item_leftPos);
    }
  };

  var setUnderline = function(){
    unXpos  = menu_link_x[currentIndex];
    unWidth = menu_link_widths[currentIndex];
  };

  var drawUnderline = function(){
    ctxU.beginPath();
    ctxU.lineCap = 'round';
    ctxU.lineWidth = 3;
    ctxU.moveTo( unXpos, 40 );
    ctxU.bezierCurveTo( unXpos, 40, unXpos + unWidth, 40, unXpos + unWidth, 40 );
    ctxU.strokeStyle = underlineStroke;
    ctxU.stroke();
  };

  var updateUnderline = function(){
    if(unXpos !== menu_link_x[hovIndex]){
      if(unXpos < menu_link_x[hovIndex]){
        unXpos += (menu_link_x[hovIndex] - unXpos) / 10;
      } else if(unXpos > menu_link_x[hovIndex]){
        unXpos -= (unXpos - menu_link_x[hovIndex]) / 10;
      }
    } else if(unXpos == menu_link_x[hovIndex]){
      unXpos = menu_link_x[hovIndex];
    }

    if(unWidth !== menu_link_widths[hovIndex]){
      if(unWidth < menu_link_widths[hovIndex]){
        unWidth += (menu_link_widths[hovIndex] - unWidth) / 15;
      } else if(unWidth > menu_link_widths[hovIndex]){
        unWidth -= (unWidth - menu_link_widths[hovIndex]) / 15;
      }
    } else if(unWidth == menu_link_widths[hovIndex]){
      unWidth = menu_link_widths[hovIndex];
    }

  };


  /*  Draw the animations w/ requestAnimFrame  **
  **********************************************/
  var animate = function(){

    // clear out and redraw the underline, after updating as needed
    ctxU.clearRect( 0, 0, underline_canvas.width, underline_canvas.height );
    updateUnderline();
    drawUnderline();

    requestAnimFrame(function(){
      animate();
    });
  };
  //animate();


/*  ALL RESIZING FUNCTIONS: recalculate relevant sizes on window resizing  **
****************************************************************************/
  function resizingFunctions() {
    // resetting of sizing and positioning vars
    page_height         = window.innerHeight;
    page_width          = $(window).width();
    page_top            = window.scrollY;
    doc_height          = document.body.offsetHeight;
    footer_height       = $footer.innerHeight();
    banner_height       = $header_banner.outerHeight();
    banner_width        = $header_banner.outerWidth();

    /* Re-positioning elements */
    footer_outer_height = $footer.outerHeight();

    scrollBasedPositioning();
    // show the menu if expanding back beyond 680px, correct for toggle then expand...
    if (page_width > 680) {
      $trigger.css({
        display: 'block',
        'padding-bottom': '0'
      });
    } else {
      if (page_width < 680) {
        $trigger.css({
          display: 'none',
          'padding-bottom': '0'
        });
      }
    }

  }

  var resizeTimer;
  $(window).resize(function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizingFunctions, 25);
  });

  // Load in the web font
  WebFont.load({
      google: {
          families: ['Rubik:400']
      },
      active: function(){
          activeCallback.fire();
      },
      inactive: function(){
          activeCallback.fire();
      }
  });

});
