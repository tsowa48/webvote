var vBASE = 'https://genco.one';//10.0.0.100

function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  e.target.parentNode.style.top = (e.target.parentNode.offsetTop - pos2) + "px";
  e.target.parentNode.style.left = (e.target.parentNode.offsetLeft - pos1) + "px";
}

function closeDragElement() {
  document.onmouseup = null;
  document.onmousemove = null;
}

function hidePopups() {
  if(document.getElementsByClassName('context').length > 0)
    document.getElementsByClassName('context')[0].style.display = 'none';
  //if(document.getElementsByClassName('modal').length > 0)
    //document.getElementsByClassName('modal')[0].style.display = 'none';
}

function hide(t) {
  t.parentNode.parentNode.style.display = 'none';
  $(t.parentNode.parentNode).find(':input').val('');
  document.body.removeChild(document.getElementsByClassName('shield')[0]);
}

function loadAddress(t, bCheck) {
  hidePopups();
  var aid = t.parentNode.getAttribute('aid');
  $.ajax({
    url: vBASE + '/address?parent=' + aid,
    dataType: 'json',
    success: function(data, status, xhr) {
      if(data.length > 0) {
        var parent = t.parentNode;
        if(parent.innerHTML.indexOf('<ul>') > 0)
          parent.innerHTML = parent.innerHTML.substr(0, parent.innerHTML.indexOf('<ul>'));
        var d = '<ul>';
        for(var i = 0; i < data.length; ++i) {
          d += "<li class='child' aid=" + data[i].id + "><a href='#' onclick='loadAddress(this, " + bCheck + ");' " +
                (!bCheck ? "oncontextmenu='contextAddress(this);return false;'" : "") + ">" +
                (bCheck ? "<input type='checkbox' onchange='saveCheck(this);'>" + data[i].name + "</input>" : data[i].name) + "</a></li>";
        }
        d += '</ul>';
        parent.innerHTML += d;
      }
    },
    type: 'get',
    crossDomain: true
  });
  return false;
}

function saveCheck(t) {
  hidePopups();
  if(t.checked) {
    var aid = t.parentNode.parentNode.getAttribute('aid');
    document.getElementsByName('aid')[0].value = aid;
    var x = document.getElementsByClassName('tree')[0].querySelectorAll('input[type=checkbox]');
    for (var i = 0; i < x.length; i++) {
      if(t === x[i])
        continue;
      x[i].checked = false;
    }
  }
}

function contextAddress(t) {
  var aid = t.parentNode.getAttribute('aid');
  var menu = document.getElementById('contextMenu');
    
  menu.innerHTML = ("<a href='#' onclick='addAddress(this);return false;' id='add' aid='" + aid + "'>Добавить</a>");
  menu.innerHTML += ("<a href='#' onclick='addAddressGPS(this);return false;' id='addgps' aid='" + aid + "'>Добавить с GPS</a>");
  menu.innerHTML += ("<a href='#' onclick='removeAddress(this);return false;' id='remove' aid='" + aid + "'>Удалить</a>");
  //menu.innerHTML += ("<hr>");
  //menu.innerHTML += ("<a href='#' onclick='alert('ROOT');hidePopups();return false;' id='setroot' aid='" + aid + "'>Set as root</a>");

  menu.style.display = 'block';
  menu.style.left = window.event.pageX;
  menu.style.top = window.event.pageY;
  menu.style.clientX = window.event.clientX;
  menu.style.clientY = window.event.clientY;
}

function addAddress(t) {
  hidePopups();
  var aid = t.getAttribute('aid');
  var x = parseInt(document.getElementById('contextMenu').style.clientX);
  var y = parseInt(document.getElementById('contextMenu').style.clientY);
  var parent = document.elementFromPoint(x, y).parentNode;

  var name = prompt('Название:');
  if(name === null)
    return false;
  $.ajax({
    url: vBASE + '/address',
    data: 'name=' + encodeURI(name) + '&parent=' + aid,
    success: function(data, status, xhr) {
      var el = "<li class='child' aid=" + data[0].id + "><a href='#' onclick='loadAddress(this, false);' oncontextmenu='contextAddress(this);return false;'>" + data[0].name + "</a></li>";
      if(parent.innerHTML.indexOf('<ul>') > 0)
        parent.innerHTML = parent.innerHTML.replace('</ul>', el + '</ul>');
      else
        parent.innerHTML += '<ul>' + el + '</ul>';
    },
    type: 'post',
    crossDomain: true
  });
}

