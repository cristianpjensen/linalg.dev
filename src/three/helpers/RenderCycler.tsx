import { useEffect } from "react";
import * as TWEEN from "@tweenjs/tween.js";
import { useThree } from "@react-three/fiber";

/**
 * Updates tweens every frame.
 */
function RenderCycler() {
	const { gl, scene, camera } = useThree();

	const render = () => {
		gl.render(scene, camera);
	};

	const animate = () => {
		requestAnimationFrame(animate);
		TWEEN.update();
		render();
	};

	useEffect(() => {
		animate();
	}, []);

	return null;
}

export default RenderCycler;
