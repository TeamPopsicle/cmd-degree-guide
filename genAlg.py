#prereq storage for now:
#less expensive than using the dag and looking for prereqs due to its structure
prereqs = {'210': [''], '211': ['210'], '212': ['211'], '231': [''], '232': ['231'], '313': ['212', '232'], '314': ['212'], '315': ['313'], '422': ['315'], '415': ['330'], '330': ['314'], '425': ['315']}

class CS:
    #class for the CS major --> holds a DAG of all the required 'core' courses for major
    def __init__(self):
        self.graph = {"210": ["211"],
                      "211": ["212"], 
                      "212": ["313", "314"],
                      "231": ["232"], 
                      "232": ["313"], 
                      "313": ["315"], 
                      "315": ["425", "422"],
                      "314": ["330"], 
                      "330": ["415"] 
                      }
    
    def _get_graph(self):
        #helper function returning the graph
        return self.graph
    
class REQPATH:
    #class for getting a valid path depending on the dag given by the chosen major
    def __init__(self, major):
        #checks for the major (rn it's just cs) and retrieves req core courses (DAG) for it
        if major == "CS":
            m = CS()
            self.DAG = m._get_graph()
        else:
            self.DAG = {}
    
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

#simple prompt that asks user for a course they have taken, and removes it from the DAG before enacting top sort
while True:
    ask = input("Enter courses taken (N/A if done):")
    if ask == "N/A":
        break
    else:
        if ask in dag.DAG:
            dag.DAG.pop(ask)

#top sort enacted:
topological_order = dag.topological_sort()
print(topological_order)

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

#top sort enacted:
topological_order = dag.topological_sort()
print(topological_order)

#is there more efficient way to do this? dont rlly remember?
terms = []
for i in range(termsLeft):
    terms.append([])
print(terms)


#keeps track of the 'end' of the list of terms (usefull for sorting alg)
end = len(terms) - 1
print("end: ", end)

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

        #this checks that there aren't more than 2 cs courses per term
        #could see a potential future bug in that it adds to next list, not checking that lists length
        if len(terms[startTerm]) >= 2:
            #once we found a valid term, add the course to corresponding spot in list of terms
            terms[startTerm + 1].append(course)
        else:
            #once we found a valid term, add the course to corresponding spot in list of terms
            terms[startTerm].append(course)
        
    print(terms)

except Exception as e:
    #this is for catching index errors--> meaning not enough terms for classes left 
    print("you cannot graduate in that number of terms fool :(")

#now want to populate the terms so that any of the terms after 314 and 313 can have an elective course
#however, going to limit it for now to only 2 CS courses per term
#in this alg, assuming all are cs, but once working with database, can check for that