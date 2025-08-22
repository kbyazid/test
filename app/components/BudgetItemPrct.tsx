import { Budget } from "@/type"
import { formatCurrency} from '@/lib/utils'

interface BudgetItemProps {
    budget: Budget;
    enableHover?: number;
    depenseColor?: string; // Nouvelle prop optionnelle pour la couleur
}

/* const BudgetItem: React.FC<BudgetItemProps> = ({ budget , enableHover, depenseColor = "text-gray-500"}) => { */
const BudgetItemPrct = ({ budget, enableHover }: BudgetItemProps) => {
    const transactionCount = budget.transaction ? budget.transaction.length : 0;
    const totalTransactionAmount = budget.transaction
        ? budget.transaction.reduce(
            (sum, transaction) => sum + transaction.amount, 0)
        : 0
    const percentage = Math.min(Math.round((totalTransactionAmount / budget.amount) * 100), 100);
    const remainingAmount = budget.amount - totalTransactionAmount

/*     const progressValue =
        totalTransactionAmount > budget.amount
            ? 100
            : (totalTransactionAmount / budget.amount) * 100 */
    
    const hoverClasse = enableHover === 1 ? "hover:shadow-xl hover:border-accent" : "";

    function getPercentageClass(percentage: number) {
        const baseClasses = "text-xs font-medium rounded-full px-2 py-0.5 ml-auto ";
        
        if (percentage >= 100) return `${baseClasses} bg-red-50 text-red-600`;
        if (percentage >= 80) return `${baseClasses} bg-amber-50 text-amber-600`;
        return `${baseClasses} bg-green-50 text-green-600`;
      }

      function getDepenseColor(percentage: number) {  
        if (percentage >= 100) return `text-red-600 font-bold`;
        if (percentage >= 80) return `text-amber-600 font-bold`;
        return `font-medium text-red-500` ;
      }

    return (
        <li key={budget.id} className={`p-4 rounded-xl border-2 border-base-300 list-none ${hoverClasse} `}>
            <div className="flex items-center justify-between">
                <div className="flex items-center mb-4">
                    <div className="bg-accent/20 text-xl h-10 w-10 rounded-full flex justify-center items-center">
                        {budget.emoji}
                    </div>
                    <div className="flex flex-col ml-3">
                        <span className="font-bold text-xl">{budget.name}</span>
                        <span className="text-gray-500 text-sm">
                            {transactionCount} transaction(s)
                        </span>
                    </div>
                </div>
                {/* <div className="text-xl font-bold text-accent">{budget.amount} Da</div> */}
                {/* <div className="flex items-center">
                    <div className="flex flex-col ml-3">
                        <span className="font-bold text-green-600">{formatCurrency(budget.amount)}</span>
                        <span className={getPercentageClass(percentage)}>
                            {percentage}%
                        </span>
                    </div>
                </div> */}
            </div>

{/*             <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
                <span className={getDepenseColor(percentage)}>{formatCurrency(totalTransactionAmount)} dépensés</span>
                <span>{formatCurrency(remainingAmount)} restants</span>
            </div> */}
            
                <div className="flex justify-between">
                    <span className="font-bold text-green-600">{formatCurrency(budget.amount)}</span>
                    <span className={getPercentageClass(percentage)}>
                            {percentage}%
                        </span>
                </div>

{/* au choix cette facon  */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                    className={`h-full ${percentage >= 80 ? "bg-red-500" : "bg-accent"
                        }`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

{/* ou celle ci */}
{/*             <progress
                className="progress progress-accent w-full h-3"
                value={progressValue}
                max="100"
            ></progress>  */}

            
            <div className=" grid grid-cols-2 gap-4 mt-4">
                <div>
                    <p className="text-sm text-gray-500">Dépensés</p>
                    <p className={getDepenseColor(percentage)}>{formatCurrency(totalTransactionAmount)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Restants</p>
                    <p className="font-medium text-green-500">{formatCurrency(remainingAmount)}</p>
                </div>
            </div>
{/*              <div>
                <progress className="progress progress-accent w-full mt-4" value={progressValue} max="100"></progress>
            </div> */}

        </li>
    )
};

export default BudgetItemPrct;