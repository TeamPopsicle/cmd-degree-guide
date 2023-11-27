#old way of accessing prereqs:
#prereqs = {'210': [''], '211': ['210'], '212': ['211'], '231': [''], '232': ['231'], '313': ['212', '232'], '314': ['212'], '315': ['313'], '422': ['315'], '415': ['330'], '330': ['314'], '425': ['315'], 'mathseries1': [''], 'mathseries2': ['mathseries1'], 'mathelective1': ['mathseries2'], 'mathelective2': ['mathseries2'], 'writing': [''], 'scienceseries1': [''], 'scienceseries2': ['scienceseries1'], 'scienceseries3': ['scienceseries2']}

class CS:
    #class for the CS major --> holds a DAG of all the required 'core' courses for major
    def __init__(self):
        '''self.graph = {"210": ["211"],
                      "211": ["212"], 
                      "212": ["313", "314"],
                      "231": ["232"], 
                      "232": ["313"], 
                      "313": ["315"], 
                      "315": ["425", "422"],
                      "314": ["330"],
                      "330": ["415"], 'mathseries1': ['mathseries2'], 
                      'mathseries2': ['mathelective1', 'mathelective2'],  
                      'scienceseries1': ['scienceseries2'], 
                      'scienceseries2': ['scienceseries3'], 'writing': []
                      }'''
        self.graph = {
            "CS210": ["CS211"],
            "CS211": ["CS212"],
            "CS212": ["CS313", "CS314"],
            "MA231": ["MA232"],
            "MA232": ["CS313"],
            "CS313": ["CS315", "csElectiveAbove300_1", "csElectiveAbove300_2"],
            "CS315": ["CS425", "CS422", "csElectiveAbove410_1"],
            "CS425": [],
            "CS422": [],
            "CS415": [],
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
          }
    
    def _get_graph(self):
        #helper function returning the graph
        return self.graph
    
    def _get_prereq(self):
        #new way of accessing prereqs --> generates a dict based on the DAG
        #logic: reverse the keys and vals of the DAG and then add in any classes with no prereqs at the end
        prereqs = {}

        #list of DAG keys"
        k = list(self.graph.keys())

        #reverses the DAG dictionary
        for key, val in self.graph.items():
            for vals in val:
                prereqs.setdefault(vals, []).append(key)

        #list of reverse dicts keys:
        reverseKeys = list(prereqs.keys())

        #if key from DAG is not in prereq dict, then it has no prereqs, add it in w/ this value: ['']
        for x in k: 
            if x not in reverseKeys:
                prereqs[x] = ['']
            else:
                continue

        return prereqs
    
class REQPATH:
    #class for getting a valid path depending on the dag given by the chosen major
    def __init__(self, major):
        #checks for the major (rn it's just cs) and retrieves req core courses (DAG) for it
        if major == "CS":
            m = CS()
            self.DAG = m._get_graph()
            self.prereq = m._get_prereq()
        else:
            self.DAG = {}
            self.prereq = {}
    
    def topological_sort(self):
        #topologically sorts DAG using recursion; looks at each node and then uses visit to check the children nodes
        visited = {}
        topological_order = []
        for node in self.DAG:
            if node not in visited:
                self.visit(node, visited, topological_order)
        return topological_order

    def visit(self, node, visited, topological_order):
        #recursive function that marks nodes as visited and enacts a DFS of each nodes children
        visited[node] = True
        if node in self.DAG:
            for child in self.DAG[node]:
                if child not in visited:
                    self.visit(child, visited, topological_order)
        topological_order.insert(0, node)

#initializing a graph for CS major
dag = REQPATH("CS")

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

#print(dag.DAG)
#for x in dag.DAG:
    #print(x,":", dag.DAG[x])

#top sort enacted:
topological_order = dag.topological_sort()
#print(topological_order)

#is there more efficient way to do this? dont rlly remember?
terms = []
for i in range(termsLeft):
    terms.append([])


#keeps track of the 'end' of the list of terms (usefull for sorting alg)
end = len(terms) - 1

#retrieving the dict of prereqs
prereqs = dag.prereq

#loops through each of the courses in the generated path (what top sort returned)
try:
    for course in topological_order:

        #get the list of prereqs for each term
        prereq = prereqs.get(course, [])
        
        #startTerm is going to hold the 'first' valid term
        #currentTerm lets us iterate through all of the terms, checking for prereqs in each one
        startTerm = 0
        currentTerm = 0

        #loop usually runs only once, but necessary for courses with multiple prereqs
        for p in prereq:

            #alg getting a valid term (no prereqs in that term or future terms) to store current course:
            while True:

                #if CT is at the end of the list break out of loop (looked at all terms)
                if currentTerm > end:
                    break
                #if the prereq is in the current term, increase CT and set ST = CT (term after the term with the prereq)
                if p in terms[currentTerm]:
                    currentTerm += 1
                    startTerm = currentTerm
                #if the prereq isnt in the current term, iterate through to the next term
                else:
                    currentTerm += 1
                
            #this is only important if we have multiple prereqs, we set CT = ST, since we know ST is the valid term for first prereq, we dont have to start at beginning of list, start at this term
            currentTerm = startTerm

        #this checks to make sure all terms are limited to 4 classes 
        if len(terms[startTerm]) >= 4:
            index = 1
            while True:
                if len(terms[startTerm + index]) < 4:
                    terms[startTerm + index].append(course)
                    break
                else:
                    index += 1
        else:
            terms[startTerm].append(course)
        #bug here now with new reqs added --> need to check at end that everything is valid?
        

    """#once we have a system for prereqs for cs elective, won't have to worry about the below alg:

    #cs elective system (for now) --> need 5 classes, 3 above 410
    #can't take these until pass 212, might even be higher
    electiveAbove = ['electiveAbove410', 'electiveAbove410', 'electiveAbove410']
    electiveBelow = ['electiveBelow410', 'electiveBelow410']
    idx = 0
    for x in terms: 
        if '212' in x:
            break
        else:
            idx += 1
    
    start = idx + 1
    while True:
        if len(terms[start]) < 4:
            if electiveBelow != []:
                terms[start].append(electiveBelow[0])
                electiveBelow.remove('electiveBelow410')
            elif electiveAbove != []:
                terms[start].append(electiveAbove[0])
                electiveAbove.remove('electiveAbove410')
            else:
                break
        else:
            start += 1"""
                   
    print(terms)


#max 2 cs courses 
#max 1 math courses

except Exception as e:
    #this is for catching index errors--> meaning not enough terms for classes left 
    print("you cannot graduate in that number of terms fool :(")
    print(e)

#to do: 
#add check at the end, going through each term, restricting number of math and cs courses
#max 4 courses per term
#add in to account for cs electives--> not sure how to do this w/o list, maybe where drop-in comes in handy

#figure out prerequisite system for cs electives (drop down here so tricky)
#figure out how to limit and what to limit in terms of course type or difficulty
    #for example, maybe make only one 300 level and 400 level per term OR 2 CS and 1 MA per term

#turn dag into list of prereqs! --> done