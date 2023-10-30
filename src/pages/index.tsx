import Navbar from "@/components/Navbar/Navbar";
import { useState } from "react";
import { SelectedPage } from "../shared/types";
import homeLogo from "@/../public/homeLogo.png";
import Image from "next/image";
import Link from 'next/link'; 

export default function Home() {

  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);

  return (
  <>
      <div className="welcomeIn"><h1>Welcome to the CMD Degree Guide.</h1></div> 

      <Navbar
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      /> 

      {/* The Navbar is not fully implemented nor properly styled to go with the rest
      of the page, but it is here. 
      I took the logo and the sign-in/sign-up buttons out of the navbar, because 
      it made more semantic sense to me and fit with the mockup/architecture diagrams 
      I was working from. -H */}

      {/* I could factor these div classes out into components, but seeing as I 
      don't think they'll be reused I'm not sure it's particularly useful to do so. 
      Open to opinions. -H */}
      <div className="displayBox">
        <Image src={homeLogo} alt="CMD Degree Guide Logo"/>
        <div className="actionButton">
          <Link href="/login" id="loginButton">Log In</Link> 
          <Link href="/signup" id="signupButton"> Create Account</Link>
        </div>
      </div>
  </>
  );
}
