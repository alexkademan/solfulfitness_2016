<?php
/* -----------------------------------------------------------------------------
takes a unix time and returns a string that tells what time the post was first published.
----------------------------------------------------------------------------- */
function readableTime($unix_time) {
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

?>
