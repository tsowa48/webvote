<html>
  <head>
		<meta name='viewport' content='width=device-width, initial-scale=1'>
		<link rel='icon' href='/favicon.png'>
  	<link rel='stylesheet' href='/style.css'/>
		<script type='text/javascript' src='/jquery.min.js'></script>
  	<script type='text/javascript'>
		  var vBASE = 'https://genco.one:5432';

    $(document).ready(function() {
			if(navigator && navigator.geolocation) {
	  		navigator.geolocation.getCurrentPosition(function(position) {
		    	var lat = position.coords.latitude;
					var lon = position.coords.longitude;
					document.getElementById('gps').innerText = 'lat=' + lat + ' lon=' + lon;
					$.ajax({
						url: vBASE + '/address?full=1&lon=' + lon + '&lat=' + lat,
						dataType: 'json',
						success: function(data, status, xhr) {
							if(data.length > 0) {
								fullAddress = '';
								for(var i = 0; i < data.length; ++i)
									fullAddress = data[i].name + ', ' + fullAddress;
								fullAddress = fullAddress.substr(0, fullAddress.length - 2);
								
								document.getElementById('nearaddr').innerText = fullAddress;//DEBUG

								var secret = prompt('Секрет:');
								document.getElementById('secret').innerText = encodeURI(secret);

								getVotes(lon, lat, secret);
							}
						},
						type: 'get',
						crossDomain: true
					});
				}, function(){alert('Включите GPS и обновите страницу');}, { timeout: 3000, enableHighAccuracy: true });
			} else {
				alert('Устройство не поддерживает функции геолокации');
			}
		});

		function getVotes(lon, lat, secret) {
			$.ajax({
				url: vBASE + '/vote?lon=' + lon + '&lat=' + lat + '&secret=' + encodeURI(secret),
				dataType: 'json',
				success: function(data, status, xhr) {
					//if(data.length > 0) {
						//for(var i = 0; i < data.length; ++i) {
							document.getElementById('votes').innerText = 'Найдено голосований: ' + data.length;
						//}
					//}
				},
				type: 'get',
				crossDomain: true
			});
		}
    </script>
    <title>E-Vote</title>
  </head>
  <body>
    <header>
      <nav class='dashboard'>

      </nav>
    </header>
    <main>
      TODO:<br>
      1. get GPS [<span id='gps'></span>]<br>
			1.1d. get near address [<span id='nearaddr'></span>]<br>
      2. get Secret [<span id='secret'></span>]<br>
      3. get votes by GPS [<span id='votes'></span>]<br>
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