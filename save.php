<?php
  $name = $_POST['name'] . '.png';
  $data = $_POST['data'];

  $data = str_replace(' ', '+', $data);
  $data = substr($data, strpos($data, ",") + 1);
  $data = base64_decode($data);

  $f = fopen('img/' . $name, 'wb');
  fwrite($f, $data);
  fclose($f);