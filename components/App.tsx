import { observer } from "mobx-react-lite";

import { Context as NodeContext } from "../node-engine";
import { EditorContext } from "../editor-state";
import Editor from "./Editor";
import Toolbar from "./Toolbar";
import VectorSpace from "./VectorSpace";

export interface IAppProps {
	nodeContext: NodeContext;
	editorContext: EditorContext;
}

const App = observer(({ nodeContext, editorContext }: IAppProps) => {
	return (
		<>
			<div
				className="h-full"
				style={{
					width: `${(
						(1 - 1 / editorContext.vectorSpaceSize) *
						100
					).toFixed(3)}%`,
				}}
			>
				<Toolbar editorContext={editorContext} />
				<Editor context={nodeContext} editorContext={editorContext} />
			</div>

			<VectorSpace context={nodeContext} editor={editorContext} />
		</>
	);
});

export default App;
