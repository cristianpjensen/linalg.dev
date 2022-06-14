import { Space, Vector } from "react-three-linalg";
import * as THREE from "three";

export default function VectorSpace() {
  const v = new THREE.Vector3(1, 2, 3);

  return (
    <Space>
      <Vector vector={v} />
    </Space>
  );
}
