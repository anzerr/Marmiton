<?php

namespace Jinx\Model {
	class Comment extends \Jinx\Entity\DB
	{
		private static $_loaded = false;
		public static $_struct = array(
			'column' => array(
				'id' => 'int(11) NOT NULL AUTO_INCREMENT',
				'email' => 'varchar(100) NOT NULL',
				'comment' => 'text NOT NULL',
				'date' => 'datetime NOT NULL',
				'recipeId' => 'int NOT NULL',
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
	}
}