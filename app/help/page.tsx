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
        "The banker ensures that everyone has the properties and funds they should. In the event that a user cannot conduct a deal or payout peer to peer, the banker exists to facilitate said transaction. They should also track who is buying what given the event history and eliminate any inconsistencies with the live game.",
    },
    {
      value: "item-2",
      title: "What is the purpose of E-Money?",
      description:
        "E-Money is a digital companion for playing Monopoly. It helps keep track of everyone's money and property so you don’t have to mess with cash or cards. Less arguing, more playing.",
    },
    {
      value: "item-3",
      title: "Do I need an account to play?",
      description:
        "Nope! Just create or join a room using a code. It's fast and anonymous — perfect for game night.",
    },
    {
      value: "item-4",
      title: "Can I trade directly with other players?",
      description:
        "Yes. E-Money supports peer-to-peer trades for both properties and funds. The banker only steps in when necessary.",
    },
    {
      value: "item-5",
      title: "Does E-Money follow official Monopoly rules?",
      description:
        "By default yes. Max of 32 houses, 12 hotels, start with $1500, etc. But you can change this and in the future much more. E-Money won’t stop you.",
    },
    {
      value: "item-6",
      title: "Can I undo a mistake?",
      description:
        "Not yet, but undo support is planned. For now, the banker can manually fix most issues — just track the event log and correct anything that went sideways.",
    },
    {
      value: "item-7",
      title: "What happens if someone leaves the room?",
      description:
        "If a player leaves, their assets remain in the game unless the banker removes them. In the future, we may support AI or auto-bank takeover.",
    },
    {
      value: "item-8",
      title: "Is this secure? Do you store any personal info?",
      description:
        "No accounts means no data tied to you. We don’t store personal information. Rooms and player data are temporary — once the game’s done, it's wiped.",
    },
    {
      value: "item-9",
      title: "Can I play across devices?",
      description:
        "Yep. As long as everyone has the room code, they can join from any device — phone, tablet, laptop, whatever. Just don’t refresh mid-deal.",
    },
    {
      value: "item-10",
      title: "Why not just use paper money?",
      description:
        "You *could*… if you love counting bills, sorting stacks, fixing mistakes, and arguing over who paid what. But E-Money exists to keep the fun and ditch the chaos.",
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
          {questions.map(
            (
              question: { value: string; title: string; description: string },
              index: number,
            ) => (
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
            ),
          )}
        </Accordion>
      </div>
    </>
  );
};
export default HelpPage;
