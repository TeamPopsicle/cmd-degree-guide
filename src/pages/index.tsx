import Navbar from "@/components/Navbar/Navbar";
import { useState } from "react";
import { SelectedPage } from "../shared/types";

export default function Home() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);

  return (
    <div className="app bg-[rgb(251,244,207)]">
      <Navbar
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
    </div>
  );
}
