import {PhylotreeVisualization} from "phylotree-visualization-demo/dist/esm";

function MainContent({ content, isTreeFile }: { content: string, isTreeFile: boolean }) {
    // TODO: Implement tree viewing here - just encapsulate the logic,
    // including switching between visualized/plain text
    return (
        <pre className='h-[87vh] overflow-y-scroll snap-y snap-mandatory snap-end' style={{ width: '80vw' }}>
            {isTreeFile &&
                <PhylotreeVisualization input={ content } />
            }
            {!isTreeFile && content}
        </pre>
    )
}

export default MainContent;