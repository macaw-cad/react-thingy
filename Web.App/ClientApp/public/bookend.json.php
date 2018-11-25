<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 6 Jul 2001 05:00:00 GMT"); // Date in the past
?>

{
  "share-providers": {
    "email": true,
    "twitter": true,
    "tumblr": true,
    "facebook": {
      "app_id": "254325784911610"
    }
  },
  "related-articles": {
    "Hiphop & Rap - the stories": [
      {
        "title": "Big L",
        "url": "rapper.php?big_l",
        "image": "assets/big_l/bookend.jpg"
       },      
      {
        "title": "Biggie Smalls",
        "url": "rapper.php?biggie_smalls",
        "image": "assets/biggie_smalls/bookend.jpg"
       },      
       {
        "title": "Tupac Shakur",
        "url": "rapper.php?tupac",
        "image": "assets/tupac/bookend.jpg"
       },
      {
        "title": "Ice Cube",
        "url": "rapper.php?ice_cube",
        "image": "assets/ice_cube/bookend.jpg"
      },
      {
        "title": "Snoop Dogg",
        "url": "rapper.php?snoop_dogg",
        "image": "assets/snoop_dogg/bookend.jpg"
      }
    ]
  }
}