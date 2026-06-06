import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import ExpenseChart from "../components/ExpenseChart";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import CountUp from "react-countup";

function Dashboard() {
  const [search,setSearch]=useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const token = localStorage.getItem("token");
  const [editId, setEditId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    if (!token) {
      window.location.href = "/";
      return;
    }

    fetchExpenses();

  }, []);

  const fetchExpenses = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/expenses",
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

  const addExpense = async (e) => {

  e.preventDefault();

  try {

    if (editId) {

      await axios.put(
        `http://localhost:5000/api/expenses/${editId}`,
        {
          title,
          amount,
          category
        },
        {
          headers: {
            Authorization: token
          }
        }
      );
      toast.success("Expense Updated Successfully");
      setEditId(null);

    } else {

      await axios.post(
        "http://localhost:5000/api/expenses/add",
        {
          title,
          amount,
          category
        },
        {
          headers: {
            Authorization: token
          }
        }
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
        `http://localhost:5000/api/expenses/${id}`,
        {
          headers: {
            Authorization: token
          }
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

  const worksheet =
    XLSX.utils.json_to_sheet(excelData);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Expenses"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

  const data = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  );

  saveAs(
    data,
    "Expense_Report.xlsx"
  );

};

  return (

    <div className={darkMode ? "container dark" : "container"}>

       <button
  onClick={downloadExcel}
  style={{
    marginRight: "10px"
  }}
>
  Download Report
</button>

<button
  onClick={async () => {

    if(window.confirm("Delete all expenses?")){

      try {

        await axios.delete(
          "http://localhost:5000/api/expenses/clear",
          {
            headers: {
              Authorization: token
            }
          }
        );

        fetchExpenses();

        toast.success("Expense Deleted Successfully");

      } catch (error) {

       toast.error("Operation Failed");

      }

    }

  }}
>
  Clear All
</button>
  
      <button
        style={{ float: "right" }}
        onClick={logout}
      >
        Logout
      </button>

      <button
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
</button>

      <h1>Expense Tracker</h1>

      <div className="dashboard-layout">

  {/* LEFT SIDE */}
  <div className="left-section">

      <input className="input-box"
        type="text"
        placeholder="Search Expense"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />
      <select className="input-box"
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

        <input className="input-box"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input className="input-box"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select className="input-box"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">
            Select Category
          </option>

          <option value="Food">
            Food
          </option>

          <option value="Travel">
            Travel
          </option>

          <option value="Education">
            Education
          </option>

          <option value="Entertainment">
            Entertainment
          </option>

          <option value="Shopping">
            Shopping
          </option>

        </select>

        <button type="submit">
           {editId ? "Update Expense" : "Add Expense"}
        </button>

      </form>


<input className="input-box"
  type="month"
  value={selectedMonth}
  onChange={(e) => setSelectedMonth(e.target.value)}
/>

      <table>

        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

       {expenses
.filter((exp) =>
  exp.title
    .toLowerCase()
    .includes(search.toLowerCase())
)
.filter((exp) =>
  filterCategory === ""
    ? true
    : exp.category === filterCategory
)
 .filter((exp) =>
    selectedMonth === ""
      ? true
      : exp.date.slice(0, 7) === selectedMonth
  )
.map((exp) => (

            <tr key={exp._id}>

             <td>{exp.title}</td>

         <td>₹{exp.amount}</td>

        <td>{exp.category}</td>

        <td>
  {new Date(exp.date).toLocaleDateString("en-IN")}
</td>
              <td>

                <button
                  className="delete-btn"
                  onClick={() => {

  if(window.confirm("Delete this expense?")){
    deleteExpense(exp._id);
  }

}}
                >
                  Delete
                </button>
                <button
onClick={() => {

  setEditId(exp._id);
  setTitle(exp.title);
  setAmount(exp.amount);
  setCategory(exp.category);
  setShowModal(true);
}}
>
Edit
</button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>
 </div>     

      {/* RIGHT */}
  <div className="right-section">
    <div className="cards-grid">

    <div className="card">
      <h3>Total Expenses</h3>
      <h2>₹<CountUp end={total} duration={1.5} separator="," /></h2>
    </div>

    <div className="card">
      <h3>Food</h3>
      <h2>₹<CountUp end={foodTotal} duration={1.5} /></h2>
    </div>

    <div className="card">
      <h3>Travel</h3>
      <h2>₹<CountUp end={travelTotal} duration={1.5} /></h2>
    </div>

    <div className="card">
      <h3>Education</h3>
      <h2>₹<CountUp end={educationTotal} duration={1.5} /></h2>
    </div>

    <div className="card">
      <h3>Entertainment</h3>
      <h2>₹<CountUp end={entertainmentTotal} duration={1.5} /></h2>
    </div>

    <div className="card">
      <h3>Shopping</h3>
      <h2>₹<CountUp end={shoppingTotal} duration={1.5} /></h2>
    </div>

    </div>
    <ExpenseChart expenses={expenses} />

</div>

    </div>

{showModal && (
  <div className="modal-overlay">
    <div className="modal-box">

      <h2>Edit Expense</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Food</option>
        <option>Travel</option>
        <option>Education</option>
        <option>Entertainment</option>
        <option>Shopping</option>
      </select>

      <button onClick={addExpense}>
        Update
      </button>

      <button
        onClick={() => setShowModal(false)}
      >
        Close
      </button>

    </div>
  </div>
)}

    </div>
    );

}

export default Dashboard;