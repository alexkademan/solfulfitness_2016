<?php

class get_fb_page_posts {

  function __construct($config) {
    $this->config = $config;
  }

  public function get_post($post_id) {
    if($post_id === 'IDs') {
      // initial search for just the ids of all posts in question:
      return $this->find_all_posts_ids();

    } else {
      $the_post = $this->get_single_post( $post_id );

      // re-format the timestamp to a Unix timestamp:
      $the_post['unix_time'] = strtotime($the_post['created_time']);
      $the_post['r_time'] = $this->parse_time($the_post['unix_time']);

      if(isset($the_post['story_tags'])){
        $the_post['headline'] = $this->parse_headline($the_post);
      } elseif($the_post['type'] == 'link'){
        // make an array to conform to the template that works with longer, more complex headdlines:
        $the_post['headline'][0]['name'] = $the_post['from']['name'];
        $the_post['headline'][0]['url'] = 'https://facebook.com/' . $the_post['from']['id'];

      };

      switch($the_post['type']) {
        case 'photo':
          $the_post['photo'] = $this->get_the_photo($the_post);
          break;

        case 'video':
          $the_post['video'] = $this->get_the_video($the_post);
          break;
      }

      return $the_post;

    }
  }

  private function parse_time( $unix_time ) {
    $current_time = time();
    $time_since = $current_time - $unix_time;

    if($time_since < 3600) {
      // less than an hour:
      $time_since = floor($time_since / 60) . ' mins';
      if ($time_since == '1 mins') {
        $time_since = '1 min';
      }

    } elseif ($time_since < 86400) {
      // more than an hour, less than a whole day:
      $time_since = floor($time_since / 3600) . ' hrs';
      if($time_since == '1 hrs') {
        $time_since = '1 hr';
      }

    } elseif ($time_since >= 86400) {
      // more than a day:
      $time_since = date("M j", $unix_time) . ' at ' . date("g:i a", $unix_time);
    }
    return $time_since;
  }

  private function parse_headline($the_post) {

    // reverse the parts to walk backward thru the headline:
    $tags_reversed = array_reverse($the_post['story_tags']);
    $the_post_length = strlen($the_post['story']);
    $remaining_letters = $the_post['story'];
    $i = 0;

    foreach( $tags_reversed as $key => $story_tag ) {

      $leftover_length = strlen($remaining_letters) - ($story_tag['offset'] + $story_tag['length']);
      if($leftover_length > 0) {
        $headline[$i]['name'] = substr($remaining_letters, $story_tag['offset'] + $story_tag['length'],  $leftover_length);
        $headline[$i]['url'] = '';
        ++$i;
      }

      $headline[$i]['name'] = substr($remaining_letters, $story_tag['offset'], $story_tag['length']);
      if($story_tag['name'] == '') {
        $headline[$i]['url'] = $the_post['link'];
      } else {
        $headline[$i]['url'] = 'https://facebook.com/' . $story_tag['id'];
      }
      ++$i;

      $remaining_letters = substr( $remaining_letters, 0, $story_tag['offset'] );
    }

    $headline = array_reverse($headline);
    return $headline;
  }

  public function get_avatar($pageID) {
    $avatar_pic = $this->makeRequest($pageID, '/?fields=picture');
    return $avatar_pic->getDecodedBody();
  }

  private function find_all_posts_ids() {
    // ********************************************************
    // first AJAX call,
    // this finds the list of post ID's that we want displayed,
    // then we will come back for the rest soon after.
    // ********************************************************
    $args = "/posts?limit=". $this->config['post_limit'] ."&locale=en_US&fields=id";
    $response = $this->makeRequest($this->config['fb_page_ID'], $args);
    $decode = $response->getDecodedBody();

    return $decode['data'];

  }

  private function get_single_post($post_id) {
    // ********************************************************
    // Find the basics about a single post
    // from the array of posts that we are interested in
    // Once this is through we will scan it for any info that
    // we need based on it's specific type.
    // ********************************************************
    $args = '/?fields=id,from,message,message_tags,story,story_tags,link,source,name,caption,description,type,status_type,object_id,created_time';
    $response = $this->makeRequest($post_id, $args);

    $decode = $response->getDecodedBody();
    return $decode;
  }

  private function get_the_photo($the_post) {
    // sorts out the request for the photo, if the post is a shared photo:
    $photo = $this->makeRequest($the_post['object_id'], '/?fields=images,width,height,id');
    $photo = $photo->getDecodedBody($photo);

    foreach( $photo['images'] as $image){
      if($image['width'] == $photo['width']) {
        return $image;
      }
    }
    // there wasn't a match(?) so just take the first from the array:
    return $photo['images'][0];

  }
  private function get_the_video($the_post) {

    // I'm pulling the node ID from the "link" q... this feels very flimsy, but I don't have a better solution at this time:
    $vidID = explode('/', $the_post['link']);
    $vidID = $vidID[count($vidID) -2]; // its the last part of the link but has a trailing / so the explode array has a bunch of hooey in it.

    $video_stuff = $this->makeRequest($vidID, '/?fields=format');
    $video_stuff = $video_stuff->getDecodedBody();

    if(is_array($video_stuff)) {
      $video_stuff['format'] = $video_stuff['format'][count($video_stuff['format']) - 1];

      $video_stuff['iframe_src'] = $video_stuff['format']['embed_html'];
      $video_stuff['iframe_src'] = explode('"', $video_stuff['iframe_src'])[1]; // pulliing out just the source

      return $video_stuff;
    }

  }

  private function makeRequest($id, $args) {

    $this->fb = new Facebook\Facebook([
      'app_id' => $this->config['app_id'],
      'app_secret' => $this->config['app_secret'],
      'default_graph_version' => $this->config['default_graph_version'],
      'default_access_token' => $this->config['default_access_token'],
    ]);

    // Send the request to Graph
    try {
      $response = $this->fb->get($id . $args);

    } catch(Facebook\Exceptions\FacebookResponseException $e) {
      // When Graph returns an error
      echo 'Graph returned an error: ' . $e->getMessage();
      exit;

    } catch(Facebook\Exceptions\FacebookSDKException $e) {
      // When validation fails or other local issues
      echo 'Facebook SDK returned an error: ' . $e->getMessage();
      exit;
    }
    return $response;
  }

}

?>
