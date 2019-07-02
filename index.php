<?php ?><html>
  <head>
		<meta name='viewport' content='width=device-width, initial-scale=1'>
		<link rel='icon' href='/favicon.png'>
  	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
		<script type='text/javascript' src='/jquery.min.js'></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <title>E-Vote</title>
  </head>
<?php
  $vid = $_GET['vid'];
  $correctVID = isset($vid) && is_numeric($vid) && !is_null($vid);
  echo '<body class=\'container\'>';
  if(!$correctVID) {
    echo '<header class="text-center">Доступные голосования:</header>';
  } else {
    echo '<header class="text-center"><b id="voteName"></b><br><span id="publicKey">[PublicKey]</span></header>';
  }
  echo '<main><div class=\'list-group\' id=\'';
  if(!$correctVID) { echo 'votes'; } else { echo 'rivals'; }
  echo '\'></div></main>';
  if(!$correctVID) { echo '<footer>Адрес: <b><span id=\'address\'></span></b></footer>'; }
  else { echo '<div id="wait" class="modal fade" role="dialog"><div class="modal-dialog modal-sm"><div class="modal-content text-center" style="padding: 10px;">Ваш голос будет учтен через <b><span id="timer"></span></b> секунд<br><br><button type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Отмена</button></div></div></div>'; } // <--------------------- MODAL
  echo '</body>';
  if(!$correctVID) {
?>

  <script type='text/javascript'>
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
                $('#address').text(fullAddress);
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
					$('#votes').text('');
          if(data.length === 0) {
            $('#votes').text('По Вашему адресу нет доступных голосований');
            return;
          }
					for(var i = 0; i < data.length; ++i) {
            start = new Date(data[i].start * 1000);
            stop = new Date(data[i].stop * 1000);
            start = start.getUTCHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ':' +
            start.getUTCMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '&nbsp;' +
            start.getUTCDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '.' +
            (start.getUTCMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '.' + start.getUTCFullYear();
            stop = stop.getUTCHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ':' +
            stop.getUTCMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '&nbsp;' +
            stop.getUTCDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '.' +
            (stop.getUTCMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '.' + stop.getUTCFullYear();
            $('#votes').append('<a href=\'?vid=' + data[i].id + '\' class=\'list-group-item list-group-item-action\'>' + data[i].name + ' <br><span class="label label-primary">' + start + ' - ' + stop + '</span></a>');
					}
				},
				type: 'get',
				crossDomain: true
			});
		}
  </script>

<?php
} else { // Load Rivals ?>

  <script type='text/javascript'>
    var vBASE = 'https://genco.one:5432';
    var maxSelected = 1;

    $(document).ready(function() {
			$.ajax({
        url: vBASE + '/rival?vid=<?=$vid ?>',
				dataType: 'json',
				success: function(data, status, xhr) {
					$('#rivals').text('');
          if(data.length === 0) {
            $('#rivals').text('нет альтернатив');// <--------------- Если попадает сюда, то произошла ошибка
            return;
          }

          $.ajax({ url: vBASE + '/vote?id=' + data[0].vid, dataType: 'json', type: 'get', crossDomain: true, success: function(d, s, x) { $('#voteName').text(d[0].name); maxSelected = d[0].max; } });

				  for(var i = 0; i < data.length; ++i) {
            // {id: 1, name: "ФИО", description: "Длинное описание", position: 0, vid: 2}
             $('#rivals').append('<div style="cursor:pointer;" class=\'list-group-item list-group-item-action\' rid=' + data[i].id + ' onclick="setactive(this)"><b>' + data[i].name +
                                 '</b><br><div style="font-size:9pt;">' + data[i].description + '</div></div>');
				  }
				},
				type: 'get',
				crossDomain: true
			});
    });

    function setactive(t) {
      var rivalCount = $('.list-group-item-action.active').size();
      if(maxSelected === rivalCount) { // && !$(t).hasClass('active')) {
        setTimeout(function() {
          $('#wait').modal('show');
        }, 300);
        $('#timer').text(10);//10 seconds

        var _Seconds = $('#timer').text();
        var interval = setInterval(function() {
        if (_Seconds > 0) {
          _Seconds--;
          $('#timer').text(_Seconds);
          if(!$('#wait').is(':visible')) {
            $('.list-group-item-action').removeClass('active');
            clearInterval(interval);
          }
        } else {
          clearInterval(interval);
          $('#wait').modal('hide');
          //DO /poll

          alert('TA-DA! Your vote is polled');//DEBUG
          $('.list-group-item-action').removeClass('active');//DEBUG ???
        }
        }, 1000);
      } else {
        $(t).toggleClass('active');
        setactive(null);
      }
    }
  </script>

<?php }
echo '</html>';
?>