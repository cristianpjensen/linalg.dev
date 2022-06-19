import { useEffect, useRef } from "react";
import { Space, Vector } from "react-three-linalg";
import * as THREE from "three";
import { useStore } from "../stores";

export default function VectorSpace() {
  const vectors = useStore((state) => state.vectors);

  return (
    <Space width={window.innerWidth / 2}>
      {vectors.map(({ id, vector }) => (
        <VectorWrapper
          key={id}
          vector={vector}
          x={vector.x}
          y={vector.y}
          z={vector.z}
        />
      ))}
    </Space>
  );
}

interface VectorWrapperProps {
  vector: THREE.Vector3;
  // These are needed, because react will not update the component when a
  // Vector3 component changes
  x: number;
  y: number;
  z: number;
}

function VectorWrapper({ vector, x, y, z }: VectorWrapperProps) {
  const ref = useRef<Vector>(null);

  useEffect(() => {
    ref.current?.move(vector);
  }, [x, y, z]);

  return <Vector ref={ref} vector={vector} />;
}
