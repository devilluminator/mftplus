"use client";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  UserRoundCheckIcon,
  SquareChartGanttIcon,
  MessageSquareText,
} from "lucide-react";
// 📘 little bit routing animation with motion
import { AnimatePresence, motion } from "motion/react";
import navbarTabs from "./admin-navbar-tabs.json";
import React from "react";
import Link from "next/link";

function AdminNavbar() {
  const pathname = usePathname();
  return (
    <nav className='md:top-3 bottom-0 z-[21] fixed md:sticky backdrop-blur-sm px-0 md:px-3 border rounded-md w-full md:w-[120px] min-w-[120px] h-auto md:h-full'>
      <ul className='flex flex-row md:flex-col justify-start items-start rtl'>
        <AnimatePresence>
          {navbarTabs.map((item) => (
            <motion.li
              key={item.name}
              className='my-[7px]'
              whileHover={{
                opacity: item.link === pathname ? 1 : 0.75,
              }}>
              <Link
                href={item.link}
                className='relative flex justify-start items-center gap-1 mx-[0.33rem] md:mx-0 p-1'>
                {item.icon === "LayoutDashboardIcon" && (
                  <LayoutDashboardIcon className='w-5 h-5' />
                )}
                {item.icon === "UserRoundCheckIcon" && (
                  <UserRoundCheckIcon className='w-5 h-5' />
                )}
                {item.icon === "SquareChartGanttIcon" && (
                  <SquareChartGanttIcon className='w-5 h-5' />
                )}
                {item.icon === "MessageSquareText" && (
                  <MessageSquareText className='w-5 h-5' />
                )}
                <span className='z-[1]'>{item.name}</span>
                {item.link === pathname ? (
                  <motion.span
                    layoutId='block'
                    id='block'
                    initial={{ height: "30%", scale: 0.6 }}
                    animate={{
                      height: pathname === item.link ? "99%" : "30%",
                      scale: pathname === item.link ? 1 : 0.6,
                    }}
                    className='bottom-0 left-0 -z-[1] absolute bg-blue-300 dark:bg-blue-600 rounded-sm w-full'
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}

export default AdminNavbar;
