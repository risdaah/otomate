import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import {
  fetchPesananBySupplier,
  acceptPesanan,
  rejectPesanan,
} from "./pesananSlice";

function Pesanan() {
  const dispatch = useDispatch();
  const { pesananList = [], loading, error } = useSelector((state) => state.pesanan);
  const user = useSelector((state) => state.auth.user);
  //console.log("🐛 Redux user:", user);
  //console.log("✅ id_supplier dari user login:", user?.detail?.id_supplier);
  const id_supplier = user?.detail?.id_supplier;


  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPesanan, setSelectedPesanan] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    if (id_supplier) {
      dispatch(fetchPesananBySupplier(id_supplier));
    }
  }, [dispatch, id_supplier]);

  const filteredPesanan = pesananList.filter((pesanan) => {
    const searchLower = searchText.toLowerCase();
    return (
      pesanan.catatan?.toLowerCase().includes(searchLower) ||
      pesanan.status?.toLowerCase().includes(searchLower) ||
      pesanan.id_pesanan?.toString().includes(searchLower) ||
      pesanan.nama_supplier?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredPesanan.length / itemsPerPage);
  const currentItems = filteredPesanan.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAccept = (id_pesanan) => {
    dispatch(acceptPesanan(id_pesanan))
    // .unwrap()
    // .then(() => alert("✅ Pesanan accepted!"))
    // .catch((err) => alert("❌ Gagal accept: " + err.message));
  };

  const handleReject = (id_pesanan) => {
    dispatch(rejectPesanan(id_pesanan));
  };

  const handleViewDetail = (pesanan) => {
    setSelectedPesanan(pesanan);
  };

  const closeModal = () => {
    setSelectedPesanan(null);
  };

  return (
    <TitleCard title="Pesanan Management">
      <div className="flex justify-between items-center mb-4">
        <SearchBar
          searchText={searchText}
          setSearchText={(text) => {
            setSearchText(text);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="w-full">
        <table className="table w-full table-auto">
          <thead>
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Tanggal</th>
              <th className="text-center">Total</th>
              <th className="text-center">Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((pesanan) => (
              <tr key={pesanan.id_pesanan}>
                <td className="text-center">{pesanan.id_pesanan}</td>
                <td className="text-center">
                  {new Date(pesanan.created_at).toLocaleDateString()}
                </td>
                <td className="text-center">
                  Rp {Number(pesanan.total).toLocaleString("id-ID")}
                </td>
                <td className="text-center">{pesanan.status}</td>
                <td className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleViewDetail(pesanan)}
                    className="border btn-sm border-blue-500 text-blue-500 rounded-md px-3 py-1 hover:bg-blue-500 hover:text-white"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleAccept(pesanan.id_pesanan)}
                    className="border btn-sm border-green-500 text-green-500 rounded-md px-3 py-1 hover:bg-green-500 hover:text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(pesanan.id_pesanan)}
                    className="border btn-sm border-red-500 text-red-500 rounded-md px-3 py-1 hover:bg-red-500 hover:text-white"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No pesanan found.
                </td>
              </tr>
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
      {selectedPesanan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">
              Detail Pesanan #{selectedPesanan.id_pesanan}
            </h3>
            <ul className="space-y-2">
              {selectedPesanan.detail_pesanan.map((item) => (
                <li key={item.id_detail_pesanan} className="border-b pb-2">
                  <strong>{item.nama_produk}</strong> - Qty: {item.jumlah} - Harga: Rp{" "}
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
}

export default Pesanan;
