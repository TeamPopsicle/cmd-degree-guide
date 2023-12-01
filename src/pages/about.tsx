/*
    i. About page
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
*/

import Navbar from "@/components/Navbar/Navbar";

export default function About() { 

    return ( 
        <> 
            <Navbar/> 
            <h1> About the CMD Degree Guide </h1> 
            <div className="displayBox">
                <p> The CMD degree guide was built as an alternative to the current University of Oregon degree guide system. Compared to the previous solution,
                    our system aims to enhance user experience by improving the readability and accessibility of the information. The CMD degree guide 
                    uses a tabular layout to display information in a streamlined, simplified format. <br/> <br/>  
                    The CMD degree guide currently offers support for the Computer Science, Mathematics, and Data Science majors, for classes taken during Fall, Winter, 
                    and Spring terms. The system is built to accomodate the addition of additional majors and Summer courses.
                </p>
            </div>
        </>
    ) 

}