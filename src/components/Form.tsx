export default function Form( {name} : {name: string} ) { 

    /* 
    STILL NEEDED: A way to display an appropriate error message when login is unsuccessful. 

    This is a rough and ugly form component which uses static HTML. In this implementation, 
    the <form> element tracks its own internal state, so the DOM handles the input data. We 
    could modify this implementation to use component states for tracking inputs instead,
    which is more in line with React best practices. For now, though, I just wanted to focus 
    on making something that I knew for sure would work, as simply and quickly as possible. 
    Since the implementation is modular, I don't *think* changing this would affect the implementation of 
    the pages or the form handler, so it should be fine if we want to change it later. 
    
    The URL of the form handler program is passed in as the value of the "action" attribute. This will be static 
    if we only have one form handler with conditional behavior, or dynamic if we have multiple form handlers based
    on the form handler. 

    The "name" attribute of the form is intended for use by a multi-purpose form handler, to determine what the form 
    handler should do with the data. If there are multiple form handlers, this attribute is irrelevant. 

    -H
    */ 
    return ( 
    <>
        <form action="" name={name}> 
            <label>Username:</label>
            <p><input name="username"/></p>
            <label>Password:</label>
            <p><input name="password"/></p> 
            <button type="submit">Submit</button>
        </form> 
    </>
    ) 
};