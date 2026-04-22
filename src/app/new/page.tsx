import { LeftNav } from "@/components/LeftNav";

export default function NewEntryPage() {
  return (
    <div className="flex flex-col">
      <LeftNav />
      <form action="" className="mx-auto pt-[80px] sm:w-[500px]">
        <input type="text" placeholder="Title" className="border-b w-full" />
        <input type="text" placeholder="Your entry here" className="pt-10" />
      </form>
    </div>
  );
}
