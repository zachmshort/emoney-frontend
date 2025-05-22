import Button from "@/components/ui/button-custom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { josephinBold } from "../ui/fonts";

export default function Fallback({
  error,
  title,
  message,
  onRetry,
  goBackHref = "/",
}: {
  error?: any;
  title?: string;
  message?: string;
  onRetry?: () => void;
  goBackHref?: string;
}) {
  const router = useRouter();

  const logo = "";

  const defaultTitle =
    error?.status === 404
      ? "Sorry, we couldn't find this item"
      : "Something went wrong";

  const defaultMessage =
    error?.status === 404
      ? "Please try refreshing if you're sure this exists."
      : "An error occurred while loading the content.";

  const displayTitle = title || defaultTitle;
  const displayMessage = message || defaultMessage;

  return (
    <div
      className={`flex flex-col items-center justify-center px-8 w-full min-h-screen ${josephinBold.className}`}
    >
      <p className={`text-4xl font`}>{displayTitle}</p>

      <p className={`text-sm font`}>{displayMessage}</p>

      {error?.message && (
        <p className={`text-sm mt-2 text-red-500`}>
          Error details: {error.message}
        </p>
      )}

      <div className={`flex-row mt-4 mb-8 `}>
        {onRetry && (
          <Button onClick={onRetry} className="underline text-base mr-4">
            Try Again
          </Button>
        )}

        <Button
          onClick={() => {
            router.push(goBackHref);
          }}
          className="underline text-base"
        >
          Go Back
        </Button>
      </div>

      <div>
        <Image src={logo} alt={logo} />
      </div>
    </div>
  );
}
