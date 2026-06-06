import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import ExpenseChart from "../components/ExpenseChart";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import CountUp from "react-countup";

function Dashboard() {
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ FIXED: define function BEFORE useEffect (IMPORTANT for Netlify)
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        "https://expense-tracker-server-1-iyq3.onrender.com/api/expenses",
        {
          headers: {
            Authorization: token
          }
        }
      );

      setExpenses(res.data);
    } catch (error) {
      toast.error("Failed to Fetch Expenses");
    }
  };

  // ✅ single clean useEffect
  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    fetchExpenses();
  }, [token]);

  const addExpense = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `https://expense-tracker-server-1-iyq3.onrender.com/api/expenses/${editId}`,
          { title, amount, category },
          { headers: { Authorization: token } }
        );

        toast.success("Expense Updated Successfully");
        setEditId(null);
      } else {
        await axios.post(
          "https://expense-tracker-server-1-iyq3.onrender.com/api/expenses/add",
          { title, amount, category },
          { headers: { Authorization: token } }
        );

        toast.success("Expense Added Successfully");
      }

      setTitle("");
      setAmount("");
      setCategory("");

      fetchExpenses();
    } catch (error) {
      toast.error("Operation Failed");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(
        `https://expense-tracker-server-1-iyq3.onrender.com/api/expenses/${id}`,
        {
          headers: { Authorization: token }
        }
      );

      toast.success("Expense Deleted Successfully");
      fetchExpenses();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const total = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const foodTotal = expenses
    .filter((exp) => exp.category === "Food")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const travelTotal = expenses
    .filter((exp) => exp.category === "Travel")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const educationTotal = expenses
    .filter((exp) => exp.category === "Education")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const entertainmentTotal = expenses
    .filter((exp) => exp.category === "Entertainment")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const shoppingTotal = expenses
    .filter((exp) => exp.category === "Shopping")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const downloadExcel = () => {
    const excelData = expenses.map((exp) => ({
      Title: exp.title,
      Amount: exp.amount,
      Category: exp.category,
      Date: new Date(exp.date).toLocaleDateString("en-IN")
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(data, "Expense_Report.xlsx");
  };

  return (
    <div className={darkMode ? "container dark" : "container"}>

      <button onClick={downloadExcel}>Download Report</button>

      <button
        onClick={async () => {
          if (window.confirm("Delete all expenses?")) {
            try {
              await axios.delete(
                "https://expense-tracker-server-1-iyq3.onrender.com/api/expenses/clear",
                {
                  headers: { Authorization: token }
                }
              );

              fetchExpenses();
              toast.success("All Expenses Deleted");
            } catch (error) {
              toast.error("Operation Failed");
            }
          }
        }}
      >
        Clear All
      </button>

      <button style={{ float: "right" }} onClick={logout}>
        Logout
      </button>

      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1>Expense Tracker</h1>

      <div className="dashboard-layout">

        {/* LEFT */}
        <div className="left-section">

          <input
            className="input-box"
            placeholder="Search Expense"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="input-box"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
          </select>

          <form onSubmit={addExpense}>
            <input
              className="input-box"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              className="input-box"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <select
              className="input-box"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option>Food</option>
              <option>Travel</option>
              <option>Education</option>
              <option>Entertainment</option>
              <option>Shopping</option>
            </select>

            <button type="submit">
              {editId ? "Update Expense" : "Add Expense"}
            </button>
          </form>

        </div>

        {/* RIGHT */}
        <div className="right-section">

          <div className="card">
            <h3>Total</h3>
            <h2>₹<CountUp end={total} /></h2>
          </div>

          <div className="card">
            <h3>Food</h3>
            <h2>₹<CountUp end={foodTotal} /></h2>
          </div>

          <div className="card">
            <h3>Travel</h3>
            <h2>₹<CountUp end={travelTotal} /></h2>
          </div>

          <div className="card">
            <h3>Education</h3>
            <h2>₹<CountUp end={educationTotal} /></h2>
          </div>

          <div className="card">
            <h3>Entertainment</h3>
            <h2>₹<CountUp end={entertainmentTotal} /></h2>
          </div>

          <div className="card">
            <h3>Shopping</h3>
            <h2>₹<CountUp end={shoppingTotal} /></h2>
          </div>

          <ExpenseChart expenses={expenses} />

        </div>

      </div>

    </div>
  );
}

export default Dashboard;