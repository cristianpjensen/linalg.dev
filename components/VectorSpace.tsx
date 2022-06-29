import { useEffect, useRef } from "react";
import { Space, Vector } from "react-three-linalg";
import * as THREE from "three";
import { useNodeStore } from "../stores/nodes";

export default function VectorSpace() {
  const { vectors, getVector } = useNodeStore((state) => ({
    vectors: state.vectors,
    getVector: state.getVector,
  }));

  return (
    <div style={{ width: window.innerWidth / 2, backgroundColor: "black" }}>
      <Space width={window.innerWidth / 2}>
        {vectors.map(({ id }) => {
          const vector = getVector(id);

          return <VectorWrapper key={id} vector={vector} />;
        })}
      </Space>
    </div>
  );
}

interface VectorWrapperProps {
  vector: THREE.Vector3;
}

function VectorWrapper({ vector }: VectorWrapperProps) {
  const ref = useRef<Vector>(null);

  useEffect(() => {
    ref.current?.move(vector);
  }, [vector.x, vector.y, vector.z]);

  return <Vector ref={ref} vector={vector} />;
}
