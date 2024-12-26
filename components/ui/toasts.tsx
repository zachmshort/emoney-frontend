import { toast } from "sonner";
import { josephinBold, josephinNormal } from "./fonts";
import { ReactNode } from "react";

interface ToastProps {
  message: string;
  details?: string;
  type?: "error" | "success" | "info" | "warning";
  icon?: ReactNode;
}

const Toast = ({ message, details, type = "error", icon }: ToastProps) => {
  const toastContent = (
    <div className="flex items-center gap-2">
      {icon && <span className="icon">{icon}</span>}
      <div>
        <p className={`${josephinBold.className}`}>{message}</p>
        {details && (
          <p className={`text-sm text-gray-400 ${josephinNormal.className}`}>
            {details}
          </p>
        )}
      </div>
    </div>
  );

  switch (type) {
    case "success":
      toast.success(toastContent, { duration: 4000 });
      break;
    case "info":
      toast.info(toastContent, { duration: 4000 });
      break;
    case "warning":
      toast.warning(toastContent, { duration: 4000 });
      break;
    default:
      toast.error(toastContent, { duration: 4000 });
      break;
  }
};

export default Toast;
