<?php

namespace Jinx\Entity {
	use \Jinx\Model as Model;
	
	class BaseController {
		
		public function __construct($dir) {
			$this->baseDir = str_replace('\\', '/', $dir);
			return ($this);
		}
		
		public function index() {
			$a = (new Model\Users())->select()->where('id = :id', array('id' => 10));
			var_dump($a->run());
			var_dump($a->toString());
			//echo file_get_contents($this->baseDir . '/public/index.html');
		}
	}
}