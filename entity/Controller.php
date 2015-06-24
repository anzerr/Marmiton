<?php

namespace Jinx\Entity {
	use \Jinx\Model as Model;
	
	class BaseController {
		
		public function __construct($dir) {
			$this->baseDir = str_replace('\\', '/', $dir);
			return ($this);
		}
		
		public function index() {
			$a = (new Model\Recipe())->select()->where('id = :id', array('id' => 10));
			var_dump($a->run());
			$a = (new Model\Ingredient())->select()->where('id = :id', array('id' => 10));
			var_dump($a->run());
			$a = (new Model\Comment())->select()->where('id = :id', array('id' => 10));
			var_dump($a->run());
			$a = (new Model\RecipeRow())->select()->where('id = :id', array('id' => 10));
			var_dump($a->run());
			
			/*
			$a = (new Model\Users())->insert()->value(array(null, 'cat'))->value(array(null, 'cat'));
			var_dump($a->run());
			var_dump($a->toString());
			
			$a = (new Model\Users())->select()->where('id = :id', array('id' => 10));
			var_dump($a->run());
			var_dump($a->toString());
			
			$a = (new Model\Users())->update()->value(array(null, 'egg'))->where('id = :id', array('id' => 10));
			var_dump($a->run());
			var_dump($a->toString());
			//echo file_get_contents($this->baseDir . '/public/index.html');*/
		}
	}
}