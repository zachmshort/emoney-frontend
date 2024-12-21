import Link from "next/link";

const CustomButton = ({ text, href = "" }: { text: string; href?: string }) => {
  return (
    <>
      <Link
        href={`${href}`}
        className={`border font rounded-lg p-4 border-yellow-200 w-64  text-2xl`}
      >
        {text}
      </Link>
    </>
  );
};

export default CustomButton;
