<?php
	require_once dirname(__FILE__) . "/entity/Core.php";
	(new Jinx\Entity\Core(dirname(__FILE__)))->load()->connection(array(
		'ip' => '127.0.0.1',
		'port' => '3306',
		'database' => 'Marmiton',
		'user' => 'root',
		'password' => '',
	))->run();
?>