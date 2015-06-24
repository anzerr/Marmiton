<?php
	require_once dirname(__FILE__) . "/entity/Core.php";
	(new Jinx\Entity\Core(dirname(__FILE__)))->load()->connection(array(
		'ip' => 'localhost',
		'port' => '',
		'database' => 'Marmiton',
		'user' => 'root',
		'password' => '',
	))->run();
?>