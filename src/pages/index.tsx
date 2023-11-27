import Navbar from "@/components/Navbar/Navbar";
import homeLogo from "@/../public/homeLogo.png";
import Image from "next/image";
import Link from 'next/link';

export default function Home() {

  return (
    <>
      <Navbar/>
      <div><h1>Welcome to the CMD Degree Guide.</h1></div>

      <div className="displayBox">
        <Image id="Logo" src={homeLogo} alt="CMD Degree Guide Logo" />
        <div className="actionButton">
          <Link href="/login" id="loginButton">Log In</Link>
        </div> 
        <div className="actionButton"> 
          <Link href="/signup" id="signupButton">Create Account</Link>
        </div>
      </div>
    </>
  );
}
