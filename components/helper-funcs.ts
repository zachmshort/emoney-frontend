const getButtonText = (type: string) => {
  switch (type) {
    case "SEND":
      return "Send";
    case "REQUEST":
      return "Request";
    case "ADD":
      return "Add";
    case "SUBTRACT":
      return "Subtract";
    default:
      return "";
  }
};
export { getButtonText };
