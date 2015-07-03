<?php

namespace Jinx\Entity {
	class DB
	{
		private static $_pdo = null;
		
		public $_query;
		public $_table;
		public $_value;
		public $_type;
		public static $_coln = array();
		
		public function __construct($pdo = null)
		{
			if (self::$_pdo == null && isset($pdo) && $pdo != null) {
				self::$_pdo = $pdo;
			}
			
			$this->_type = '';
			$this->_value = 0;
		}
		
		public function load($_struct) {
			$str = 'CREATE TABLE IF NOT EXISTS `' . $this->_table . '` (';
			$count = 0;
			foreach ($_struct['column'] as $key => $value) {
				$str .= (($count != 0) ? ',' : '') . '`' . $key . '` ' . $value;
				self::$_coln[] = $key;
				$count += 1;
			}
			foreach ($_struct['detail'] as $key => $value) {
				$str .= (($count != 0) ? ',' : '') . $value;
				$count += 1;
			}
			$str .= ')' . ((isset($_struct['info'])) ? $_struct['info'] : '') . ';';
			//var_dump($str);
			$this->run($str);
		}
		
		public function select($col = null) {
			$ncol = '*';
			if ($col != null) {				
				$ncol = '';
				foreach ($col as $key => $value) {
					$ncol .= (($key != 0) ? ', ' : '') . $this->secure($value);
				}
			}
			$this->_type = 'select';
			$this->_query = 'SELECT ' . trim($ncol) . ' FROM ' . $this->_table;
			return ($this);
		}
		
		public function insert($_struct, $extra) {
			$ncol = '';
			$count = 0;
			foreach ((($extra != null)? $extra : $_struct['column']) as $key => $value) {
				$ncol .= (($count != 0) ? ', ' : '') . $key;
				$count += 1;
			}
			$this->_type = 'insert';
			$this->_query = 'INSERT INTO ' . $this->_table . ' (' . trim($ncol) . ') ';
			return ($this);
		}
		
		public function update() {
			$this->_type = 'update';
			$this->_query = 'UPDATE ' . $this->_table . ' SET ';
			return ($this);
		}
		
		public function value($col = null) {
			$ncol = '';
			if ($col != null) {
				if ($this->_type == 'insert') {
					$count = 0;
					foreach ($col as $key => $value) {
						$ncol .= (($count != 0) ? ', ' : '') . (($value == null) ? 'NULL' : '"' . $this->secure($value) . '"');
						$count += 1;
					}
					$ncol = ' (' . trim($ncol) . ')';
				}
				if ($this->_type == 'update') {
					$count = 0;
					foreach ($col as $key => $value) {
						if ($value != null) {
							$name = ((isset(self::$_coln[$key])) ? self::$_coln[$key] : $key ) . ' = ';
							$ncol .= (($count != 0) ? ', ' : '') . $name . (($value == 'NULL') ? 'NULL' : '"' . $this->secure($value) . '"');
							$count += 1;
						}
					}
					$ncol = ' ' . trim($ncol);
				}
			}
			$this->_query .= (($this->_type == 'insert')? (($this->_value == 0) ? 'VALUES' : ',') : '') . $ncol;
			$this->_value += 1;
			return ($this);
		}
		
		public function delete() {
			$this->_type = 'delete';
			$this->_query = 'DELETE FROM ' . $this->_table;
			return ($this);
		}
		
		public function query($q) {
			$this->_type = 'custome';
			$this->_query = $q;
			return ($this);
		}
		
		public function where($w, $p = null) {
			if ($p != null) {
				foreach ($p as $key => $value) {
					$w = preg_replace('/:' . $key . '/', $value, $w);
				}
			}
			$this->_query .= ' WHERE ' . $w; 
			return ($this);
		}
		
		public function run($query = null) {
			try {
				$query = self::$_pdo->prepare(($query == null) ? $this->_query : $query);
				$query->execute();
				return ($query->fetchAll(MyPDO::FETCH_ASSOC));
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