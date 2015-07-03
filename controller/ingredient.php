<?php

namespace Jinx\Controller {
	use \Jinx\Entity as Entity;
	use \Jinx\Model as Model;

	Class Ingredient extends Entity\BaseController {
		public function get($param) {
			$a = (new Model\Ingredient())->select();
			echo json_encode($a->run());
		}
		
		public function delete($param) {
			$a = (new Model\Ingredient())->delete()->where('id = :id', array('id' => $param['id']));
			echo json_encode($a->run());
		}
		
		public function update($param) {
			$a = (new Model\Ingredient())->update()->value($param['value'])->where('id = :id', array('id' => $param['id']));
			var_dump($a);
			echo json_encode($a->run());
		}
		
		public function create($param) {
			if (isset($param['value'])) {
				$a = (new Model\Ingredient())->insert();
				$a->value($param['value']);
				echo json_encode($a->run());
			} else {
				echo json_encode(array('error' => 'did not find value.'));
			}
		}
	}
}