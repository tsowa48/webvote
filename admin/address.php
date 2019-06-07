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
        <a href='address.php' class='btn active'>Адреса</a>
        <a href='rival.php' class='btn'>Альтернативы</a>
        <a href='vote.php' class='btn'>Голосования</a>
        <a href='people.php' class='btn'>Граждане</a>
      </nav>
    </header>
    <main>
      <div class='tree' onclick='hidePopups();'>
        <ul>
          <li class='root' aid=0>
            <a href='#' onclick='loadAddress(this, false);' oncontextmenu='contextAddress(this);return false;'>Страны</a>
          </li>
        </ul>
      </div>
    </main>
    <footer>
      footer buttons
    </footer>

    <div id='contextMenu' class='context'></div>
  </body>
</html>