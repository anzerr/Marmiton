<?php

namespace Jinx\Entity {
	use PDO;
	use Jinx\Model as Model;

	class MyPDO extends PDO {
		private $_db;
		private $_login;
		private $_password;

		public function __construct($db, $login, $password)
		{
			$this->setDb($db);
			$this->setLogin($login);
			$this->setPassword($password);
			
			$loaded = false;
			try {
				@parent::__construct($this->getDb(), $this->getLogin(), $this->getPassword()/*, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES UTF8")*/);
				$loaded = true;
			} catch (\Exception $e) {
				throw new \Exception("Can't connect to sql server with '" . $db . "' .");
			}
			
			if ($loaded) {
				//$this->users = new Model\DB_Users($this);
			}
		}
		
		public function getDb()
		{
			return $this->_db;
		}
		public function getLogin()
		{
			return $this->_login;
		} 
		public function getPassword()
		{
			return $this->_password;
		}
		
		public function setDb($db)
		{
			if (is_string($db))
			{
				$this->_db = $db;
			}
		}
		public function setLogin($login)
		{
			if (is_string($login))
			{
				$this->_login = $login;
			}
		} 
		public function setPassword($password)
		{
			if (is_string($password))
			{
				$this->_password = $password;
			}
		}	
		public function ajax($str)
		{
			return utf8_encode($str);
		}
	}
}