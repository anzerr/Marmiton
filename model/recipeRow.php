<?php

namespace Jinx\Model {
	class RecipeRow extends \Jinx\Entity\DB
	{
		private static $_loaded = false;
		public static $_struct = array(
			'column' => array(
				'id' => 'int(11) NOT NULL AUTO_INCREMENT',
				'ingredientId' => 'int NOT NULL',
				'recipeId' => 'int NOT NULL',
			),
			'detail' => array(
				'PRIMARY KEY (id)',
				'constraint ri_fk_recipe foreign key (recipeId) references recipe(id)',
				'constraint ri_fk_ingredient foreign key (ingredientId) references ingredient(id)',
			),
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