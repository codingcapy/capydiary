import Link from "next/link";

export function LeftNav() {
  return (
    <div className="fixed top-0 left-0 w-[300px] h-screen border-r border-r-gray-600 pt-[80px]">
      <Link href={"/new"} className="block px-3 py-2 bg-teal-500 w-[298px]">
        + New Entry
      </Link>
    </div>
  );
}
