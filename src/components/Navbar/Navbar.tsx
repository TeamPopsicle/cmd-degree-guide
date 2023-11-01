import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { SelectedPage } from "@/shared/types";
import useMediaQuery from "@/hooks/useMediaQuery";
import Link from 'next/link';

/* Redesigned the navbar as a set of page links. Currently they link to blank pages. 

    TODO: 
        - Write About page 
        - Write contact info 
        - Fix Navbar styles */ 

/* 
type Props = {
    selectedPage: SelectedPage;
    setSelectedPage: (value: SelectedPage) => void;
};

*/ 


export default function Navbar({ selectedPage, setSelectedPage }: Props) {
    const flexBetween = "flex items-center justify-between";
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

    return <nav>
        <div
            className={`${flexBetween} fixed top-0 z-30 w-full py-6`}
        >
            <div className={`${flexBetween} mx-auto w-5/6`}>
                <div className={`${flexBetween} w-full gap-16`}>
                    {/*LEFT SIDE*/}


                    {/* RIGHT SIDE */}
                    {isAboveMediumScreens ? (
                        <div className={`${flexBetween} w-full`}>
                            <div className={`${flexBetween} gap-8 text-sm`}>
                                <Link href="/">Home</Link>
                                <Link href="/about">About</Link>
                                <Link href="/contact">Contact Us</Link>

                            </div>
                        </div>)
                        : (
                            <button
                                className="rounded-full bg-green-800 p-2"
                                onClick={() => setIsMenuToggled(!isMenuToggled)}
                            >
                                <Bars3Icon className="h-6 w-6 text-white" />
                            </button>
                        )}
                </div>
            </div>

        </div>

    </nav>;
};
