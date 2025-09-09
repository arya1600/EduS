import React, { useEffect, useState } from "react";
import axios from "axios";

const Support = () => {
  const [query, setQuery] = useState({ subject: "", message: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  // Fetch tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      let url = "";
      if (currentUser?.role === "admin") {
        url = `http://localhost:8080/api/v1/support${
          statusFilter !== "all" ? `?status=${statusFilter}` : ""
        }`;
      } else {
        url = "http://localhost:8080/api/v1/support/me";
      }

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  // Submit new ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/v1/support", query, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setQuery({ subject: "", message: "" });
      fetchTickets();
      alert("Support ticket submitted!");
    } catch (err) {
      console.error("Error submitting ticket", err);
    }
  };

  // Open modal for answering
  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setAdminResponse(ticket.adminResponse || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    setAdminResponse("");
  };

  // Admin: submit response
  const handleAnswerSubmit = async () => {
    if (!adminResponse.trim()) return;
    try {
      await axios.put(
        `http://localhost:8080/api/v1/support/${selectedTicket._id}/answer`,
        { adminResponse, status: "answered" },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      fetchTickets();
      closeModal();
    } catch (err) {
      console.error("Error answering ticket", err);
    }
  };

  // Admin: close ticket
  const handleClose = async (id) => {
    if (!window.confirm("Are you sure you want to close this ticket?")) return;
    try {
      await axios.put(
        `http://localhost:8080/api/v1/support/${id}/answer`,
        { status: "closed" },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      fetchTickets();
    } catch (err) {
      console.error("Error closing ticket", err);
    }
  };

  if (loading)
    return <p className="p-6 text-gray-500">Loading support tickets...</p>;

  // Ticket counts
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "open").length;
  const answered = tickets.filter((t) => t.status === "answered").length;
  const closed = tickets.filter((t) => t.status === "closed").length;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#B087CF]">
        Helpdesk
      </h2>

      {/* Admin modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Answer Ticket - {selectedTicket?.subject}
            </h3>
            <textarea
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              rows="4"
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Type your response..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAnswerSubmit}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {currentUser?.role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* same stats cards as before */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total</h3>
            <p className="text-2xl font-bold text-purple-600">{total}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition text-center">
            <h3 className="text-lg font-semibold text-gray-700">Open</h3>
            <p className="text-2xl font-bold text-yellow-500">{open}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition text-center">
            <h3 className="text-lg font-semibold text-gray-700">Answered</h3>
            <p className="text-2xl font-bold text-green-500">{answered}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition text-center">
            <h3 className="text-lg font-semibold text-gray-700">Closed</h3>
            <p className="text-2xl font-bold text-gray-500">{closed}</p>
          </div>
        </div>
      )}

      {/* User: raise new ticket */}
      {currentUser?.role !== "admin" && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md mb-6"
        >
          <h3 className="text-xl font-semibold mb-4">Submit a Ticket</h3>
          <input
            type="text"
            placeholder="Subject"
            value={query.subject}
            onChange={(e) => setQuery({ ...query, subject: e.target.value })}
            className="w-full border rounded-lg p-3 mb-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            required
          />
          <textarea
            placeholder="Describe your issue..."
            className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            value={query.message}
            onChange={(e) => setQuery({ ...query, message: e.target.value })}
            required
          />
          <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium">
            Submit Ticket
          </button>
        </form>
      )}

      {/* Admin filter */}
      {currentUser?.role === "admin" && (
        <div className="mb-6">
          <label className="mr-2 font-semibold text-gray-700">
            Filter by status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="answered">Answered</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      )}

      {/* Tickets Table */}
      <div className="overflow-x-auto bg-purple-100 rounded-xl shadow-md">
        {tickets.length === 0 ? (
          <p className="p-6 text-gray-500">No tickets found.</p>
        ) : (
          <table className="table-auto w-full rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-purple-100 text-left text-gray-700">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Message</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Response</th>
                {currentUser?.role === "admin" && (
                  <th className="px-5 py-3">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, idx) => (
                <tr
                  key={t._id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-purple-50 transition`}
                >
                  <td className="px-5 py-3">
                    {currentUser?.role === "admin"
                      ? t.user?.name || t.user?.email
                      : "You"}
                  </td>
                  <td className="px-5 py-3">{t.subject}</td>
                  <td className="px-5 py-3">{t.message}</td>
                  <td className="px-5 py-3 font-medium capitalize">
                    {t.status}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {t.adminResponse || "-"}
                  </td>
                  {currentUser?.role === "admin" && (
                    <td className="px-5 py-3 flex gap-2">
                      <button
                        onClick={() => openModal(t)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        Answer
                      </button>
                      {t.status !== "closed" && (
                        <button
                          onClick={() => handleClose(t._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          Close
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Support;
