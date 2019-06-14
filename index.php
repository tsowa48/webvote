<html>
  <head>
		<meta name='viewport' content='width=device-width, initial-scale=1'>
		<link rel='icon' href='/favicon.png'>
  	<link rel='stylesheet' href='/style.css?<?=rand();?>'/>
		<script type='text/javascript' src='/jquery.min.js'></script>
<?php if(!isset($_COOKIE['vid']) && !is_numeric($_COOKIE['vid'])) { ?>
  	<script type='text/javascript'src='/script.js'></script>
<?php } ?>
    <title>E-Vote</title>
  </head>
  <body>
<?php if(!isset($_COOKIE['vid']) && !is_numeric($_COOKIE['vid'])) { ?>
    <header>
      <nav class='dashboard'>

      </nav>
    </header>
    <main>
      Список голосований: <ol id='votes'></ol><br>
		</main>
<?php } else { ?>
	<header>
		<?php echo 'VoteID:',$_COOKIE['vid'];?>
		<?php echo '<br>Secret:',$_COOKIE['secret'];?>
	</header>
	<main>
	TODO:
		4.1 Check secret+vid again ? (no, just load data and do /poll, ut /poll does check: secret,vid,rid)
			4.1.1. load rivals<br>
      4.1.2. show rivals<br>
    4.2. do vote<br>
    4.3. show result<br>
	</main>
<?php } ?>
    <footer>footer</footer>
  </body>
</html>