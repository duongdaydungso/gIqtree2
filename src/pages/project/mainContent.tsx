import { useEffect, useState, useRef } from "react";

import { PhylotreeVisualization } from "phylotree-visualization-demo";

import { AssessmentSettings, BootstrapMethod, SingleBranchTest } from "../../interfaces/assessmentSettings";

import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export enum TreeFileType {
    TreeFile,
    ContreeFile,
    BoottreesFile,
    UFBootFile
}

function MainContent({ content, fileType, assessmentSettings, isExecuting }: { content: string, fileType: TreeFileType | null, assessmentSettings: AssessmentSettings | null, isExecuting: boolean }) {
    const contentRef = useRef<HTMLDivElement>(null);
    
    const [currentTreeFormInput, setCurrentTreeFormInput] = useState<string>("1");
    const [currentTree, setCurrentTree] = useState<number>(0);
    const [supportValue, setSupportValue] = useState<string | undefined>(undefined);
    const [tree, setTree] = useState<React.ReactElement | null>(null);
    const [treeArray, setTreeArray] = useState<Array<string>>([]);

    useEffect(() => {
        if (fileType === null && content && isExecuting && contentRef.current) {
            contentRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    });

    useEffect(() => {
        if (assessmentSettings && fileType === TreeFileType.TreeFile) {
            const bootstrapMethod: BootstrapMethod | undefined = assessmentSettings.bootstrapMethod;
            const singleBranchTest: SingleBranchTest[] | undefined = assessmentSettings.singleBranchTests;

            let resultS: string[] = [];

            if (singleBranchTest) {
                singleBranchTest.forEach((sBT) => {
                    if (sBT === SingleBranchTest.SH_aLRT) resultS.push("SH-aLRT (%)");
                });

                singleBranchTest.forEach((sBT) => {
                    if (sBT === SingleBranchTest.LocalBootstrap) resultS.push("local bootstrap (%)");
                });

                singleBranchTest.forEach((sBT) => {
                    if (sBT === SingleBranchTest.ABayes) resultS.push("aBayes");
                });
            }

            if (bootstrapMethod) resultS.push(bootstrapMethod + " bootstrap (%)");

            setSupportValue(resultS.join('/'));
        } else if (fileType === TreeFileType.ContreeFile) {
            setSupportValue("bootstrap (%)");
        } else setSupportValue(undefined);
    }, [assessmentSettings, content, fileType]);

    useEffect(() => {
        setCurrentTree(0);
        setCurrentTreeFormInput("1");
    
        if (content) {
            let resultS: string[] = content.split(";");

            if (resultS[resultS.length - 1] === "" ||
                resultS[resultS.length - 1] === "\r" ||
                resultS[resultS.length - 1] === "\n" ||
                resultS[resultS.length - 1] === "\r\n") resultS.pop();

            setTreeArray(resultS);
        }
    }, [content, fileType])

    useEffect(() => {
        if (fileType !== null && content && treeArray.length > 0 && treeArray[0][0] === "(") {
            setTree(
                <PhylotreeVisualization
                    input={treeArray[currentTree] + ";"}
                    supportValueInput={supportValue}
                />
            );
        } else {
            setTree(null);
        }
    }, [treeArray, currentTree, supportValue, content, fileType]);
    
    // Function
    const handleChangeCurrentTree = (delta: number) => {
        const tmp = parseInt(currentTreeFormInput, 10) - 1 + delta;

        if (!isNaN(tmp) && tmp >= 0 && tmp < treeArray.length) {
            setCurrentTreeFormInput((tmp + 1).toString());
            setCurrentTree(tmp);
        }
    };

    // TREE FILE CASE
    if (fileType !== null && content) {
        // RENDER TREE
        return (
            <div className='h-[87vh] overflow-y-scroll snap-y snap-mandatory snap-end' style={{ width: '80vw' }}>
                <div className="columns-4 py-3">
                    <div className="text-right text-xl py-2 pl-4">Current tree (total {treeArray.length} trees) :</div>
                    <div className="text-right">
                        <button className="action-button" onClick={() => handleChangeCurrentTree(-1)}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </button>
                    </div>
                    <form
                        className="current-tree-form"
                        onSubmit={() => handleChangeCurrentTree(0)}
                    >
                        <div className="current-tree-form-input text-center">
                            <input
                                className="border-2 p-2 rounded-lg basis-1/4"
                                type="text"
                                placeholder="Current tree"
                                value={currentTreeFormInput}
                                onChange={(event) => {
                                    setCurrentTreeFormInput(event.target.value);
                                }}
                            />
                        </div>
                    </form>
                    <div className="text-left">
                        <button className="action-button" onClick={() => handleChangeCurrentTree(1)}>
                            <FontAwesomeIcon icon={faAngleRight} />
                        </button>
                    </div>
                </div>

                {(!isNaN(currentTree) && currentTree >= 0 && currentTree < treeArray.length && treeArray.length > 0) ? tree : null}
            </div>
        );
    }

    // OTHERS FILE CASE
    return (
        <pre className='h-[87vh] overflow-y-scroll snap-y snap-mandatory snap-end' style={{ width: '80vw' }}>
            {content}
            <div ref={contentRef} />
        </pre>
    );
}

export default MainContent;