<html>
  <head>
    <link rel='stylesheet' href='/style.css?<?=rand()?>'/>
    <link rel='icon' href='/favicon.png'>
    <script type='text/javascript' src='script.js'></script>
    <script type='text/javascript' src='/jquery.min.js'></script>
    <title>E-Vote webadmin</title>
  </head>
  <body onclick='hidePopups();'>
    <header>
      <nav class='dashboard'>
        <a href='address.php' class='btn'>Адреса</a>
        <a href='rival.php' class='btn'>Альтернативы</a>
        <a href='vote.php' class='btn'>Голосования</a>
        <a href='people.php' class='btn active'>Граждане</a>
      </nav>
    </header>
    <main>
      <nav>
        <a href='#' class='btn' onclick='loadPeople();'>Обновить список</a>
        <a href='#' class='btn' onclick='showModalPeople();'>Добавить</a>
      </nav>
      <table id='peoples'>
        <tr><th>ФИО</th><th>Дата рождения</th><th>Пол</th><th>Адрес</th></tr>
      </table>
    </main>
    <footer>
      footer buttons
    </footer>

    
    <div class='modal'>
      <div class='header'>Гражданин</div>
      <div class='body'>
        <label>ФИО: </label><input type='text' name='fio' required id='peopleFio'/><br>
        <label>Дата рождения: </label><input type='date' name='birth' required id='peopleBirth' value='<?=date('Y-m-d') ?>'/><br>
        <label>Пол: </label><select name='sex' required id='peopleSex' value='1'><option value='1'>Мужской</option><option value='0'>Женский</option></select><br>
        <input type='hidden' id='peopleAid' name='aid' />
        <div class='tree'><ul>
          <li class='root' aid=0>
            <a href='#' onclick='loadAddress(this, true);'>Страны</a>
          </li>
        </ul></div>
      </div>
      <div class='footer'><a href='#' class='btn' onclick='addPeople();'>Сохранить</a><a href='#' class='btn' onclick='hide(this);'>Отмена</a></div>
    </div>

    <div id='contextMenu' class='context'></div>

  </body>
</html>