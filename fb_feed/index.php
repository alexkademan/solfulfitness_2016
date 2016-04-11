<?php

date_default_timezone_set('America/Chicago');

require_once __DIR__ . '/vendor/autoload.php';

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/get_posts.php';

// $get_fb_page_posts = new get_fb_page_posts($fb_page_ID, $post_limit);
$get_fb_page_posts = new get_fb_page_posts( $config );

if( isset($_GET['postID']) ){
  // ********************************************************
  // This prints out the JSON
  // that will be brought into
  // javascript via AJAX request
  // ********************************************************
  print_r( json_encode( $get_fb_page_posts->get_post($_GET['postID']), JSON_UNESCAPED_UNICODE) );
  // print_r( $get_fb_page_posts->get_post($_GET['postID']) );

} elseif( isset($_GET['avatarID']) ){
  // ********************************************************
  // seperate request, this time for the profile photo of the
  // FB account that published the post:
  // ********************************************************
  print_r( json_encode( $get_fb_page_posts->get_avatar($_GET['avatarID']), JSON_UNESCAPED_UNICODE) );
}

?>
