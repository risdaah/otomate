import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react"
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
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
import { deleteCategory, editCategory, getCategorysContent } from "../category/categorySlice";
import { RIGHT_DRAWER_TYPES, CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil';

export const CATEGORYDATA = [
    { id_kategori: 1, nama: "NON STOK" },
    { id_kategori: 2, nama: "STOK BENGKEL" },
];

function Category() {
  const [category] = useState(CATEGORYDATA);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategorysContent())
  }, [])     
    
  // PAGINATION
  const [searchText, setSearchText] = useState(""); // Untuk teks pencarian
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const itemsPerPage = 10; // Jumlah item per halaman

  // Filter data berdasarkan teks pencarian
  const filteredCategorys = CATEGORYDATA.filter((category) =>
    category.nama.toLowerCase().includes(searchText.toLowerCase())
  );

  // Hitung jumlah halaman
  const totalPages = Math.ceil(filteredCategorys.length / itemsPerPage);

  // Ambil data untuk halaman aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategorys.slice(indexOfFirstItem, indexOfLastItem);

  // EXCEL
  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(CATEGORYDATA); // Ubah data JSON ke format Excel
    const workbook = utils.book_new(); // Buat workbook baru
    utils.book_append_sheet(workbook, worksheet, "Category"); // Tambahkan worksheet ke workbook
  
    // Buat file Excel
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
  
    // Simpan file dengan nama 'CustomerData.xlsx'
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "KategoriData.xlsx");
  };

  // PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Judul PDF
    doc.text("Kategori Data", 14, 10);
  
    // Data tabel
    const tableColumn = ["id_kategori", "Nama"];
    const tableRows = CATEGORYDATA.map(item => [
      item.id_kategori,
      item.nama,
    ]);
  
    // Menambahkan tabel ke PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Posisi awal tabel
    });
  
    // Simpan file sebagai 'CategoryData.pdf'
    doc.save("KategoriData.pdf");
  };
   
  // CREATE
  const openCreateCategory = () => {
    dispatch(openModal({title : "Create Kategori", bodyType : MODAL_BODY_TYPES.CATEGORY_ADD_NEW}))
  }

  // EDIT
  const openEditCategory = () => {
    dispatch(openModal({title : "Edit Category", bodyType : MODAL_BODY_TYPES.CATEGORY_EDIT}))
  }

  // DELETE
  const deleteCategory = (index) => {
    dispatch(openModal({
        title: "Delete",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: { 
            message: `Are you sure you want to delete this category?`, 
            type: CONFIRMATION_MODAL_CLOSE_TYPES.CATEGORY_DELETE, 
            index,
            onConfirm: () => handleDeleteConfirmation(index) 
        }
    }));
  };

  const handleDeleteConfirmation = async (index) => {
      dispatch(deleteCategory(index)); 

      // Tampilkan notifikasi
      dispatch(showNotification({
          message: "Category deleted successfully!",
          status: 1 
      }));
  };

  return (
    <>
      <TitleCard title="Category Management">

        <div className="flex justify-between items-center mb-4">

        <SearchBar
            searchText={searchText}
            setSearchText={(text) => {
              setSearchText(text);
              setCurrentPage(1); // Reset ke halaman pertama setelah search
            }}
          /> 

            <div className="flex items-center space-x-2">
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
                onClick={() => openCreateCategory()}
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
                <th className="text-center text-primary text-base">Code Category</th>  
                <th className="text-center text-primary text-base">Nama</th>
                <th className="text-center text-primary text-base">Action</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map((category, index) => (
                  <tr key={index}>
                    <td className="text-center">{category.id_kategori}</td>
                    <td className="text-center">{category.nama}</td> 
                    <td>
                      <div className="flex space-x-2 justify-center">
                         {/* Edit */}
                        <button
                          onClick={() => openEditCategory(category.id_produk)}
                          className="border btn-sm border-yellow-500 text-yellow-500 rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-yellow-500 hover:text-white transition duration-200"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>

                        {/* Delete */}
                        <button
                          className="border btn-sm border-red-500 text-red-500 rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-red-500 hover:text-white transition duration-200"
                          onClick={() => deleteCategory(index)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
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

export default Category;
