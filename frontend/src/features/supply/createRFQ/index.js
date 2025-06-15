import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TitleCard from "../../../components/Cards/TitleCard";

// Format Rupiah
const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

const CreatePurchase = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [note, setNote] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/supplier")
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error("Failed to fetch suppliers", err));

    axios.get("http://localhost:5000/api/produk")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  const handleAddProduct = (product) => {
    const alreadyExists = orderItems.find((item) => item.id_produk === product.id_produk);
    if (alreadyExists) {
      alert("Produk sudah ditambahkan");
      return;
    }

  const newItem = {
    id_produk: product.id_produk,
    nama: product.nama,
    jumlah: 1,
    harga: parseFloat(product.harga), // ⬅️ konversi ke number
    subtotal: parseFloat(product.harga),
  };

    setOrderItems([...orderItems, newItem]);
    setSearchTerm("");
  };

  const handleQtyChange = (index, newQty) => {
    const updatedItems = [...orderItems];
    updatedItems[index].jumlah = newQty;
    updatedItems[index].subtotal = updatedItems[index].harga * newQty;
    setOrderItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updated = [...orderItems];
    updated.splice(index, 1);
    setOrderItems(updated);
  };

  const total = orderItems.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSubmit = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id_user = user?.id_user;

    if (!id_user || !supplier || orderItems.length === 0) {
      alert("Lengkapi data terlebih dahulu");
      return;
    }

    const payload = {
      id_user,
      id_supplier: parseInt(supplier),
      catatan: note,
      products: orderItems.map((item) => ({
        id_produk: item.id_produk,
        jumlah: item.jumlah,
        harga: parseFloat(item.harga.toFixed(2)),
      })),
    };

    console.log("🚀 Payload yang dikirim:", payload);

    axios.post("http://localhost:5000/api/pesanan", payload)
      .then(() => {
        alert("Pesanan berhasil dibuat");
        navigate("/app/supply");
      })
      .catch((err) => {
        console.error("❌ Gagal membuat pesanan:", err);
        if (err.response?.data?.message) {
          alert(`Error: ${err.response.data.message}`);
        } else {
          alert("Gagal membuat pesanan");
        }
      });
  };

  return (
    <TitleCard title="Buat Pesanan" topMargin="mt-2">
      {/* Tanggal & Supplier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1 font-medium">Tanggal</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="w-full border bg-base-100 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Supplier</label>
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full border bg-base-100 rounded px-3 py-2"
          >
            <option value="">Pilih Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id_supplier} value={s.id_supplier}>
                {s.nama_supplier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Produk */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium mb-1">Cari Produk</label>
        <input
          type="text"
          placeholder="Ketik nama produk..."
          className="w-full border bg-base-100 rounded px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
            {products
              .filter((p) =>
                p.nama.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((p) => (
                <li
                  key={p.id_produk}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAddProduct(p)}
                >
                  {p.nama} - {formatRupiah(p.harga)}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Tabel Produk */}
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2 text-left">Produk</th>
            <th className="border px-4 py-2 text-left">Harga</th>
            <th className="border px-4 py-2 text-left">Jumlah</th>
            <th className="border px-4 py-2 text-left">Subtotal</th>
            <th className="border px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item, index) => (
            <tr key={item.id_produk}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{item.nama}</td>
              <td className="border px-4 py-2">{formatRupiah(item.harga)}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  min="1"
                  value={item.jumlah}
                  onChange={(e) => handleQtyChange(index, parseInt(e.target.value))}
                  className="w-20 border rounded px-2 py-1"
                />
              </td>
              <td className="border px-4 py-2">{formatRupiah(item.subtotal)}</td>
              <td className="border px-4 py-2">
                <button
                  className="text-red-500"
                  onClick={() => handleRemoveItem(index)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {orderItems.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Tidak ada produk ditambahkan
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total */}
      <div className="text-right text-lg font-semibold mb-6">
        Total: {formatRupiah(total)}
      </div>

      {/* Catatan */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Catatan</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border bg-base-100 rounded px-3 py-2"
          rows="3"
        ></textarea>
      </div>

      {/* Tombol Submit */}
      <div className="mt-8">
        <button className="btn btn-primary float-right" onClick={handleSubmit}>
          Simpan Pesanan
        </button>
      </div>
    </TitleCard>
  );
};

export default CreatePurchase;
