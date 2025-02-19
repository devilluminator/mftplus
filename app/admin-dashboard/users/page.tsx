"use client";
import { usersQueryOptions } from "@/context/user-query";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ShowMoreInfo from "./more-info";
import { Spinner } from "@/components/ui/spinner";

function UsersPage() {
  const { queryFn, queryKey } = usersQueryOptions();
  const { data, refetch, isFetching } = useQuery(queryKey, () => queryFn());
  return (
    <Table className='self-start backdrop-blur-sm mb-[39vh] rtl'>
      <TableCaption className='min-h-[60px]'>
        لیست کاربران - تعداد {data?.data?.users.length}
        <Spinner
          show={isFetching}
          className='text-emerald-600 dark:text-emerald-300'
        />
      </TableCaption>
      <TableHeader>
        <TableRow className='[&>*]:text-right'>
          <TableHead className='w-[60px]'>ID</TableHead>
          <TableHead>Full-Name</TableHead>
          <TableHead>Phone-Number</TableHead>
          <TableHead className='hidden md:table-cell'>Email</TableHead>
          <TableHead className='hidden md:table-cell'>Address</TableHead>
          <TableHead>Access-Level</TableHead>
          <TableHead>More</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data?.users.map((user, index) => (
          <TableRow key={user.id} className='[&>*]:text-right'>
            <TableCell className='font-medium'>{index + 1}</TableCell>
            <TableCell>{user.full_name}</TableCell>
            <TableCell>{user.phone_number}</TableCell>
            <TableCell className='hidden md:table-cell'>{user.email}</TableCell>
            <TableCell className='hidden md:table-cell'>
              {user.address}
            </TableCell>
            <TableCell className='capitalize'>{user.role}</TableCell>
            <TableCell>
              <ShowMoreInfo user={user} refetch={refetch} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default UsersPage;
