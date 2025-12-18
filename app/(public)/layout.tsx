import { Footer } from "@/components/landingPage/Footer";
import PublicNavbar from "@/components/landingPage/PublicNavbar";
import React from "react";

export default function publicLayout ({children}: {children: React.ReactNode}) {
   return (
           <div>
            <PublicNavbar/>
               <main>
                   {children}
               </main>
               <Footer/>
           </div>
       );
}