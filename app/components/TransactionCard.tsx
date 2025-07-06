type TransactionCardProps = {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    cardColor?: string; // Nouvelle prop optionnelle pour la couleur
  };

const TransactionCard = ({ label, value, icon, cardColor = "income" }: TransactionCardProps) => {
  return (
      <div className="border-2 border-gray-300 p-5 flex  items-center rounded-xl shadow-md gap-4">
        {/* <div className="card-body flex flex-row items-center gap-4"></div> */}
          <div>
              {icon}
          </div>
          <div className="flex flex-col">
              <span className="text-gray-500  text-sm">{label}</span>
              <span className={`text-xl font-bold ${ cardColor === "income" ? "text-blue-600" : "text-red-600"}`}>
                   {/* On convertit `value` en string avant de le passer à parseFloat */}
                   {/* {parseFloat(String(value)).toFixed(2)} Da   */} 
                   {value}
              </span>
          </div>
          {/* className="bg-accent w-9 h-9 rounded-full p-1 text-white flex items-center justify-center" */}

      </div>
  )
}

export default TransactionCard
