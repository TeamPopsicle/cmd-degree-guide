class CS {
    private graph: Record<string, string[]>;
    // Class for the CS major --> holds a DAG of all the required 'core' courses for major
    constructor() {
        this.graph =
        {
            "210": ["211"],
            "211": ["212"],
            "212": ["313", "314"],
            "231": ["232"],
            "232": ["313"],
            "313": ["315"],
            "315": ["425", "422"],
            "314": ["330"],
            "330": ["415"],
            "mathseries1": ["mathseries2"],
            "mathseries2": ["mathelective1", "mathelective2"],
            "scienceseries1": ["scienceseries2"],
            "scienceseries2": ["scienceseries3"],
            "writing": [],
        };
    }

    _getGraph() {
        // Helper function returning the graph
        return this.graph;
    }

    _getPrereq() {
        // New way of accessing prereqs --> generates a dict based on the DAG
        // Logic: reverse the keys and vals of the DAG and then add in any classes with no prereqs at the end
        let prereqs: Record<string, string[]> = {};

        // List of DAG keys
        const k: string[] = Object.keys(this.graph);

        // Reverses the DAG dictionary
        for (const [key, val] of Object.entries(this.graph)) {
            for (const vals of val) {
                prereqs[vals] = prereqs[vals] || [];
                prereqs[vals].push(key);
            }
        }

        // List of reverse dicts keys
        const reverseKeys: string[] = Object.keys(prereqs);
        // If key from DAG is not in prereq dict, then it has no prereqs, add it in w/ this value: ['']
        for (const x of k) {

            if (!(reverseKeys.includes(x))) //(!(x in reverseKeys)) 
            {
                prereqs[x] = [''];
            }
        }
        return prereqs;
    }
}

class REQPATH {
    DAG: Record<string, string[]>;
    prereq: Record<string, string[]>;
    // Class for getting a valid path depending on the dag given by the chosen major
    constructor(major: string) {
        // Checks for the major (right now it's just CS) and retrieves req core courses (DAG) for it
        if (major === "CS") {
            const m = new CS();
            this.DAG = m._getGraph();
            this.prereq = m._getPrereq();
        }
        else {
            this.DAG = {};
            this.prereq = {};
        }
    }

    topologicalSort() {
        // Topologically sorts DAG using recursion; looks at each node and then uses visit to check the children nodes
        const visited: Record<string, boolean> = {};
        const topologicalOrder: string[] = [];

        for (const node in this.DAG) {
            if (!(node in visited)) {
                this.visit(node, visited, topologicalOrder);
            }
        }
        return topologicalOrder;
    }

    visit(node: string, visited: Record<string, boolean>, topologicalOrder: string[]) {
        // Recursive function that marks nodes as visited and enacts a DFS of each node's children
        visited[node] = true;

        if (node in this.DAG) {
            for (const child of this.DAG[node]) {
                if (!(child in visited)) {
                    this.visit(child, visited, topologicalOrder);
                }
            }
        }
        topologicalOrder.unshift(node);
    }
}

export function runGenAlg(termsLeft: number, coursesTaken: string) {
    const dag = new REQPATH("CS");

    /*
    this is the input part still written in python, for the sake of changing to javascript
    I am just going to set these values as default/remove no classes, etc.
    
    #prompts user for how many terms left 
    termsLeft = int(input("How many terms do you have until expected graduation?"))
    
    #simple prompt that asks user for a course they have taken, and removes it from the DAG before enacting top sort
    while True:
        ask = input("Enter courses taken (N/A if done):")
        if ask == "N/A":
            break
        else:
            if ask in dag.DAG:
                dag.DAG.pop(ask)
    */


    const topologicalOrder = dag.topologicalSort();
    //console.log(dag.topologicalSort());

    //setting list of terms with each list being a term itself
    const terms: Array<string[]> = [];
    for (let i = 0; i < termsLeft; i++) {
        terms.push([]);
    }
    //keeps track of 'end' of the list of terms
    const end = terms.length - 1;

    //prereq dict:
    const prereqs = dag.prereq;
    //console.log(JSON.stringify(prereqs));

    try {
        for (const course of topologicalOrder) {
            // Get the list of prereqs for each term
            const prereq = prereqs[course] || [];

            // startTerm is going to hold the 'first' valid term
            // currentTerm lets us iterate through all of the terms, checking for prereqs in each one
            let startTerm = 0;
            let currentTerm = 0;

            // Loop usually runs only once, but necessary for courses with multiple prereqs
            for (const p of prereq) {
                // Algorithm for getting a valid term (no prereqs in that term or future terms) to store the current course
                while (true) {
                    // If currentTerm is at the end of the list, break out of the loop (looked at all terms)
                    if (currentTerm > end) {
                        break;
                    }
                    // If the prereq is in the current term, increase currentTerm and set startTerm = currentTerm (term after the term with the prereq)
                    if (terms[currentTerm].includes(p)) {
                        currentTerm += 1;
                        startTerm = currentTerm;
                    }
                    // If the prereq isn't in the current term, iterate through to the next term
                    else {
                        currentTerm += 1;
                    }
                }
                // This is only important if we have multiple prereqs, we set currentTerm = startTerm,
                // since we know startTerm is the valid term for the first prereq, we don't have to start at the beginning of the list, start at this term
                currentTerm = startTerm;
            }
            // This checks to make sure all terms are limited to 4 classes
            if (terms[startTerm].length >= 4) {
                let index = 1;
                while (true) {
                    if (terms[startTerm + index].length < 4) {
                        terms[startTerm + index].push(course);
                        break;
                    }
                    else {
                        index += 1;
                    }
                }
            }
            else {
                terms[startTerm].push(course);
            }
        }
        return JSON.stringify(terms);
    }
    catch (e) {
        // This is for catching errors, such as index errors, meaning not enough terms for classes left
        console.error("You cannot graduate in that number of terms :(");
        console.error(e);
        return "";
    }
}
