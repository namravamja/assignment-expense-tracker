import TransactionGraph from "../components/transactions/TransactionGraph";

const Expenses = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center py-6">
        <TransactionGraph />
      </div>
    </>
  );
};

export default Expenses;
