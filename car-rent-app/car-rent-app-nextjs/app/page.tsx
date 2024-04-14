import Image from "next/image";
import { Header} from "@/components/Header";
import { Hero } from "@/components/Pages/Homepage/Hero";
import { Footer } from "@/components/Footer";
import { Blog } from "@/components/Pages/Homepage/Blog"
import { Content } from "@/components/Pages/Homepage/Content"
import { Contact } from "@/components/Pages/Homepage/Contact"
import { Vehicles } from "@/components/Pages/Homepage/Vehicles";
import { Newsletter } from "@/components/Pages/Homepage/Newsletter";
import { Featured } from "@/components/Pages/Homepage/Featured";



export default function  () {
  return (
      <>
        <Header />
            <Hero />
            <Featured />
            <Content />
            <Blog />
            <Vehicles />
            <Newsletter />
            <Contact />
        <Footer />
      </>
  );
}
