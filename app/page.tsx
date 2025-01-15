import Data from "@/components/Data";
import PageLogin from "@/components/formLogin";
import Image from "next/image";


export default function Home() {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <PageLogin />
      <Data />
    </div>
  );
}
