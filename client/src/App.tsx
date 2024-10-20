import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";


import BudgetsPage from "./pages/BudgetsPage";
import BudgetsCreate from "./component/Budget/BudgetCreate"

import AccountsPage from "./pages/AccountsPage";
import AccountCreate from "./component/Account/AccountCreate";


import Expenses from "./pages/ExpensePage";
import ExpenseCreate from "./component/Expense/ExpenseCreate";

import IncomesPage from "./pages/IncomesPage";
import IncomeCreate from "./component/Income/IncomeCreate";

import RecurringTransactionsPage from "./pages/RecurringTransactionsPage";
import Login from "./component/User/Login";
import Register from "./component/User/Register";
import NotFound from "./component/Extra/NotFound";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Budgets */}
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/budgets/create" element={<BudgetsCreate />} />

        {/* Account routes */}
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/accounts/create" element={<AccountCreate />} />

        {/* Expense  */}
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/create" element={<ExpenseCreate />} />

        {/* Incomes */}
        <Route path="/incomes" element={<IncomesPage />} />
        <Route path="/incomes/create" element={<IncomeCreate />} />


        <Route path="/recurring-transactions" element={<RecurringTransactionsPage />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
