<?php

header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 6 Jul 2001 05:00:00 GMT"); // Date in the past

$artist = $_SERVER['QUERY_STRING'];

include __DIR__ . '/assets/' . $artist . '/texts.php';
?>

<!doctype html>
<html ⚡>
  <head>
    <meta charset="utf-8">
    <title>Hiphop & Rap</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
    <link rel="manifest" href="/manifest.json">
    <link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#5bbad5">
    <link rel="shortcut icon" href="/images/favicon.ico">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-config" content="/images/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">
    <link rel="canonical" href=rapper.php">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-video" src="https://cdn.ampproject.org/v0/amp-video-0.1.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Oswald:200,300,400" rel="stylesheet">
    <style amp-custom>
      amp-story {
        font-family: 'Oswald',sans-serif;
        color: #fff;
      }
      amp-story-page {
        background-color: #000;
      }
      h1 {
        font-weight: bold;
        font-size: 2.875em;
        font-weight: normal;
        line-height: 1.174;
        text-shadow: 3px 3px 3px black;
      }
      h2 {
        font-weight: bold;
        font-size: 1,8em;
        font-weight: normal;
        line-height: 0.4;
        text-shadow: 2px 2px 2px black;
      }
      p {
        font-weight: normal;
        font-size: 1.3em;
        line-height: 1.5em;
        color: #fff;
        text-shadow: 1px 1px 1px black;
      }
      li {
        font-weight: normal;
        font-size: 1.3em;
        line-height: 1.5em;
        color: #fff;
        text-shadow: 1px 1px 1px black;
      }
      q {
        font-weight: 300;
        font-size: 1.1em;
      }
      amp-story-grid-layer.bottom {
        align-content:end;
      }
      amp-story-grid-layer.noedge {
        padding: 0px;
      }
      amp-story-grid-layer.center-text {
        align-content: center;
      }
      .wrapper {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 50% 50%;
      }
      .banner-text {
        text-align: center;
        background-color: #000;
        line-height: 2em;
      }
      .source {
        font-size: 0.8em;
      }
    </style>
    <script async custom-element="amp-story"
    src="https://cdn.ampproject.org/v0/amp-story-0.1.js"></script>
  </head>
  <body>
    <amp-story standalone bookend-config-src="bookend.json.php">
      <amp-story-page id="cover">
        <amp-story-grid-layer template="fill">
          <amp-img src="assets/<?php echo $artist ?>/cover.jpg" width="720" height="1280" layout="responsive">
          </amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical">
          <h1><?php echo $cover_artistname ?></h1>
          <h2><?php echo $cover_realname ?></h2>
          <p><?php echo $cover_lifespan ?></p>
          <p>By <?php echo $author ?></p>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <p class="source">
            Photo: <?php echo $cover_photosource ?>
          </p>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="life">
        <amp-story-grid-layer template="fill">
          <amp-img src="assets/<?php echo $artist ?>/life.jpg" width="720" height="1280" layout="responsive">
          </amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical">
          <h1>Life</h1>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <p><?php echo $life_text ?></p>
          <p class="source">
            Text: <?php echo $life_textsource ?>, 
            Photo: <?php echo $life_photosource ?>
          </p>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="hit">
        <amp-story-grid-layer template="fill">
          <amp-video autoplay loop width="720" height="1280" layout="responsive" poster="images/black.png">
            <source src="assets/<?php echo $artist ?>/hit.mp4" type="video/mp4">
          </amp-video>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical">
          <h1><?php echo $hit_title ?></h1>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <p><?php echo $hit_text ?></p>
          <p class="source">
            Text: <?php echo $hit_textsource ?>, 
            Video: <?php echo $hit_videosource ?>
          </p>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="facts">
        <amp-story-grid-layer template="fill">
          <amp-img src="assets/<?php echo $artist ?>/facts.jpg" width="720" height="1280" layout="responsive">
          </amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical">
          <h1>Facts</h1>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <p class="source">
          <ul>
          <li><?php echo $facts1 ?></li>
          <li><?php echo $facts2 ?></li>
          <li><?php echo $facts3 ?></li>
    </ul>
    </p>
    <p class="source">
            Text: <?php echo $facts_textsource ?>, 
            Photo: <?php echo $facts_photosource ?>
          </p>
        </amp-story-grid-layer>
      </amp-story-page>      
    </amp-story>
  </body>
</html>