function removeAddress(t) {
  hidePopups();
  var aid = t.getAttribute('aid');
  var x = parseInt(document.getElementById('contextMenu').style.clientX);
  var y = parseInt(document.getElementById('contextMenu').style.clientY);
  var parent = document.elementFromPoint(x, y).parentNode;
  $.ajax({
    url: vBASE + '/address',
    data: 'id=' + aid,
    method: 'delete',
    crossDomain: true,
    error: function (jqXHR, exception) {
      if(jqXHR.status === 404)
        parent.parentNode.removeChild(parent);
    }
  });
}

function addAddressGPS(t) {
  hidePopups();
  var aid = t.getAttribute('aid');
  var x = parseInt(document.getElementById('contextMenu').style.clientX);
  var y = parseInt(document.getElementById('contextMenu').style.clientY);
  var parent = document.elementFromPoint(x, y);
  var _parent = parent.parentNode;
  var fullAddress = parent.innerText;
  var _aid = aid;
  while(_aid > 0) {
    parent = parent.parentNode.parentNode;
    var _t = parent.parentNode.childNodes[0].innerText;
    if(_t === undefined)
      break;
    fullAddress = _t + ', ' + fullAddress;
    _aid = parent.parentNode.getAttribute('aid');
  }
  var name = prompt('Название:');
  if(name === null)
    return false;
  fullAddress += ', ' + name;
  $.ajax({
    url: 'https://geocode-maps.yandex.ru/1.x/?geocode=' + encodeURI(fullAddress) + '&kind=house&format=json',
    success: function(data, status, xhr) {
      var _x = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
      var lon = parseFloat(_x.split(' ')[0]);
      var lat = parseFloat(_x.split(' ')[1]);

      $.ajax({
        url: vBASE + '/address',
        data: 'name=' + encodeURI(name) + '&parent=' + aid + '&lon=' + lon + '&lat=' + lat,
        success: function(data, status, xhr) {
          var el = "<li class='child' aid=" + data[0].id + "><a href='#' onclick='loadAddress(this, false);' oncontextmenu='contextAddress(this);return false;'>" + data[0].name + "</a></li>";
          if(_parent.innerHTML.indexOf('<ul>') > 0)
            _parent.innerHTML = _parent.innerHTML.replace('</ul>', el + '</ul>');
          else
            _parent.innerHTML += '<ul>' + el + '</ul>';
        },
        type: 'post',
        crossDomain: true
      });

    },
    type: 'get',
    crossDomain: true
  });
}

