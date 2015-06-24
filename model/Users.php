<?php

namespace Jinx\Model {
	class Users extends \Jinx\Entity\DB
	{
		private static $_loaded = false;
		public static $_struct = array(
			'collume' => array(
				'id' => 'int(11) NOT NULL AUTO_INCREMENT',
				'name' => 'varchar(100) NOT NULL',
			),
			'detail' => array('PRIMARY KEY ("id")'),
			'info' => '',
		);
		
		public function __construct()
		{
			$this->_query = '';
			$this->_table = 'user';
			if (!self::$_loaded) {
				self::$_loaded = true;
				$this->load(self::$_struct);
			}
			return ($this)
;		}
	}
}