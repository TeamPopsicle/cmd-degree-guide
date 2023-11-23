class MAJOR {
    private graphCS: Record<string, string[]>;
    private graphDS: Record<string, string[]>;
    private graphMA: Record<string, string[]>;
    // Class for the CS major --> holds a DAG of all the required 'core' courses for major
    // TODO: Change this to get from database rather than hardcoded data
    constructor() {
        this.graphCS =
        {
            "CS210": ["CS211"],
            "CS211": ["CS212"],
            "CS212": ["CS313", "CS314"],
            "MA231": ["MA232"],
            "MA232": ["CS313"],
            "CS313": ["CS315", "csElectiveAbove300_1", "csElectiveAbove300_2"],
            "CS315": ["CS425", "CS422", "csElectiveAbove410_1"],
            "CS314": ["CS330", "csElectiveAbove300_1", "csElectiveAbove300_2"],
            "CS330": ["CS415", "csElectiveAbove410_1"],
            "mathseries1": ["mathseries2"],
            "mathseries2": ["mathelective1", "mathelective2"],
            "scienceseries1": ["scienceseries2"],
            "scienceseries2": ["scienceseries3"],
            "writing": [],
            "csElectiveAbove410_1": ["csElectiveAbove410_2", "csElectiveAbove410_3"],
            "csElectiveAbove300_1": [],
            "csElectiveAbove300_2": []
          };
          this.graphDS = 
          {
            "DSCI101": ["DSCI102"],
            "DSCI102": ["DSCI311", "DSCI345"],
            "DSCI345": ["DSCI372"],
            "CS210": ["CS211"],
            "CS211": ["CS212", "DSCI311", "DSCI345"],
            "CS212": ["DSCI372"],
            "MA251": ["MA252"],
            "MA341": ["MA342"],
            "MA342": ["DSCI311", "DSCI345"],
            "PH223": [],
            "ComputationalAndInferentialDepth1": ["ComputationalAndInferentialDepth2"],
            "ComputationalAndInferentialDepth2": ["ComputationalAndInferentialDepth3"],
            "DomainCore1": ["DomainCore2"],
            "DomainCore2": ["DomainElective1"],
            "DomainElective1": ["DomainElective2", "DomainElective3", "DomainElective4"]
          };
          this.graphMA = 
          {
            "MA251": ["MA252"],
            "MA252": ["MA253", "bridgeRequirement1","MA341"],
            "MA253": ["MA281","MA316"],
            "MA281": ["MA282"],
            "MA341": ["MA342", "MA391"],
            "MA391": ["MA392"],
            "MA316": ["MA317"],
            "bridgeRequirement1": ["bridgeRequirement2"],
            "bridgeRequirement2": ["MathLab1"],
            "MathLab1": ["MathLab2"],
            "MathLab2": ["UpperDivisionMathElective1", "UpperDivisionMathElective2", "UpperDivSeq1"],
            "UpperDivisionMathElective1": [],
            "UpperDivisionMathElective2": [],
            "UpperDivSeq1": ["UpperDivSeq2"],
            "AnyCS": []
            };
    }

    _getGraphCS() {
        // Helper function returning the graph
        return this.graphCS;
    }
    _getGraphDS()
    {
      return this.graphDS;
    }
    _getGraphMA()
    {
      return this.graphMA;
    }

    _getPrereq(major: string) {
        // New way of accessing prereqs --> generates a dict based on the DAG
        // Logic: reverse the keys and vals of the DAG and then add in any classes with no prereqs at the end
        const prereqs: Record<string, string[]> = {};
        let graph: Record<string, string[]> = {};

        if (major == "CS")
        {
          graph = this.graphCS;
          //console.log(major);
        }
        if (major == "DS")
        {
          graph = this.graphDS;
        }
        if (major == "MA")
        {
          graph = this.graphMA;
        }

        // List of DAG keys
        const k: string[] = Object.keys(graph);

        // Reverses the DAG dictionary
        for (const [key, val] of Object.entries(graph)) {
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
    DAG: Record<string, string[]> = {};
    prereq: Record<string, string[]> = {};
    // Class for getting a valid path depending on the dag given by the chosen major
    constructor(major: string) {
        // Checks for the major (right now it's just CS) and retrieves req core courses (DAG) for it
        if (major === "CS") {
            const m = new MAJOR();
            this.DAG = m._getGraphCS();
            this.prereq = m._getPrereq(major);
        }
        if (major === "DS")
        {
            const m = new MAJOR();
            this.DAG = m._getGraphDS();
            this.prereq = m._getPrereq(major);
        }
        if (major == "MA")
        {
            const m = new MAJOR();
            this.DAG = m._getGraphMA();
            this.prereq = m._getPrereq(major);
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

function sortIntoTerms(topOrder: string[], termNum: number, preReqDict: Record<string, string[]>, maxReqsPerTerm: number)
{
    //setting list of terms with each list being a term itself
    const terms: Array<string[]> = [];
    for (let i = 0; i < termNum; i++) {
        terms.push([]);
    }
    //keeps track of 'end' of the list of terms
    const end = terms.length - 1;

    for (const course of topOrder) {
        // Get the list of prereqs for each term
        const prereq = preReqDict[course] || [];

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
        if (terms[startTerm].length >= maxReqsPerTerm) {
            let index = 1;
            while (true) {
                if (terms[startTerm + index].length < maxReqsPerTerm) {
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
    //return JSON.stringify(terms);
    return terms;

}

export function runGenAlg(termsLeft: number, coursesTaken: string, major: string) 
{   
    //if CS major (want user input for this):
    //const dag = new REQPATH("CS");

    //if DS major (want user input for this):
    //const dag = new REQPATH("DS");

    //if MA (pure trakc) major (want user input for this):
    //const dag = new REQPATH("MA");

    const dag = new REQPATH(major);
    //const dag = new REQPATH("CS");

    const coursesTakenList = coursesTaken.split(" ");
    for (const course of coursesTakenList) {
        if (dag.DAG[course]) {
            delete dag.DAG[course]
        }
    }

    const topologicalOrder = dag.topologicalSort();
    //console.log(dag.topologicalSort());

    //setting list of terms with each list being a term itself
    /*const terms: Array<string[]> = [];
    for (let i = 0; i < termsLeft; i++) {
        terms.push([]);
    }
    //keeps track of 'end' of the list of terms
    const end = terms.length - 1;*/

    //prereq dict:
    const prereqs = dag.prereq;
    //console.log(JSON.stringify(prereqs));
    let maxReqsPerTerm = 2;
    let schedule;
    let errorCount = 0;

    //using a while loop to account for overloading, adjusting based on how many terms left
    while(maxReqsPerTerm <= 4)
    {
        //using function to sort into terms, testing for errors
        try
        {
            schedule = sortIntoTerms(topologicalOrder, termsLeft, prereqs, maxReqsPerTerm);
            break;
        }
        catch
        {
            if (errorCount < 2)
            {
                maxReqsPerTerm += 1;
                errorCount += 1;
                continue;
            }
            else
            {
                schedule = "No"
                break;
            }
        }
    }

    //after generating a schedule, if the schedule is valid/possible, add 'optional' to empty courses
    if (typeof schedule == 'string' && schedule == "No")
    {
        //display console error
        console.error("You cannot graduate in that number of terms :(");
        return "";
    }
    else if (Array.isArray(schedule))
    {
        //if schedule populated correctly --> fill empty slots (4 classes per term) with "optional"
        for(let x = 0; x < schedule.length; x++)
        {
            while(schedule[x].length < 4)
            {
                schedule[x].push("optional");
            }
        }
        //return results
        //console.log(JSON.stringify(schedule));
        return JSON.stringify(schedule);
    }
    else
    {
        console.error("Invalid schedule format");
        return "";
    }
}
