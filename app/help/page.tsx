import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { josephinBold, josephinNormal } from "@/components/ui/fonts";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

const HelpPage = () => {
  const questions = [
    {
      value: "item-1",
      title: "What is the role of the banker?",
      description:
        "The banker ensures that everyone has the properties and funds they should. In the event that a user cannot conduct a deal or payout peer to peer, the banker exists to facilitate said transaction.",
    },
  ];

  return (
    <>
      <div className={`overflow-y-auto`}>
        <div className={`h-16 fixed top-0 w-full bg-black border-b`}>
          <div className={`flex items-center justify-between px-2 h-full`}>
            <Link href={`/`}>
              <IoIosArrowBack className={`text-2xl color`} />
            </Link>
            <h1 className={`${josephinBold.className} text-2xl color`}>Help</h1>
            <div />
          </div>
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full fixed bottom-0 text-white"
        >
          {questions.map((question: any, index: number) => (
            <AccordionItem value={question.value} key={index}>
              <AccordionTrigger
                className={`text-whtie ${josephinBold.className} font text-3xl px-6`}
              >
                {question.title}
              </AccordionTrigger>
              <AccordionContent
                className={`color ${josephinNormal.className} text-xl px-6`}
              >
                {question.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};
export default HelpPage;
