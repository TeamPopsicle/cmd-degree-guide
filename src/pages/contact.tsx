/*
    i. a statement of what it represents or implements,
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
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