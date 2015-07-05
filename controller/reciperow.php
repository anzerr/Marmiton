<?php

namespace Jinx\Controller {
	use \Jinx\Entity as Entity;
	use \Jinx\Model as Model;

	Class Reciperow extends Entity\BaseController {
		public function get($param) {
			$a = (new Model\RecipeRow())->select();
			if (isset($param['id'])) {
				$a->where('id = :id', array('id' => $param['id']));
			}
			if (isset($param['recipeId'])) {
				$a->where('recipeId = :recipeId', array('recipeId' => $param['recipeId']));
			}
			echo json_encode($a->run());
		}
		
		public function delete($param) {
			$a = (new Model\RecipeRow())->delete()->where('id = :id', array('id' => $param['id']));
			echo json_encode($a->run());
		}
		
		public function update($param) {
			$a = (new Model\RecipeRow())->update()->value($param['value'])->where('id = :id', array('id' => $param['id']));
			echo json_encode($a->run());
		}
		
		public function create($param) {
			$a = (new Model\RecipeRow())->insert()->value($param['value']);
			echo json_encode($a->run());
		}
	}
}