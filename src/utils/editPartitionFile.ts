import { type } from "os";
import { getBinaryPath } from "../platform";

const replace = require('replace-in-file');

// Error occurred while running in Windows
function editPartitionFile(partitionPath?: string) {
    if (type() !== "Windows_NT") return;

    if (!partitionPath) return;

    const binaryPath = getBinaryPath();

    const binaryPathArray = binaryPath?.split("\\");

    if (!binaryPathArray) return;

    const tmpStr = "..\\";

    let patternExpression = /\w+:\\/g;
    
    const options = {
        files: partitionPath,
        from: patternExpression,
        to: tmpStr.repeat(binaryPathArray.length - 1)
    };

    replace(options, (error: any) => {
        if (error) {
            console.log("Error occurred at editPartitionFile: " ,error);
        }
    });
}

export default editPartitionFile;