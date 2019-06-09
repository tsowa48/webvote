<html>
  <head>
    <link rel='stylesheet' href='/style.css'/>
    <link rel='icon' href='/favicon.png'>
    <script type='text/javascript' src='/jquery.min.js'></script>
    <script type='text/javascript'>
    var vBASE = 'https://genco.one:5432';
    function X() {
      $.ajax({
        url: vBASE + '/_debug',
        success: function(data, status, xhr) {
          document.getElementsByClassName('JJ')[0].innerHTML = 'your IP:' + data;
        },
        type: 'get',
        crossDomain: true
      });
    }
    </script>
    <title>E-Vote webadmin</title>
  </head>
  <body>
    <header>
      <nav class='dashboard'>
        <a href='address.php' class='btn'>Адреса</a>
        <a href='rival.php' class='btn'>Альтернативы</a>
        <a href='vote.php' class='btn'>Голосования</a>
        <a href='people.php' class='btn'>Граждане</a>
      </nav>
    </header>
    <main>
      <button onclick='X();'>Send AJAX</button>
      <div class='JJ'></div>
    </main>
    <footer>footer</footer>
  </body>
</html>