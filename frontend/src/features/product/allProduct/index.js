import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react"
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import TitleCard from "../../../components/Cards/TitleCard";
import SearchBar from "../../../components/Input/SearchBar";
import EllipsisVertical from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import Eye from '@heroicons/react/24/outline/EyeIcon';
import PencilSquare from '@heroicons/react/24/outline/PencilSquareIcon';
import CreditCard from '@heroicons/react/24/outline/CreditCardIcon';
import Trash from '@heroicons/react/24/outline/TrashIcon';
import Funnel from '@heroicons/react/24/outline/FunnelIcon';
import PlusCircle from '@heroicons/react/24/outline/PlusCircleIcon';
import DocumentChartBar from '@heroicons/react/24/outline/DocumentChartBarIcon';
import DocumentText from '@heroicons/react/24/outline/DocumentTextIcon';
import { NavLink,  Routes, Link , useLocation} from 'react-router-dom'
import { openRightDrawer } from '../../common/rightDrawerSlice';
import { showNotification } from "../../common/headerSlice";
import { openModal } from "../../common/modalSlice";
import { deleteProduct, editProduct, getProductsContent } from "../allProduct/productSlice";
import { RIGHT_DRAWER_TYPES, CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil';

export const PRODUCTDATA = [
    { id_produk: 1, id_kategori: 1, nama: "AC CLEANER", gambar: "/intro.png", stok: 1, harga: "55000" },
    { id_produk: 2, id_kategori: 1, nama: "ACCU NS60LS", gambar: "/intro.png", stok: 0, harga: "900000" },
    { id_produk: 3, id_kategori: 1, nama: "ADITIF MATIC", gambar: "/intro.png", stok: 3, harga: "250000" },
    { id_produk: 4, id_kategori: 1, nama: "AIR ACCU", gambar: "/intro.png", stok: 20, harga: "8000" },
    { id_produk: 5, id_kategori: 1, nama: "AIR RADIATOR", gambar: "/intro.png", stok: 30, harga: "8500" },
];

function AllProducts() {
  const [product] = useState(PRODUCTDATA);

  // DROPDOWN
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();

  // Mengaktifkan Dropdown
  const handleActionClick = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); 
  };

  // FILTER
  const openProductFilter = () => {
    dispatch(openRightDrawer({header : "Filters", bodyType : RIGHT_DRAWER_TYPES.PRODUCT_FILTER}));
  };

  useEffect(() => {
    dispatch(getProductsContent())
  }, [])  

  // Status
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

    
  // PAGINATION
  const [searchText, setSearchText] = useState(""); // Untuk teks pencarian
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const itemsPerPage = 10; // Jumlah item per halaman

  // Filter data berdasarkan teks pencarian
  const filteredProducts = PRODUCTDATA.filter((product) =>
    product.nama.toLowerCase().includes(searchText.toLowerCase())
  );

  // Hitung jumlah halaman
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Ambil data untuk halaman aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // EXCEL
  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(PRODUCTDATA); // Ubah data JSON ke format Excel
    const workbook = utils.book_new(); // Buat workbook baru
    utils.book_append_sheet(workbook, worksheet, "Product"); // Tambahkan worksheet ke workbook
  
    // Buat file Excel
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
  
    // Simpan file dengan nama 'CustomerData.xlsx'
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "ProductData.xlsx");
  };

  // PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Judul PDF
    doc.text("Product Data", 14, 10);
  
    // Data tabel
    const tableColumn = ["id_Produk", "id_Kategori", "Nama", "Gambar", "stok", "harga"];
    const tableRows = PRODUCTDATA.map(item => [
      item.id_produk,
      item.id_kategori,
      item.nama,
      item.gambar,
      item.stok,
      item.harga
    ]);
  
    // Menambahkan tabel ke PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Posisi awal tabel
    });
  
    // Simpan file sebagai 'ProductData.pdf'
    doc.save("ProductData.pdf");
  };

   
  // CREATE
  const openCreateProduct = () => {
    dispatch(openModal({title : "Create Product", bodyType : MODAL_BODY_TYPES.PRODUCT_ADD_NEW}))
  }

  // EDIT
  const openEditProduct = () => {
    dispatch(openModal({title : "Edit Product", bodyType : MODAL_BODY_TYPES.PRODUCT_EDIT}))
  }

  // VIEW
  const openViewProduct = (product) => {
    dispatch(openModal({
      title: "Product Details",
      bodyType: MODAL_BODY_TYPES.PRODUCT_VIEW,
      extraObject: product
    }));
  };

  // DELETE
  const deleteProduct = (index) => {
    dispatch(openModal({
        title: "Delete",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: { 
            message: `Are you sure you want to delete this product?`, 
            type: CONFIRMATION_MODAL_CLOSE_TYPES.PRODUCT_DELETE, 
            index,
            onConfirm: () => handleDeleteConfirmation(index) 
        }
    }));
  };

  const handleDeleteConfirmation = async (index) => {
      dispatch(deleteProduct(index)); 

      // Tampilkan notifikasi
      dispatch(showNotification({
          message: "Product deleted successfully!",
          status: 1 
      }));
  };

  return (
    <>
      <TitleCard title="Product Management">

        <div className="flex justify-between items-center mb-4">

        <SearchBar
            searchText={searchText}
            setSearchText={(text) => {
              setSearchText(text);
              setCurrentPage(1); // Reset ke halaman pertama setelah search
            }}
          /> 

            <div className="flex items-center space-x-2">
            <button className="border btn-sm border-primary text-primary rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-primary hover:text-white hover:shadow-xl transition duration-200"
                onClick={() => openProductFilter()} >
                <Funnel className="h-5 w-5"/>
                <span>Filter</span>
            </button>
            <button className="border btn-sm border-success text-success rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-success hover:text-white hover:shadow-xl transition duration-200"
                onClick={downloadExcel}>
                <DocumentChartBar className="h-5 w-5" /> 
                <span>EXCEL</span>
            </button>
            <button className="border btn-sm border-error text-error rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-error hover:text-white hover:shadow-xl transition duration-200"
                onClick={downloadPDF}>
                <DocumentText className="h-5 w-5" /> 
                <span>PDF</span>
            </button>
            <button className="btn-sm bg-primary text-white rounded-md px-4 py-2 flex items-center space-x-1 hover:shadow-xl transition duration-200"
                onClick={() => openCreateProduct()}
                >
                <PlusCircle className="h-5 w-5" />
                <span>Create</span>
            </button>
            </div>
        </div>

        {/* Tabel Produk */}
        <div className="w-full">
            <table className="table w-full table-auto">
            <thead>
                <tr>
                <th className="text-center text-primary text-base">Code Product</th>
                <th className="text-center text-primary text-base">Code Category</th>                
                <th className="text-center text-primary text-base">Gambar</th>
                <th className="text-center text-primary text-base">Nama</th>
                <th className="text-center text-primary text-base">Stok</th>
                <th className="text-center text-primary text-base">Harga/pcs</th>                
                <th className="text-center text-primary text-base">Status</th>
                <th className="text-center text-primary text-base">Action</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map((product, index) => (
                  <tr key={index}>
                    <td className="text-center">{product.id_produk}</td>
                    <td className="text-center">{product.id_kategori}</td>
                    <td className="text-center">
                        <img
                            src={product.gambar}
                            alt={product.nama}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                    </td>
                    <td className="text-center">{product.nama}</td>                    
                    <td className="text-center">{product.stok}</td>
                    <td className="text-center">{product.harga}</td>
                    <td className="text-center">{getStockStatus(product.stok)}</td>
                    <td>
                      <div className="dropdown dropdown-end ml-12">
                        <button onClick={() => handleActionClick(index)}>
                          <EllipsisVertical className="h-6 w-6" />
                        </button>
                        <ul
                          tabIndex={0}
                          className="menu menu-compact dropdown-content shadow bg-base-100 rounded-box w-30 z-50"
                        >
                          {/* View */}
                          <div className="flex items-center ml-2">
                              <Eye className="h-5 w-5 inline-block" />
                              <li onClick={() => openViewProduct(product.id_produk)}>    
                                  <span>View</span>
                              </li>
                          </div>
                          
                          {/* Edit */}
                          <div className="flex items-center ml-2">
                            <PencilSquare className="h-5 w-5 inline-block" />
                            <li onClick={() => openEditProduct(product.id_produk)}> 
                                <span>Edit</span>
                            </li>
                          </div>

                          {/* Delete */}
                          <div className="flex items-center ml-2">
                              <Trash className="h-5 w-5 inline-block" />
                              <li onClick={() => deleteProduct(index)}>  
                                  <span>Delete</span>
                              </li>
                          </div>                         
                        </ul>
                      </div>
                    </td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Page Content */}
        <div className="flex justify-between items-center mt-5 mx-5 space-x-4">
          {/* Text for current page */}
          <span className="text-sm text-gray-500">
            Rows Per Page <span className="font-bold text-primary">{itemsPerPage}</span>
          </span>

          {/* Pagination */}
          <div className="flex justify-end items-center space-x-4">
            {/* Text for current page */}
            <span className="text-sm text-gray-500">
              Page <span className="font-bold text-primary">{currentPage}</span> of <span className="font-bold text-primary">{totalPages}</span>
            </span>

            {/* Pagination buttons */}
            <div className="join">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-primary btn-active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </TitleCard>     
    </>
  );
}

export default AllProducts;
