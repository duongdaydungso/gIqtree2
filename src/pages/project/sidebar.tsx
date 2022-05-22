import { useEffect, useState } from 'react';
import { Tree } from 'react-arborist';
import { readdirSync, statSync } from 'fs';
import { basename, join } from 'path';
import useResize from 'use-resize-observer';
import { diff } from 'deep-object-diff';

type Node = {
    id: string;
    path: string;
    children?: Node[];
    name: string;
    isFolder: boolean;
}

function recurse(path: string) {
    const baseNode: Node = { id: path, name: basename(path), path, isFolder: false }

    if (statSync(path).isDirectory()) {
        baseNode.isFolder = true;
        baseNode.children = readdirSync(path)
            .map(dir => join(path, dir))
            .map(recurse);
    }

    return baseNode;
}

function Sidebar(
    { projectPath, currentFile, onFileChosen }:
    { projectPath: string, currentFile?: string, onFileChosen?: (f: string) => void }
) {
    let [treeHeight, setTreeHeight] = useState(0);
    let [treeWidth, setTreeWidth] = useState(0);
    let [tree, setTree] = useState<Node>({
        id: projectPath,
        name: basename(projectPath),
        path: projectPath,
        isFolder: true
    });

    let { ref: treeRef } = useResize({
        onResize({ height, width }) {
            if (height) setTreeHeight(height);
            if (width) setTreeWidth(width);
        }
    })

    useEffect(() => {
        let interval = setInterval(() => {
            let old = tree;
            let current = recurse(projectPath);
            if (Object.keys(diff(old, current)).length)
                setTree(recurse(projectPath));
        }, 200);
        return () => clearInterval(interval);
    }, [projectPath]);

    return (
        <div className="ml-2 h-full" ref={treeRef}>
            <Tree
                data={tree}
                width={Math.max(treeWidth, window.visualViewport.width / 7)}
                height={Math.max(treeHeight, window.visualViewport.height * 4 / 5)} className='h-full'>
                {({ styles, data }) => {
                    let clickable = !data.isFolder && !data.name.endsWith('.gz');
                    return (
                        <div
                            className={
                                (data.path === currentFile ? 'bg-gray-200' : '')
                                + (clickable ? ' cursor-pointer' : ' text-gray-400')
                            }
                            style={styles.row}
                            key={data.id}>
                            <div style={styles.indent} onClick={() => {
                                if (clickable)
                                    onFileChosen?.(data.path);
                            }}>
                                {data.name}
                            </div>
                        </div>
                    )
                }}
            </Tree>
        </div>
    )
}

export default Sidebar;