import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import { fetchInvoiceBySupplier, downloadInvoicePDF, acceptPesanan } from "./invoiceSlice";

const Invoice = () => {
  const dispatch = useDispatch();
  const { invoiceList = [], loading, error } = useSelector((state) => state.invoice);
  const user = useSelector((state) => state.auth.user);
  const id_supplier = user?.detail?.id_supplier;

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (id_supplier) {
      dispatch(fetchInvoiceBySupplier(id_supplier));
    }
  }, [dispatch, id_supplier]);

  const filteredInvoices = invoiceList.filter((invoice) => {
    const searchLower = searchText.toLowerCase();
    // Adjust filtering fields based on invoice data structure
    return (
      invoice.id_invoice?.toString().includes(searchLower) ||
      invoice.Pesanan?.status?.toLowerCase().includes(searchLower) ||
      invoice.customer_name?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const currentItems = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
  };



  // New handler to download invoice PDF
  const handleDownloadPDF = async (id_invoice) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/invoice/${id_invoice}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${id_invoice}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice PDF:', error);
      if (error.response && error.response.status === 404) {
        alert('Invoice not found for download.');
      } else {
        alert('Failed to download invoice PDF');
      }
    }
  };

  const handleAcceptPesanan = (id_pesanan) => {
    dispatch(acceptPesanan(id_pesanan))
      .unwrap()
      .then(() => {
        alert('Pesanan accepted successfully');
      })
      .catch((error) => {
        alert('Failed to accept pesanan: ' + error);
      });
  };

  return (
    <TitleCard title="Invoice Management">
      <div className="flex justify-between items-center mb-4">
        <SearchBar
          searchText={searchText}
          setSearchText={(text) => {
            setSearchText(text);
            setCurrentPage(1);
          }}
        />
      </div>

      {loading && <div className="p-6 text-center">Loading invoice data...</div>}
      {error && <div className="p-6 text-center text-red-500">Error: {error}</div>}

      <div className="w-full">
        <table className="table w-full table-auto">
          <thead>
            <tr>
              <th className="text-center">Invoice ID</th>
              <th className="text-center">Customer Name</th>
              <th className="text-center">Date</th>
              <th className="text-center">Total</th>
              <th className="text-center">Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No invoices found.
                </td>
              </tr>
            ) : (
              currentItems.map((invoice) => (
                <tr key={invoice.id_invoice}>
                  <td className="text-center">{invoice.id_invoice}</td>
                  <td className="text-center">{invoice.customer_name || "Bengkel Nugraha Jaya"}</td>
                  <td className="text-center">{new Date(invoice.created_at).toLocaleDateString()}</td>
                  <td className="text-center">
                    Rp {Number(invoice.Pesanan?.total).toLocaleString("id-ID")}
                  </td>
                  <td className="text-center">{invoice.status}</td>
                  <td className="text-center space-x-2">
                    <button
                      onClick={() => handleViewDetail(invoice)}
                      className="border btn-sm border-blue-500 text-blue-500 rounded-md px-3 py-1 hover:bg-blue-500 hover:text-white"
                    >
                      View
                    </button>
                    {invoice.status === 'unpaid' && (
                      <button
                        onClick={() => handleAcceptPesanan(invoice.Pesanan.id_pesanan)}
                        className="border btn-sm border-green-600 text-green-600 rounded-md px-3 py-1 hover:bg-green-600 hover:text-white"
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadPDF(invoice.id_invoice)}
                      className="border btn-sm border-green-500 text-green-500 rounded-md px-3 py-1 hover:bg-green-500 hover:text-white"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-5">
        <span className="text-sm text-gray-500">
          Rows per page: <strong>{itemsPerPage}</strong>
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`join-item btn btn-sm ${
                  currentPage === i + 1 ? "btn-primary btn-active" : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Detail Invoice #{selectedInvoice.id_invoice}
            </h3>
            <ul className="space-y-2">
              {selectedInvoice.Pesanan?.DetailPesanans?.map((item) => (
                <li key={item.id_detail_pesanan} className="border-b pb-2">
                  <strong>{item.Produk?.nama || item.id_produk}</strong> - Qty: {item.jumlah} - Harga: Rp{" "}
                  {Number(item.harga).toLocaleString("id-ID")}
                </li>
              ))}
            </ul>
            <div className="text-right mt-4">
              <button onClick={closeModal} className="btn btn-sm btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </TitleCard>
  );
};

export default Invoice;
