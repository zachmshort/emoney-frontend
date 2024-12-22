"use client";
const ButtonAction = ({
  text,
  onClick,
  className,
}: {
  text: string;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <>
      <button
        onClick={onClick}
        className={`border font rounded-lg px-4 py-5 border-yellow-200 w-64  text-2xl ${className}`}
      >
        {text}
      </button>
    </>
  );
};

export default ButtonAction;
