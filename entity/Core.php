<?php

namespace Jinx\Entity {
	use \Jinx\Controller as Controller;
	use \Jinx\Entity as Entity;
	
	class Core
	{
		private $baseDir;
		
		private function getFiles($dir) {
			$files = array();
			foreach ($dir as $value) {
				$dh  = opendir($this->baseDir . '/' . $value);
				while (false !== ($filename = readdir($dh))) {
					if ($filename !== '.' and $filename !== '..') {
						$files[] = str_replace('//', '/', $this->baseDir .'/'. $value .'/'. $filename);
					}
				}
			}
			return ($files);
		}
		
		private function initController($name) {
			try {
				$str = 'Jinx\\Controller\\' . ucfirst(strtolower($name)); 
				if (class_exists($str)) {
					return (new $str($this->baseDir));
				}
			} catch (Exception $e) {
				// log the error
			}
			return (null);
		}
		
		public function __construct($dir) {
			$this->baseDir = str_replace('\\', '/', $dir);
			return ($this);
		}

		public function load() {
			foreach ($this->getFiles(array('entity', 'model', 'controller')) as $value) {
				require_once $value;
			}
			return ($this);
		}
		
		public function connection($arg) {
			try {
				$host = 'mysql:host=' . $arg['ip'] . ((isset($arg['port']) && $arg['port'] != '') ? ';port=' . $arg['port'] : '');
				$pdo = new Entity\MyPDO($host . ';dbname=' . ((isset($arg['database'])) ? $arg['database'] : ''), $arg['user'], $arg['password']);
				$pdo->setAttribute(Entity\MyPDO::ATTR_ERRMODE, Entity\MyPDO::ERRMODE_EXCEPTION);
				$pdo->setAttribute(Entity\MyPDO::ATTR_EMULATE_PREPARES, false);
				new DB($pdo);
			} catch(\Exception $e) {
				echo 'wrong connection information for the database.';
				var_dump($e);
				die;
			}
			return ($this);
		}
		
		public function run() {
			if (($json = json_decode(file_get_contents('php://input'), true)) === null) {
				$json = array('c' => 'home', 'a' => 'index');
			}
			$cont = $this->initController((isset($json['c'])) ? $json['c'] : 'home');
			if ($cont !== null) {
				$action = (isset($json['a']) && is_callable(array($cont, $json['a']))) ? $json['a'] : 'index';
				$cont->$action((isset($json['p'])) ? $json['p'] : null);
			}
		}
	}
}