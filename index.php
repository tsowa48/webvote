<html>
  <head>
    <link rel='stylesheet' href='/style.css'/>
    <link rel='icon' href='/favicon.png'>
    <script type='text/javascript'>
    function getGPS() {
      var lon;
	    var lat;
	    navigator.geolocation.getCurrentPosition(function(position) {
	      lat = position.coords.latitude;
		    lon = position.coords.longitude;
      });
      console.log('lon=' + lon + ' lat=' + lat);
    }
    </script>
    <title>E-Vote</title>
  </head>
  <body onload='getGPS();'>
    <header>
      <nav class='dashboard'>
        <a href='/admin/' class='btn'>Admin</a>
      </nav>
    </header>
    <main>
      TODO:<br>
      1. get GPS<br>
      2. get Secret<br>
      3. get votes by GPS<br>
      4. show votes<br>
        4.1. select vote<br>
          4.1.1. load rivals<br>
          4.1.2. show rivals<br>
        4.2. do vote<br>
        4.3. show result<br>
    </main>
    <footer>footer</footer>
  </body>
</html>