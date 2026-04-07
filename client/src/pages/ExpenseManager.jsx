import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, DollarSign, Wallet, ArrowRight, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const ExpenseManager = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tripRes, expenseRes] = await Promise.all([
          api.get(`/trips/${id}`),
          api.get(`/trips/${id}/expenses`)
        ]);
        setTrip(tripRes.data);
        setExpenses(Array.isArray(expenseRes.data) ? expenseRes.data : []);
      } catch (err) {
        console.error('Error fetching ledger data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const description = e.target.description.value;
    const amount = Number(e.target.amount.value);
    const date = e.target.date.value;
    const category = e.target.category.value;

    try {
      const { data } = await api.post(`/trips/${id}/expenses`, {
        description,
        amount,
        date,
        category
      });
      setExpenses([data, ...expenses]);
      setIsAddExpenseOpen(false);
    } catch (err) {
      console.error('Error adding expense:', err);
      alert('Failed to save expense.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-st-primary flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-st-accent animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-st-charcoal/40">Synchronizing Ledger</p>
      </div>
    );
  }

  const actualSpent = Array.isArray(expenses) ? expenses.reduce((acc, curr) => acc + curr.amount, 0) : 0;
  
  // Calculate planned buffer from activities that don't have a matching expense yet
  // For simplicity, we'll just sum all estimates from the itinerary
  const totalPlanned = (trip?.itinerary || []).reduce((acc, day) => {
    return acc + (day.activities || []).reduce((a, act) => a + (act.estimatedCost || 0), 0);
  }, 0);

  const budget = trip?.budget || 2000;
  const forecastTotal = actualSpent + totalPlanned;
  const isOverBudget = forecastTotal > budget;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to={`/trips/${id}`} className="text-gray-500 hover:text-brand-dark flex items-center gap-2 mb-6">
        <ArrowLeft size={16} /> Back to Trip Detail
      </Link>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-2">
            <Wallet className="text-emerald-500" /> Expense Manager
          </h1>
          <p className="text-gray-500 mt-1">Track payments and see exactly who owes whom.</p>
        </div>
        <button 
          onClick={() => setIsAddExpenseOpen(true)}
          className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={20} />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Balances summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-st-charcoal/5 border border-st-charcoal/5 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
               <TrendingUp size={80} className="text-st-charcoal" />
            </div>
            
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-st-charcoal/40 mb-4">Capital Ledger</h3>
            <div className="text-5xl font-black text-st-charcoal tracking-tighter flex items-baseline gap-1">
              <span className="text-2xl text-st-accent font-black">$</span>
              {actualSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            
            <div className="mt-8 space-y-4">
               <div className="flex justify-between items-end">
                  <div className="text-[9px] font-black uppercase tracking-widest text-st-charcoal/30">Forecasted Total</div>
                  <div className={`text-sm font-black ${isOverBudget ? 'text-red-500' : 'text-st-charcoal'}`}>
                    ${forecastTotal.toLocaleString()}
                  </div>
               </div>
               
               <div className="relative h-6 bg-st-secondary rounded-full overflow-hidden border border-st-charcoal/5 p-1">
                  {/* Actual Spent */}
                  <div 
                    className="absolute left-1 top-1 bottom-1 bg-st-charcoal rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (actualSpent/budget)*100)}%`, zIndex: 2 }}
                  ></div>
                  {/* Planned Buffer */}
                  <div 
                    className="absolute left-1 top-1 bottom-1 bg-st-accent/40 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (forecastTotal/budget)*100)}%`, zIndex: 1 }}
                  ></div>
               </div>
               
               <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                  <span className="text-st-charcoal">Actual</span>
                  <span className="text-st-accent">Planned</span>
                  <span className="text-st-charcoal/40">Budget: ${budget}</span>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-brand-dark mb-4">How to Settle Up</h3>
            {balances.length > 0 ? (
              <div className="space-y-4">
                {balances.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="font-semibold text-red-700">{b.from}</div>
                    <div className="flex flex-col items-center flex-1 mx-2">
                      <span className="text-xs font-bold text-gray-500 mb-1 inline-flex items-center">
                        <DollarSign size={10}/>{b.amount}
                      </span>
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                    <div className="font-semibold text-green-700">{b.to}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                You're all settled up!
              </div>
            )}
          </div>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-brand-dark">Detailed Expenses</h3>
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid By</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.isArray(expenses) && expenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-brand-dark">{expense.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {expense.paidBy?.name || 'You'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-dark text-right">
                      <span className="flex items-center justify-end"><DollarSign size={14} className="text-gray-400"/> {expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-brand-dark">Add New Expense</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1">&times;</button>
            </div>
            <form className="p-12 space-y-8" onSubmit={handleAddExpense}>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mb-3 ml-1">Expense Handle</label>
                <input type="text" name="description" required placeholder="E.G. HOTEL RITZ" className="w-full bg-st-secondary border-none rounded-2xl py-5 px-6 focus:ring-4 focus:ring-st-accent/10 font-bold transition-all text-sm uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mb-3 ml-1">Amount ($)</label>
                  <input type="number" name="amount" required step="0.01" placeholder="0.00" className="w-full bg-st-secondary border-none rounded-2xl py-5 px-6 focus:ring-4 focus:ring-st-accent/10 font-bold transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mb-3 ml-1">Category</label>
                  <select name="category" className="w-full bg-st-secondary border-none rounded-2xl py-5 px-6 focus:ring-4 focus:ring-st-accent/10 font-bold transition-all text-sm uppercase">
                    <option value="Misc">Misc</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Activity">Activity</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mb-3 ml-1">Timestamp</label>
                <input type="date" name="date" required className="w-full bg-st-secondary border-none rounded-2xl py-5 px-6 focus:ring-4 focus:ring-st-accent/10 font-bold transition-all" />
              </div>
              <div className="pt-4 flex gap-6">
                <button type="submit" disabled={isSaving} className="w-full py-5 bg-st-charcoal text-st-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-st-accent hover:text-st-charcoal transition-all shadow-xl shadow-st-charcoal/20 flex items-center justify-center gap-3">
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles size={14} />} Finalize Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManager;
