var vBASE = 'https://genco.one:5432';

    $(document).ready(function() {
			if(navigator && navigator.geolocation) {
	  		navigator.geolocation.getCurrentPosition(function(position) {
		    	var lat = position.coords.latitude;
					var lon = position.coords.longitude;
					$.ajax({
						url: vBASE + '/address?full=1&lon=' + lon + '&lat=' + lat,
						dataType: 'json',
						success: function(data, status, xhr) {
							if(data.length > 0) {
								fullAddress = '';
								for(var i = 0; i < data.length; ++i)
									fullAddress = data[i].name + ', ' + fullAddress;
								fullAddress = fullAddress.substr(0, fullAddress.length - 2);
								var secret = prompt('Контрольное слово:');
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
					document.getElementById('votes').innerHTML = '';
          document.cookie = ("secret=" + encodeURI(secret) + ";"); //<----------------------------
          if(data.length === 0) {
            document.getElementById('votes').innerHTML = 'Для Вас нет голосований';
            return;
          }
					for(var i = 0; i < data.length; ++i) {
            var vote = ("<li class='vote' onclick=\"document.cookie=('vid=" + data[i].id + ";');alert(document.cookie);\">" + data[i].name + "</li>");
            //COOKIE - BAD IDEA <--------------------------------------------------------------
            document.getElementById('votes').innerHTML += vote;
					}
				},
				type: 'get',
				crossDomain: true
			});
		}