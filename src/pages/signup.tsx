import Form from "@/components/Form"; 

export default function Signup() { 

    return ( 
        <>
            <h1>Sign Up</h1> 
            <div className="displayBox">
                {/* If we want to tell users about any username/password descriptions, put them here, 
                put them here. */} 
                <Form name="Login"/>
            </div> 
        </>       
    )


}