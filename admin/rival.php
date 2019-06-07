<html>
  <head>
    <link rel='stylesheet' href='/style.css?<?=rand()?>'/>
    <link rel='icon' href='/favicon.png'>
    <script type='text/javascript' src='script.js'></script>
    <script type='text/javascript' src='/jquery.min.js'></script>
    <title>E-Vote webadmin</title>
  </head>
  <body onload='loadRival();' onclick='hidePopups();'>
    <header>
      <nav class='dashboard'>
        <a href='address.php' class='btn'>Адреса</a>
        <a href='rival.php' class='btn active'>Альтернативы</a>
        <a href='vote.php' class='btn'>Голосования</a>
        <a href='people.php' class='btn'>Граждане</a>
      </nav>
    </header>
    <main>
      <nav>
        <a href='#' class='btn' onclick='showModalRival();'>Добавить</a>
      </nav>
      <table id='rivals'>
        <tr><th>Название</th><th>Описание</th><th>Голосование</th><th>Позиция</th></tr>
      </table>
    </main>
    <footer>
      footer buttons
    </footer>

    
    <div class='modal'>
      <div class='header'>Альтернатива</div>
      <div class='body'>
        <label>Название: </label><input type='text' name='name' required id='rivalName'/><br>
        <label>Описание: </label><textarea name='description' required id='rivalDescription'></textarea><br>
        <label>Голосование: </label><select name='vid' id='rivalVid' required></select>
      </div>
      <div class='footer'><a href='#' class='btn' onclick='addRival();'>Сохранить</a><a href='#' class='btn' onclick='hide(this);'>Отмена</a></div>
    </div>

    <div id='contextMenu' class='context'></div>

  </body>
</html>