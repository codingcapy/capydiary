import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col p-2 pt-[100px]">
      <div className="text-center">
        <div className="text-4xl">CapyDiary</div>
        <div className="my-5 text-teal-500">Your diary. Your memories.</div>
      </div>
      <Link
        href={"/login"}
        className="mx-auto my-10 bg-gray-900 px-5 py-3 text-xl border border-teal-500 rounded"
      >
        Get Started
      </Link>
    </div>
  );
}
