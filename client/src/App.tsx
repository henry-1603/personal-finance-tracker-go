import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import BudgetsPage from "./pages/BudgetsPage";
import AccountsPage from "./pages/AccountsPage";
import AccountCreate from "./component/Account/AccountCreate";


import Expenses from "./pages/ExpensePage";
import IncomesPage from "./pages/IncomesPage";
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
        <Route path="/budgets" element={<BudgetsPage />} />

        {/* Account routes */}
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/accounts/create" element={<AccountCreate />} />


        <Route path="/expenses" element={<Expenses />} />
        <Route path="/incomes" element={<IncomesPage />} />
        <Route path="/recurring-transactions" element={<RecurringTransactionsPage />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
