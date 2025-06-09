import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react"
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
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
import { openRightDrawer } from '../common/rightDrawerSlice';
import { showNotification } from "../common/headerSlice";
import { openModal } from "../common/modalSlice";
import { deleteSupplier, editSupplier, getSuppliersContent } from "../supplier/supplierSlice";
import { RIGHT_DRAWER_TYPES, CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil';

export const SUPPLIERDATA = [
    { id_supplier: 1, id_user: 1, nama_supplier: "ALPHA MOTOR", tipe_mobil: "MASDA FORD+ NISAN+ HAYUNDAI+ KIA ", telp: "0930289349", alamat_supplier: "WADUNG" },
    { id_supplier: 2, id_user: 1, nama_supplier: "KARYA MULIA MOTOR ", tipe_mobil: "HONDA ",telp: "0928392029", alamat_supplier: "WADUNG" },
    { id_supplier: 3, id_user: 1, nama_supplier: "ASIA DISEL ", tipe_mobil: "MOBIL BESAR", telp: "0829374392", alamat_supplier: "WADUNG"}
];

function Suppliers() {
  const [supplier] = useState(SUPPLIERDATA);

  // DROPDOWN
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();

  // Mengaktifkan Dropdown
  const handleActionClick = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); 
  };

  // FILTER
  const openSupplierFilter = () => {
    dispatch(openRightDrawer({header : "Filters", bodyType : RIGHT_DRAWER_TYPES.SUPPLIER_FILTER}));
  };

  useEffect(() => {
    dispatch(getSuppliersContent())
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
  const filteredSuppliers = SUPPLIERDATA.filter((supplier) =>
    supplier.nama_supplier.toLowerCase().includes(searchText.toLowerCase())
  );

  // Hitung jumlah halaman
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  // Ambil data untuk halaman aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);

  // EXCEL
  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(SUPPLIERDATA); // Ubah data JSON ke format Excel
    const workbook = utils.book_new(); // Buat workbook baru
    utils.book_append_sheet(workbook, worksheet, "Supplier"); // Tambahkan worksheet ke workbook
  
    // Buat file Excel
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
  
    // Simpan file dengan nama 'CustomerData.xlsx'
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "SupplierData.xlsx");
  };

  // PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Judul PDF
    doc.text("Supplier Data", 14, 10);
  
    // Data tabel
    const tableColumn = ["Id_Supplier", "ID_User", "Nama Supplier", "Tipe Mobil", "Telp", "Alamat"];
    const tableRows = SUPPLIERDATA.map(item => [
      item.id_supplier,
      item.id_user,
      item.nama_supplier,
      item.tipe_mobil,
      item.telp,
      item.alamat_supplier
    ]);
  
    // Menambahkan tabel ke PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Posisi awal tabel
    });
  
    // Simpan file sebagai 'SupplierData.pdf'
    doc.save("SupplierData.pdf");
  };

   
  // CREATE
  const openCreateSupplier = () => {
    dispatch(openModal({title : "Create Supplier", bodyType : MODAL_BODY_TYPES.SUPPLIER_ADD_NEW}))
  }

  // EDIT
  const openEditSupplier = () => {
    dispatch(openModal({title : "Edit Supplier", bodyType : MODAL_BODY_TYPES.SUPPLIER_EDIT}))
  }

  // VIEW
  const openViewSupplier = (supplier) => {
    dispatch(openModal({
      title: "Supplier Details",
      bodyType: MODAL_BODY_TYPES.SUPPLIER_VIEW,
      extraObject: supplier
    }));
  };

  // DELETE
  const deleteSupplier = (index) => {
    dispatch(openModal({
        title: "Delete",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: { 
            message: `Are you sure you want to delete this supplier?`, 
            type: CONFIRMATION_MODAL_CLOSE_TYPES.SUPPLIER_DELETE, 
            index,
            onConfirm: () => handleDeleteConfirmation(index) 
        }
    }));
  };

  const handleDeleteConfirmation = async (index) => {
      dispatch(deleteSupplier(index)); 

      // Tampilkan notifikasi
      dispatch(showNotification({
          message: "Supplier deleted successfully!",
          status: 1 
      }));
  };

  return (
    <>
      <TitleCard title="Supplier Management">

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
                onClick={() => openSupplierFilter()} >
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
                onClick={() => openCreateSupplier()}
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
                <th className="text-center text-primary text-base">Code Supplier</th>
                <th className="text-center text-primary text-base">Code User</th>                
                <th className="text-center text-primary text-base">Nama Supplier</th>                
                <th className="text-center text-primary text-base">Tipe Mobil</th>
                <th className="text-center text-primary text-base">Telp</th>
                <th className="text-center text-primary text-base">Alamat</th>
                <th className="text-center text-primary text-base">Action</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map((supplier, index) => (
                  <tr key={index}>
                    <td className="text-center">{supplier.id_supplier}</td>
                    <td className="text-center">{supplier.id_user}</td>
                    <td className="text-center">{supplier.nama_supplier}</td>                      
                    <td className="text-center">{supplier.tipe_mobil}</td>                   
                    <td className="text-center">{supplier.telp}</td>
                    <td className="text-center">{supplier.alamat_supplier}</td>
                    <td>
                      <div className="dropdown dropdown-end ml-5">
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
                              <li onClick={() => openViewSupplier(supplier.id_supplier)}>    
                                  <span>View</span>
                              </li>
                          </div>
                          
                          {/* Edit */}
                          <div className="flex items-center ml-2">
                            <PencilSquare className="h-5 w-5 inline-block" />
                            <li onClick={() => openEditSupplier(supplier.id_supplier)}> 
                                <span>Edit</span>
                            </li>
                          </div>

                          {/* Delete */}
                          <div className="flex items-center ml-2">
                              <Trash className="h-5 w-5 inline-block" />
                              <li onClick={() => deleteSupplier(index)}>  
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

export default Suppliers;
