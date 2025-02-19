// ! SSG
// import { RenderingInfo } from '#/ui/rendering-info';
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  // Generate two pages at build time and the rest (3-100) on-demand
  return [{ id: "1" }, { id: "2" }];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  if (Number(params.id) >= 100) {
    notFound();
  }

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`,
  );
  const data = (await res.json()) as { title: string; body: string };

  const isOnDemand = Number(params.id) >= 3;

  return (
    <div className='gap-x-6 gap-y-3 grid grid-cols-6'>
      <div className='space-y-3 col-span-full lg:col-span-4'>
        <h1 className='font-medium text-2xl text-gray-200 truncate capitalize'>
          {data.title}
        </h1>
        <p className='line-clamp-3 font-medium text-gray-500'>{data.body}</p>
      </div>
      <div className='-order-1 lg:order-none col-span-full lg:col-span-2'>
        {/* <RenderingInfo type={isOnDemand ? 'ssgod' : 'ssg'} /> */}
        {isOnDemand ? "ssgod" : "ssg"}
      </div>
    </div>
  );
}
