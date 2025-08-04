type DashboardCardProps = {
    label: React.ReactNode;
    value: string | number;
    icon?: React.ReactNode;
    
  };

const DashboardCard = ({ label, value, icon  }: DashboardCardProps) => {
  return (
    <div className="border-2 border-gray-300 p-5 flex justify-between items-center rounded-xl">
      <div className="flex flex-col">
        <span className="text-gray-500 font-bold text-xl">{label}</span>
        <span className="text-2xl font-bold text-accent">
          {value}
        </span>
      </div>
      <div className="bg-accent w-9 h-9 rounded-full p-1 text-white flex items-center justify-center">
        {icon}
      </div>
    </div>
  )
}

export default DashboardCard
