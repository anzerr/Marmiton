<?php

namespace Jinx\Controller {
	use \Jinx\Entity as Entity;
	use \Jinx\Model as Model;

	Class Comment extends Entity\BaseController {
		public function get($param) {
			$a = (new Model\Comment())->select();
			echo json_encode($a->run());
		}
		
		public function delete($param) {
			$a = (new Model\Comment())->delete()->where('id = :id', array('id' => $param['id']));
			echo json_encode($a->run());
		}
		
		public function update($param) {
			$a = (new Model\Comment())->update()->value($param['value'])->where('id = :id', array('id' => $param['id']));
			echo json_encode($a->run());
		}
		
		public function create($param) {
			$a = (new Model\Comment())->insert();
			foreach ($param['value'] as $key => $value) {
				$a->value($value);
			}
			echo json_encode($a->run());
		}
	}
}