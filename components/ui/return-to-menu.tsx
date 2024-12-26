const ReturnToMenu = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`mb-2 border w-full text-center py-2 rounded shadow-xl text-sm`}
    >
      Return to Main Menu
    </button>
  );
};

export default ReturnToMenu;
