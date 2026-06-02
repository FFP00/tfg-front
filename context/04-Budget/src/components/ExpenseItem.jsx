import { MdEdit, MdDelete } from "react-icons/md";

export default function ExpenseItem({ expense, handleDelete}){

  const { id, charge, amount } = expense;

  return (
    <li className="item">
      <div className="info">
        <span className="expense">{charge}</span>
        <span className="amount">{amount}€</span>
      </div>
      <div>
        <button className="clear-btn" onClick={() => handleDelete(id)}><MdDelete /></button>
      </div>
    </li>
  );
}