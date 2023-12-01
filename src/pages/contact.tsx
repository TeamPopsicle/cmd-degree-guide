/*
    i. a statement of what it represents or implements,
    ii. the group name,
    iii. the names of all authors (alphabetically by last name),
    iv. the product’s author information should be clear, i.e., what each
        component is or implements, who created or last updated it, and
        when.
*/

import Navbar from "@/components/Navbar/Navbar";


export default function Contact() { 

    return ( 
        <> 
            <Navbar/> 
            <h1>Contact the Developers</h1> 
            <div className="displayBox">
                <p>Ethan Cha: echa@uoregon.edu</p>
                <p>Peyton Elebash: peytone@uoregon.edu</p>
                <p>Haley Figone: hfigone@uoregon.edu</p>
                <p>Yaya Yao: peijiay@uoregon.edu</p> 
            </div> 
        </>
    ) 

}