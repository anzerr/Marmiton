<?php

namespace Jinx\Model {
	class Recipe extends \Jinx\Entity\DB
	{
		private static $_loaded = false;
		public static $_struct = array(
			'column' => array(
				'id' => 'int(11) NOT NULL AUTO_INCREMENT',
				'name' => 'varchar(100) NOT NULL',
				'instruction' => 'text NOT NULL',
				'description' => 'varchar(250) NOT NULL',
				'enable' => 'int NOT NULL',
			),
			'detail' => array('PRIMARY KEY (id)'),
			'info' => '',
		);
		
		public function __construct()
		{
			$this->_query = '';
			$this->_table = (new \ReflectionClass($this))->getShortName();
			if (!self::$_loaded) {
				self::$_loaded = true;
				$this->load(self::$_struct);
			}
			return ($this)
;		}

		public function insert($extra = null, $_not = null) {
			return (parent::insert(self::$_struct, $extra));
		}
		
		public function value($col = null, $_not = null) {
			return (parent::value($col, self::$_struct));
		}
	}
}