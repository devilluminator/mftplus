import React, { JSX } from "react";

import Search from "./search";
import RegisterDialog from "./register-dialog";
import Navbar from "./navbar";

function Header(): JSX.Element {
  return (
    <header className='top-0 z-30 sticky flex md:flex-col justify-between items-center gap-1 md:gap-3 bg-white dark:bg-zinc-950 shadow-md p-3 border rounded-md container'>
      <div className='flex justify-between items-center gap-1 md:gap-3 w-full rtl'>
        <h1 className='hidden md:block font-extrabold text-xl md:text-3xl'>
          هرچـــے
        </h1>
        <Search className='ml-auto' />
        <RegisterDialog />
      </div>
      <Navbar />
    </header>
  );
}

export default Header;
