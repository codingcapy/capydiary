import { LeftNav } from "@/components/LeftNav";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <LeftNav />
      <div className="flex justify-center items-center h-screen">
        <Link href={"/new"} className="bg-teal-500 px-3 py-2 rounded text-2xl">
          New Entry
        </Link>
      </div>
    </div>
  );
}
