import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

import TitleCard from "../../../components/Cards/TitleCard";
import SearchBar from "../../../components/Input/SearchBar";

import {
  EllipsisVerticalIcon as EllipsisVertical,
  EyeIcon as Eye,
  PencilSquareIcon as PencilSquare,
  TrashIcon as Trash,
  FunnelIcon as Funnel,
  PlusCircleIcon as PlusCircle,
  DocumentChartBarIcon as DocumentChartBar,
  DocumentTextIcon as DocumentText,
} from "@heroicons/react/24/outline";

import {
  openRightDrawer,
} from "../../common/rightDrawerSlice";
import {
  showNotification,
} from "../../common/headerSlice";
import {
  openModal,
} from "../../common/modalSlice";

import {
  deleteProductAsync,
  getProductsContent,
} from "../allProduct/productSlice";

import {
  RIGHT_DRAWER_TYPES,
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";

export const PRODUCTDATA = [
    { id_produk: 1, id_kategori: 1, nama: "AC CLEANER", gambar: "/intro.png", stok: 1, harga: "55000" },
    { id_produk: 2, id_kategori: 1, nama: "ACCU NS60LS", gambar: "/intro.png", stok: 0, harga: "900000" },
    { id_produk: 3, id_kategori: 1, nama: "ADITIF MATIC", gambar: "/intro.png", stok: 3, harga: "250000" },
    { id_produk: 4, id_kategori: 1, nama: "AIR ACCU", gambar: "/intro.png", stok: 20, harga: "8000" },
    { id_produk: 5, id_kategori: 1, nama: "AIR RADIATOR", gambar: "/intro.png", stok: 30, harga: "8500" },
];

const getImageUrl = (filename) => {
  if (!filename) return "/placeholder.png";
  return `http://localhost:5000/uploads/${filename}`;
};



function AllProducts() {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.Product);

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getProductsContent());
  }, [dispatch]);

  const filteredProducts = products.filter((product) =>
    product.nama?.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleActionClick = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const getStockStatus = (stok) => {
    if (stok === 0) {
      return (
        <div className="py-1 text-l rounded-md text-white border border-red-500">
          <span className="px-2 font-semibold text-red-500">Habis</span>
        </div>
      );
    } else if (stok < 10) {
      return (
        <div className="py-1 text-l rounded-md text-white border border-yellow-500">
          <span className="px-2 font-semibold text-yellow-500">Menipis</span>
        </div>
      );
    } else {
      return (
        <div className="py-1 text-l rounded-md text-white border border-green-500">
          <span className="px-2 font-semibold text-green-500">Aman</span>
        </div>
      );
    }
  };

  const openProductFilter = () => {
    dispatch(openRightDrawer({ header: "Filters", bodyType: RIGHT_DRAWER_TYPES.PRODUCT_FILTER }));
  };

  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(products);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Product");
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "ProductData.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Product Data", 14, 10);

    const tableColumn = ["ID Produk", "ID Kategori", "ID Mobil", "ID Jenis Stok", "Nama", "Stok", "Harga"];
    const tableRows = products.map((item) => [
      item.id_produk,
      item.id_kategori,
      item.id_mobil,
      item.id_jenis_stok,
      item.nama,
      item.stok,
      item.harga,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("ProductData.pdf");
  };

  const openCreateProduct = () => {
    dispatch(openModal({ title: "Create Product", bodyType: MODAL_BODY_TYPES.PRODUCT_ADD_NEW }));
  };

  const openEditProduct = (product) => {
    dispatch(openModal({ title: "Edit Product", bodyType: MODAL_BODY_TYPES.PRODUCT_EDIT, extraObject: product, size: 'md' }));
  };

  const openViewProduct = (product) => {
    dispatch(openModal({ title: "Product Details", bodyType: MODAL_BODY_TYPES.PRODUCT_VIEW, extraObject: product }));
  };

  const deleteProduct = (product) => {
    dispatch(
      openModal({
        title: "Delete",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this product?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.PRODUCT_DELETE,
          index: product.id_produk,
        },
      })
    );
  };

  // Removed handleDeleteConfirmation as confirmation is handled in modal now

  return (
    <TitleCard title="Product Management">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-4">
        <SearchBar
          searchText={searchText}
          setSearchText={(text) => {
            setSearchText(text);
            setCurrentPage(1);
          }}
        />

        <div className="flex items-center space-x-2">
          <button
            className="border btn-sm border-accent text-accent rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-accent hover:text-white transition"
            onClick={openProductFilter}
          >
            <Funnel className="h-5 w-5" />
            <span>Filter</span>
          </button>

          <button
            className="border btn-sm border-success text-success rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-success hover:text-white transition"
            onClick={downloadExcel}
          >
            <DocumentChartBar className="h-5 w-5" />
            <span>Excel</span>
          </button>

          <button
            className="border btn-sm border-error text-error rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-error hover:text-white transition"
            onClick={downloadPDF}
          >
            <DocumentText className="h-5 w-5" />
            <span>PDF</span>
          </button>

          <button
            className="btn-sm bg-primary text-white rounded-md px-4 py-2 flex items-center space-x-1 hover:shadow-xl transition"
            onClick={openCreateProduct}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <table className="table w-full table-auto">
          <thead>
            <tr>
              <th className="text-center text-primary text-base">ID Produk</th>
              <th className="text-center text-primary text-base">Kategori</th>
              <th className="text-center text-primary text-base">Mobil</th>
              <th className="text-center text-primary text-base">Jenis Stok</th>
              <th className="text-center text-primary text-base">Nama</th>
              <th className="text-center text-primary text-base">Stok</th>
              <th className="text-center text-primary text-base">Harga</th>
              <th className="text-center text-primary text-base">Status</th>
              <th className="text-center text-primary text-base">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">Tidak ada produk ditemukan.</td>
              </tr>
            ) : (
              currentItems.map((product, index) => (
                <tr key={product.id_produk}>
                  <td className="text-center">{product.id_produk}</td>
                  <td className="text-center">{product.nama_kategori || '-'}</td>
                  <td className="text-center">{product.nama_mobil || '-'}</td>
                  <td className="text-center">{product.jenis || '-'}</td>
                  <td className="text-center">{product.nama}</td>
                  <td className="text-center">{product.stok}</td>
                  <td className="text-center">Rp {Number(product.harga).toLocaleString()}</td>
                  <td className="text-center">{getStockStatus(product.stok)}</td>
                  <td className="text-center">
                    <div className={`dropdown dropdown-end ${openDropdown === index ? 'dropdown-open' : ''}`}>
                      <button onClick={() => handleActionClick(index)}>
                        <EllipsisVertical className="h-6 w-6" />
                      </button>
                      <ul className="menu dropdown-content shadow bg-base-100 rounded-box w-36 z-50">
                        {/* <li onClick={() => openViewProduct(product)}>
                          <a><Eye className="h-4 w-4" />View</a>
                        </li> */}
                        <li onClick={() => openEditProduct(product)}>
                          <a><PencilSquare className="h-4 w-4" /> Edit</a>
                        </li>
                        <li onClick={() => deleteProduct(product)}>
                          <a><Trash className="h-4 w-4" /> Delete</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-5 mx-5 space-x-4">
        <span className="text-sm text-gray-500">
          Rows Per Page <span className="font-bold text-primary">{itemsPerPage}</span>
        </span>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Page <span className="font-bold text-primary">{currentPage}</span> of <span className="font-bold text-primary">{totalPages}</span>
          </span>
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`join-item btn btn-sm ${currentPage === i + 1 ? "btn-primary text-white btn-active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </TitleCard>
  );
}

export default AllProducts;
