<?php

namespace Jinx\Controller {
	use \Jinx\Entity as Entity;
	use \Jinx\Model as Model;

	Class Recipe extends Entity\BaseController {
		public function get($param) {
			$a = (new Model\Recipe())->select();
			/*
				need to join with the other stuff
			*/
			echo json_encode($a->run());
		}
		
		public function delete($param) {
			$a = (new Model\Recipe())->delete()->where('id = :id', array('id' => $param['id']));
			echo json_encode($a->run());
		}
		
		public function update($param) {
			$a = (new Model\Recipe())->update()->value($param['value'])->where('id = :id', array('id' => $param['id']));
			echo json_encode($a->run());
		}
		
		public function create($param) {
			$a = (new Model\Recipe())->insert();
			foreach ($param['value'] as $key => $value) {
				$a->value($value);
			}
			/*
				need a real create for all the child tables
			*/
			echo json_encode($a->run());
		}
	}
}