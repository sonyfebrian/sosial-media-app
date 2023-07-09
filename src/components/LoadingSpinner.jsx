import { VscRefresh } from "react-icons/vsc";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center p-2">
      <VscRefresh className="animate-spin w-10 h-10" />
    </div>
  );
};

export default LoadingSpinner;
