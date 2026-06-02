import spinner from "../modules/Spinner.module.css";

import { FaSpinner } from "react-icons/fa";

export default function Spinner() {
  return (
    <div className={spinner.spinner}>
      <FaSpinner className={spinner.spinning} size={60} />
    </div>
  );
}
