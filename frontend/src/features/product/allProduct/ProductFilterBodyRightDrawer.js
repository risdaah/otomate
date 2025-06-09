import React, { useState } from "react";
import InputFilterText from "../../../components/Input/InputFilter"; 
import Funnel from "@heroicons/react/24/outline/FunnelIcon";
import Power from "@heroicons/react/24/outline/PowerIcon";

function ProductFilterBodyRightDrawer() {
  const [formData, setFormData] = useState({
    id_produk: "",
    id_kategori: "",
    nama: "",
    status: "",
    gambar: "",
    stok: "",
    harga: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("Form data submitted:", formData);
    // Lakukan logika pengiriman data di sini
  };

  const handleReset = () => {
    // Mengosongkan semua input
    setFormData({
        nama: "",
        gambar: "",
        stok: "",
        harga: "",
    });
  };

  return (
    <>
      <div className="min-h-screen flex">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit}>
  
            {/* Input Nama Produk */}
            <InputFilterText
              type="text"
              value={formData.nama}
              onChange={(value) => handleInputChange("nama", value)}
              containerStyle="mt-2"
              labelTitle="Nama Produk"
              placeholder="Search by Nama Produk"
            />

            {/* Input Stok */}
            <InputFilterText
              type="text"
              value={formData.stok}
              onChange={(value) => handleInputChange("stok", value)}
              containerStyle="mt-2"
              labelTitle="Stok"
              placeholder="Search by Stok"
            />

            {/* Input Harga */}
            <InputFilterText
              type="text"
              value={formData.harga}
              onChange={(value) => handleInputChange("harga", value)}
              containerStyle="mt-2"
              labelTitle="Harga"
              placeholder="Search by Harga"
            />

            {/* Input Status */}
            <div className="form-control">
              <label htmlFor="status" className="label font-bold">
                Status
              </label>

              {formData.status === "" ? (
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    handleInputChange({ updateType: "status", value: e.target.value })
                  }
                  className="select select-bordered"
                >
                  <option value="" disabled>
                    Pilih Status
                  </option>
                  <option value="Menipis">Menipis</option>
                  <option value="Aman">Aman</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.status}
                  readOnly
                  className="input input-bordered"
                />
              )}
            </div>


            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800"
              >
                <Funnel className="h-5 w-5 inline-block mr-1 mb-1" />
                Filter
              </button>

              <button
                type="button"
                onClick={handleReset} // Panggil fungsi reset
                className="bg-error text-white py-2 px-4 rounded-md hover:bg-red-500"
              >
                <Power className="h-5 w-5 inline-block mr-1 mb-1" />
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProductFilterBodyRightDrawer;
