<html>
  <head>
    <link rel='stylesheet' href='/style.css?<?=rand()?>'/>
    <link rel='icon' href='/favicon.png'>
    <script type='text/javascript' src='script.js'></script>
    <script type='text/javascript' src='/jquery.min.js'></script>
    <title>E-Vote webadmin</title>
  </head>
  <body onload='loadVote();' onclick='hidePopups();'>
    <header>
      <nav class='dashboard'>
        <a href='address.php' class='btn'>Адреса</a>
        <a href='rival.php' class='btn'>Альтернативы</a>
        <a href='vote.php' class='btn active'>Голосования</a>
        <a href='people.php' class='btn'>Граждане</a>
      </nav>
    </header>
    <main>
      <nav>
        <a href='#' class='btn' onclick='loadVote();'>Обновить список</a>
        <a href='#' class='btn' onclick='showModalVote();'>Добавить</a>
      </nav>
      <table id='votes'>
        <tr><th>Название</th><th>Начало</th><th>Окончание</th><th>Кол-во отметок</th></tr>
      </table>
    </main>
    <footer>
      footer buttons
    </footer>

    <div class='modal'>
      <div class='header'>Голосование</div>
      <div class='body'>
        <label>Название: </label><input type='text' name='name' required id='voteName'/><br>
        <label>Начало: </label><input type='datetime-local' name='start' required id='voteStart' value='<?=date('Y-m-d\T08:00') ?>'/><br>
        <label>Окончание: </label><input type='datetime-local' name='stop' required id='voteStop' value='<?=date('Y-m-d\T20:00') ?>'/><br>
        <label>Кол-во отметок: </label><input type='number' min='1' name='max' required id='voteMax' value='1'/>
      </div>
      <div class='footer'><a href='#' class='btn' onclick='addVote();'>Сохранить</a><a href='#' class='btn' onclick='hide(this);'>Отмена</a></div>
    </div>

    <div id='contextMenu' class='context'></div>
  </body>
</html>