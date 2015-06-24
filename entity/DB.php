<?php

namespace Jinx\Entity {
	class DB
	{
		private static $_pdo = null;
		
		public $_query;
		public $_table;
		
		public function __construct($pdo = null)
		{
			if (self::$_pdo == null && isset($pdo) && $pdo != null) {
				self::$_pdo = $pdo;
			}
		}
		
		public function load($_struct) {
			$str = 'CREATE TABLE IF NOT EXISTS `' . $this->_table . '` (';
			$count = 0;
			foreach ($_struct['collume'] as $key => $value) {
				$str .= (($count != 0) ? ',' : '') . '`' . $key . '` ' . $value;
				$count += 1;
			}
			foreach ($_struct['detail'] as $key => $value) {
				$str .= (($count != 0) ? ',' : '') . $value;
				$count += 1;
			}
			$str .= ')' . ((isset($_struct['info'])) ? $_struct['info'] : '') . ';';
			var_dump($str);
			var_dump($this->run($str));
		}
		
		public function select($col = null) {
			$ncol = '*';
			if ($col != null) {				
				$ncol = '';
				foreach ($col as $key => $value) {
					$ncol .= (($key != 0) ? ', ' : '') . $this->secure($value);
				}
			}
			$this->_query = 'SELECT ' . trim($ncol) . ' FROM ' . $this->_table;
			return ($this);
		}
		
		public function where($w, $p = null) {
			if ($p != null) {
				foreach ($p as $key => $value) {
					$w = preg_replace('/:id/', $value, $w);
				}
			}
			$this->_query .= ' WHERE ' . $w; 
			return ($this);
		}
		
		public function run($query = null) {
			try {
				$query = self::$_pdo->prepare(($query == null) ? $this->_query : $query);
				$query->execute();
				return ($query->fetchAll(Entity\MyPDO::FETCH_ASSOC));
			} catch(\Exception $e) {
				return ($e->getMessage());
			}
		}
		
		public function secure($str) {
			return ($str);
		}
		
		public function toString() {
			return ($this->_query);
		}
	}
}