/* 
    i. This is the generative algorithm used to create the schedule based on the student's input
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
*/

//database access
import { sendQuery } from "./dbclient";

/**
     * Class that eventually holds a DAG of all the required courses for the selected major (based off of user input and class info from database)
     * This is necessary because we need something to 'hold' our working DAG
     * @returns specific graphs as well as a prereq datastructure for the graphs
     */
class MAJOR {
    private graphCS: Record<string, string[]>;
    private graphDS: Record<string, string[]>;
    private graphMA: Record<string, string[]>;
    private initializationPromise: Promise<void>;

    constructor() {
        this.graphCS = {};
        this.graphDS = {};
        this.graphMA = {};

        // Return a promise that resolves when initialization is complete
        this.initializationPromise = this.initGraphs();
    }

    private async initGraphs() {
        // CS Major
        const dagCSQuery = await sendQuery("SELECT ClassNumber, PrereqFor FROM Classes WHERE Major = 'CS'");
        const dagCS: { ClassNumber: string; PrereqFor: string[]; }[] = dagCSQuery.response.map((item: { ClassNumber: string; PrereqFor: string; }) => ({
            ClassNumber: item.ClassNumber,
            PrereqFor: JSON.parse(item.PrereqFor)
        }));
        // Math Major
        const dagMathQuery = await sendQuery("SELECT ClassNumber, PrereqFor FROM Classes WHERE Major = 'MA'");
        const dagMath: { ClassNumber: string; PrereqFor: string[]; }[] = dagMathQuery.response.map((item: { ClassNumber: string; PrereqFor: string; }) => ({
            ClassNumber: item.ClassNumber,
            PrereqFor: JSON.parse(item.PrereqFor)
        }));
        // DS Major
        const dagDSQuery = await sendQuery("SELECT ClassNumber, PrereqFor FROM Classes WHERE Major = 'DS'");
        const dagDS: { ClassNumber: string; PrereqFor: string[]; }[] = dagDSQuery.response.map((item: { ClassNumber: string; PrereqFor: string; }) => ({
            ClassNumber: item.ClassNumber,
            PrereqFor: JSON.parse(item.PrereqFor)
        }));

        // All reduce functions "translate" the array of objects into a Record<string, string[]>, which resembles a python dictionary
        // CS Graph
        this.graphCS = dagCS.reduce((acc: any, item) => {
            acc[item.ClassNumber] = item.PrereqFor;
            return acc;
        }, {});
        // Math Graph
        this.graphMA = dagMath.reduce((acc: any, item) => {
            acc[item.ClassNumber] = item.PrereqFor;
            return acc;
        }, {});
        // DS Graph
        this.graphDS = dagDS.reduce((acc: any, item) => {
            acc[item.ClassNumber] = item.PrereqFor;
            return acc;
        }, {});
    }

    _getGraphCS() {
        // Helper function returning the CS graph
        return this.graphCS;
    }
    _getGraphDS()
    {
        // Helper function returning the DS graph
      return this.graphDS;
    }
    _getGraphMA()
    {
        // Helper function returning the MA graph
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

    /**
     * Function that checks if initialization promise is resolved.
     * This is necessary because we don't want the code to move on before the graphs are populated
     * as sending database queries is an asynchronous function
     * @returns A promise that resolves when initialization is complete
     */
    getInitializationPromise() {
        return this.initializationPromise;
    }
}

/**
     * Class for initializing a graph based on the major selected and performing topological sort on DAG
     * This is necessary because we need a way to tell the Major class which DAG it should grab from the database
     * @returns topological sorted path of the working DAG
     */
class REQPATH {
    DAG: Record<string, string[]> = {};
    prereq: Record<string, string[]> = {};
    majorInstance: MAJOR | null = null; // Store MAJOR instance

    // Class for getting a valid path depending on the dag given by the chosen major
    // Similar to constructor, but getting graph data from database is an async function so must run init on class before using it
    async init(major: string) {
        const m = new MAJOR();
        await m.getInitializationPromise(); // Waits for MAJOR class to finish populating its graphs with data from database before moving on

        if (major === "CS") {
            this.DAG = m._getGraphCS();
            this.prereq = m._getPrereq(major);
        } else if (major === "DS") {
            this.DAG = m._getGraphDS();
            this.prereq = m._getPrereq(major);
        } else if (major === "MA") {
            this.DAG = m._getGraphMA();
            this.prereq = m._getPrereq(major);
        }

        this.majorInstance = m; // Store the MAJOR instance for later use
    }

    topologicalSort() {
        // Topologically sorts DAG using recursion; looks at each node and then uses visit to check the children nodes
        const visited: Record<string, boolean> = {};
        const topologicalOrder: string[] = [];

        //initiates the top sort, using the visit function as a helper for the recursive alg
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
    //function that sorts courses from path into terms based off of how many terms user inputs, the topsort, the prereqs, and the max courses per term

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

/**
 * Runs the generative algorithm and creates a suggested schedule for the student
 * @param termsLeft Number of terms a student has left to take (maximum 12)
 * @param coursesTaken Courses a student has already taken, formatted as a string
 * with each class separated by a space and each class matching the class number in database
 * @param major The major abbreviation the student is in: CS, MA, or DS as of now
 * @returns A promise that will resolve into a string of a 2D array, 
 * each 1D array in 2D array being one term and each element in the 1D array being a string of a class
 */
export async function runGenAlg(termsLeft: number, coursesTaken: string, major: string) 
{   
    //runs the generative algorithm connecting all the code and ending with a schedule or warning

    //initiates new DAG and path based off of the user's input
    const dag = new REQPATH();
    await dag.init(major); // Wait for initialization to complete

    //delete terms the user inputs they have already taken from the DAG
    const coursesTakenList = coursesTaken.split(" ");
    for (const course of coursesTakenList) {
        if (dag.DAG[course]) {
            delete dag.DAG[course]
        }
    }

    //topologically sorts the 'new' DAG into a valid path
    const topologicalOrder = dag.topologicalSort();
    //console.log(dag.topologicalSort());

    //prereq dict:
    const prereqs = dag.prereq;
    
    //necessary variables for testing max number of courses allowed per each term
    let maxReqsPerTerm = 2;
    let schedule;
    let errorCount = 0;

    //using a while loop to account for overloading, adjusting based on how many terms left
    while(maxReqsPerTerm <= 4)
    {
        //using function to sort into terms, testing for errors
        try
        {   //if works with no error --> this is final schedule
            schedule = sortIntoTerms(topologicalOrder, termsLeft, prereqs, maxReqsPerTerm);
            break;
        }
        catch
        {
            //error caught, either cannot make schedule or try again with more courses per term
            if (errorCount < 2)
            {
                //haven't reached max of 4 courses per term --> continue trying more courses per term
                maxReqsPerTerm += 1;
                errorCount += 1;
                continue;
            }
            else
            {
                //maxxed out number of courses per term --> schedule cannot be created
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
        return JSON.stringify(schedule);
    }
    else
    {
        console.error("Invalid schedule format");
        return "";
    }
}