function loadVote() {
  $.ajax({
    url: vBASE + '/vote',
    dataType: 'json',
    success: function(data, status, xhr) {
      if(data.length > 0) {
        var d = '<tr><th>Название</th><th>Начало</th><th>Окончание</th><th>Кол-во отметок</th></tr>';
        for(var i = 0; i < data.length; ++i) {
          var _start = new Date(data[i].start * 1000);
          var _stop = new Date(data[i].stop * 1000);
          _start = _start.getUTCHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ':' +
            _start.getUTCMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '&nbsp;' +
            _start.getUTCDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '.' +
            (_start.getUTCMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '.' + _start.getUTCFullYear();
          _stop = _stop.getUTCHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ':' +
            _stop.getUTCMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '&nbsp;' +
            _stop.getUTCDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '.' +
            (_stop.getUTCMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '.' + _stop.getUTCFullYear();
          d += '<tr oncontextmenu="contextVote(this);return false;" vid=' + data[i].id + '><td>' + data[i].name + '</td><td>' + _start + '</td><td>' + _stop + '</td><td style="text-align:center;">' + data[i].max + '</td></tr>';
        }
        document.getElementById('votes').innerHTML = d;
      }
    },
    type: 'get',
    crossDomain: true
  });
  return false;
}

function addVote() {
  var voteName = document.getElementById('voteName').value;
  var voteStart = document.getElementById('voteStart').value + 'Z';
  var voteStop = document.getElementById('voteStop').value + 'Z';
  var voteMax = document.getElementById('voteMax').value;
  if(voteName === '' || voteStart === '' || voteStop === '' || voteMax === '')
    return false;
  voteStart = new Date(voteStart).getTime() / 1000;
  voteStop = new Date(voteStop).getTime() / 1000;
  document.getElementsByClassName('modal')[0].style.display = 'none';
  document.body.removeChild(document.getElementsByClassName('shield')[0]);

  $.ajax({
    url: vBASE + '/vote',
    data: 'name=' + encodeURI(voteName) + '&start=' + voteStart + '&stop=' + voteStop + '&max=' + voteMax,
    success: function(data, status, xhr) {
      if(data.length > 0) {
        var d = '<tr oncontextmenu="contextVote(this);return false;" vid=' + data[0].id + '><td>' + voteName + '</td><td>' + voteStart + '</td><td>' + voteStop + '</td><td style="text-align:center;">' + voteMax + '</td></tr>';
        document.getElementById('votes').innerHTML += d;
      }
    },
    type: 'post',
    crossDomain: true
  });
}

function editVote(t) {
  //TODO: implement editing vote
  alert(t.getAttribute('vid'));
}

function removeVote(t) {
  hidePopups();

  var menu = document.getElementById('contextMenu');
  var x = parseInt(menu.style.clientX);
  var y = parseInt(menu.style.clientY);
  var parent = document.elementFromPoint(x, y).parentNode;
  var rid = parent.getAttribute('vid');
  $.ajax({
    url: vBASE + '/vote',
    data: 'id=' + rid,
    method: 'delete',
    crossDomain: true,
    error: function (jqXHR, exception) {
      if(jqXHR.status === 404)
        parent.parentNode.removeChild(parent);
    }
  });
}

function showModalVote() {
  var shield = document.createElement('div');
  shield.classList.add('shield');
  document.body.appendChild(shield);
  var modal = document.getElementsByClassName('modal')[0];
  modal.style.display = 'block';
  modal.getElementsByClassName('header')[0].onmousedown = dragMouseDown;
}

function showModalPeople() {
  var shield = document.createElement('div');
  shield.classList.add('shield');
  document.body.appendChild(shield);
  var modal = document.getElementsByClassName('modal')[0];
  modal.style.display = 'block';
  modal.getElementsByClassName('tree')[0].style.height = '300px';//<------------------------------ tree HEIGHT
  modal.getElementsByClassName('header')[0].onmousedown = dragMouseDown;
}

function showModalRival() {
  var shield = document.createElement('div');
  shield.classList.add('shield');
  document.body.appendChild(shield);
  var modal = document.getElementsByClassName('modal')[0];
  modal.style.display = 'block';
  modal.getElementsByClassName('header')[0].onmousedown = dragMouseDown;

  var rivalVid = document.getElementById('rivalVid');
  $.ajax({
    url: vBASE + '/vote',//TODO: получить список БУДУЩИХ голосований
    dataType: 'json',
    success: function(data, status, xhr) {
      if(data.length > 0) {
        var d = '';
        for(var i = 0; i < data.length; ++i) {
          d += "<option value=" + data[i].id + ">" + data[i].name + "</option>";
        }
        rivalVid.innerHTML = d;
      }
    },
    type: 'get',
    crossDomain: true
  });
}

function contextVote(t) {
  var menu = document.getElementById('contextMenu');
  menu.innerHTML = ("<a href='#' onclick='editVote(this);return false;' id='edit'>Редактировать</a>");
  menu.innerHTML += ("<a href='#' onclick='removeVote(this);return false;' id='remove'>Удалить</a>");

  menu.style.display = 'block';
  menu.style.left = window.event.pageX;
  menu.style.top = window.event.pageY;
  menu.style.clientX = window.event.clientX;
  menu.style.clientY = window.event.clientY;
}

function loadRival() {
  $.ajax({
    url: vBASE + '/rival',
    success: function(data, status, xhr) {
      if(data.length > 0) {
        for(var i = 0; i < data.length; ++i) {
          var _x = data[i];
          $.ajax({
            url: vBASE + '/vote?id=' + _x.vid,
            dataType: 'json',
            async: false,
            success: function(data1, status, xhr) {
              var voteName = _x.vid;
              if(data1.length > 0)
                voteName = data1[0].name;
              var d = '<tr oncontextmenu="contextRival(this);return false;" rid="' + _x.id + '"><td>' + _x.name + '</td><td>' + _x.description + '</td><td>' + voteName + '</td><td>' + _x.position + '</td></tr>';
              document.getElementById('rivals').innerHTML += d;
            },
            type: 'get',
            crossDomain: true
          });
        }
      }
    },
    type: 'get',
    crossDomain: true
  });
}

function loadPeople() {
  $.ajax({
    url: vBASE + '/people',
    success: function(data, status, xhr) {
      document.getElementById('peoples').innerHTML = '<tr><th>ФИО</th><th>Дата рождения</th><th>Пол</th><th>Адрес</th></tr>';
      if(data.length > 0) {
        for(var i = 0; i < data.length; ++i) {
          var _x = data[i];
          $.ajax({
            url: vBASE + '/address?full=1&id=' + _x.aid,
            dataType: 'json',
            async: false,
            success: function(data1, status, xhr) {
              var fullAddress = _x.aid;
              if(data1.length > 0) {
                fullAddress = '';
                for(var j = 0; j < data1.length; ++j)
                  fullAddress = data1[j].name + ', ' + fullAddress;
                fullAddress = fullAddress.substr(0, fullAddress.length - 2);
              }
              var d = '<tr oncontextmenu="contextPeople(this);return false;" pid="' + _x.id + '"><td>' + _x.fio + '</td><td>' + _x.birth + '</td><td>' + (parseInt(_x.male) === 1 ? 'Мужской' : 'Женский') + '</td><td>' + fullAddress + '</td></tr>';
              document.getElementById('peoples').innerHTML += d;
            },
            type: 'get',
            crossDomain: true
          });
        }
      }
    },
    type: 'get',
    crossDomain: true
  });
}

function contextPeople(t) {
  var menu = document.getElementById('contextMenu');
  menu.innerHTML = ("<a href='#' onclick='editPeople(this);return false;' id='edit'>Редактировать</a>");
  menu.innerHTML += ("<a href='#' onclick='removePeople(this);return false;' id='remove'>Удалить</a>");

  menu.style.display = 'block';
  menu.style.left = window.event.pageX;
  menu.style.top = window.event.pageY;
  menu.style.clientX = window.event.clientX;
  menu.style.clientY = window.event.clientY;
}

function removePeople(t) {
  hidePopups();

  var menu = document.getElementById('contextMenu');
  var x = parseInt(menu.style.clientX);
  var y = parseInt(menu.style.clientY);
  var parent = document.elementFromPoint(x, y).parentNode;
  var pid = parent.getAttribute('pid');
  $.ajax({
    url: vBASE + '/people',
    data: 'id=' + pid,
    method: 'delete',
    crossDomain: true,
    error: function (jqXHR, exception) {
      if(jqXHR.status === 404)
        parent.parentNode.removeChild(parent);
    }
  });
}

function addPeople() {
  var peopleFio = document.getElementById('peopleFio').value;
  var peopleBirth = document.getElementById('peopleBirth').value;
  var peopleSex = document.getElementById('peopleSex').value;
  var peopleAid = document.getElementById('peopleAid').value;

  if(peopleFio === null || peopleBirth === null || peopleSex === null || peopleAid === null)
    return false;
  peopleBirth = new Date(peopleBirth);
  peopleBirth = peopleBirth.getUTCDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '.' +
                peopleBirth.getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '.' +
                peopleBirth.getFullYear().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  document.getElementsByClassName('modal')[0].style.display = 'none';
  document.body.removeChild(document.getElementsByClassName('shield')[0]);

  $.ajax({
    url: vBASE + '/people',
    data: 'fio=' + encodeURI(peopleFio) + '&birth=' + peopleBirth + '&male=' + peopleSex + '&aid=' + peopleAid,
    success: function(data, status, xhr) {
      var _x = data[0];
      $.ajax({
        url: vBASE + '/address?full=1&id=' + _x.aid,
        dataType: 'json',
        async: false,
        success: function(data1, status, xhr) {
          var fullAddress = _x.aid;
          if(data1.length > 0) {
            fullAddress = '';
            for(var j = 0; j < data1.length; ++j)
              fullAddress = data1[j].name + ', ' + fullAddress;
            fullAddress = fullAddress.substr(0, fullAddress.length - 2);
          }
          var d = '<tr oncontextmenu="contextPeople(this);return false;" pid="' + _x.id + '"><td>' + _x.fio + '</td><td>' + _x.birth + '</td><td>' + (parseInt(_x.male) === 1 ? 'Мужской' : 'Женский') + '</td><td>' + fullAddress + '</td></tr>';
          document.getElementById('peoples').innerHTML += d;
        },
        type: 'get',
        crossDomain: true
      });
    },
    type: 'post',
    crossDomain: true
  });
}

function addRival() {
  var rivalName = document.getElementById('rivalName').value;
  var rivalDescription = document.getElementById('rivalDescription').value;
  var rivalVid = document.getElementById('rivalVid').value;

  if(rivalName === null || rivalDescription === null || rivalVid === null)
    return false;
  document.getElementsByClassName('modal')[0].style.display = 'none';
  document.body.removeChild(document.getElementsByClassName('shield')[0]);
  $.ajax({
    url: vBASE + '/rival',
    data: 'name=' + encodeURI(rivalName) + '&description=' + encodeURI(rivalDescription) + '&vid=' + rivalVid + '&position=0',
    success: function(data, status, xhr) {
      var d = '<tr oncontextmenu="contextRival(this);return false;" rid=' + data[0].id + '><td>' + data[0].name + '</td><td>' + data[0].description + '</td><td>' + data[0].vid + '</td><td>' + data[0].position + '</td></tr>';
      document.getElementById('rivals').innerHTML += d;
    },
    type: 'post',
    crossDomain: true
  });
}

function contextRival(t) {
  var menu = document.getElementById('contextMenu');
  menu.innerHTML = ("<a href='#' onclick='editRival(this);return false;' id='edit'>Редактировать</a>");
  menu.innerHTML += ("<a href='#' onclick='removeRival(this);return false;' id='remove'>Удалить</a>");

  menu.style.display = 'block';
  menu.style.left = window.event.pageX;
  menu.style.top = window.event.pageY;
  menu.style.clientX = window.event.clientX;
  menu.style.clientY = window.event.clientY;
}

function removeRival(t) {
  hidePopups();

  var menu = document.getElementById('contextMenu');
  var x = parseInt(menu.style.clientX);
  var y = parseInt(menu.style.clientY);
  var parent = document.elementFromPoint(x, y).parentNode;
  var rid = parent.getAttribute('rid');
  $.ajax({
    url: vBASE + '/rival',
    data: 'id=' + rid,
    method: 'delete',
    crossDomain: true,
    error: function (jqXHR, exception) {
      if(jqXHR.status === 404)
        parent.parentNode.removeChild(parent);
    }
  });
}

function editRival(t) {
  var rid = t.getAttribute('rid');
  alert(rid);

  //TODO: edit rival
}



//+loadAddress
//+contextAddress
  //+addAddress
  //+addAddressGPS
  //editAddress (rename only)
  //+removeAddress
//showModal Address ??????? (promt)

//+loadVote
//+addVote <------------------------------------- +ADRESS
//+contextVote
  //editVote
  //+removeVote
//+showModalVote

//+loadRival
//+addRival
//+contextRival
  //editRival
  //+removeRival
//+showModalRival


//+loadPeople
//+addPeople
//+contextPeople
  //editPeople
  //+removePeople
//+showModalPeople

//POLL ????