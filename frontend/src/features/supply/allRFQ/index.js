import moment from "moment"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import Trash from '@heroicons/react/24/outline/TrashIcon';
import Funnel from '@heroicons/react/24/outline/FunnelIcon';
import PlusCircle from '@heroicons/react/24/outline/PlusCircleIcon';
import DocumentChartBar from '@heroicons/react/24/outline/DocumentChartBarIcon';
import DocumentText from '@heroicons/react/24/outline/DocumentTextIcon';
import { NavLink,  Routes, Link , useLocation} from 'react-router-dom'
import { openRightDrawer } from '../../common/rightDrawerSlice';
import { showNotification } from "../../common/headerSlice";
import { openModal } from "../../common/modalSlice";
import { deleteSupply, editSupply, getSupplysContent } from "../../supply/allRFQ/supplySlice";
import { downloadInvoicePDF } from "../../invoice/invoiceSlice";
// Removed duplicate import of useDispatch
import { RIGHT_DRAWER_TYPES, CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil';
import CreateSupply from "../createRFQ";

export const RFQDATA = [
    {id_pesanan : "#4567", id_user : "23,989", id_supplier : "Product usages", nama : "AC CLEANER", total: "100.000",status : "Pending"},
    {id_pesanan : "#4567", id_user : "23,989", id_supplier : "Product usages", nama : "AIR RADIATOR",total: "100.000",status : "Paid"},
];

  // RUPIAH FORMAT
  const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
  };

function Supply() {
  const dispatch = useDispatch();
  const { supplys = [], isLoading } = useSelector((state) => state.Supply || {});
  const [isCreateSupply, setIsCreateSupply] = useState(false);

  useEffect(() => {
    dispatch(getSupplysContent())
  }, [])     
    
  // PAGINATION
  const [searchText, setSearchText] = useState(""); // Untuk teks pencarian
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const itemsPerPage = 10; // Jumlah item per halaman

  // FILTER
  const openSupplyFilter = () => {
    dispatch(openRightDrawer({header : "Filters", bodyType : RIGHT_DRAWER_TYPES.SUPPLY_FILTER}));
  };

  // Filter data berdasarkan teks pencarian
  const filteredSupplys = supplys.filter((supply) =>
    supply.total?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Hitung jumlah halaman
  const totalPages = Math.ceil(filteredSupplys.length / itemsPerPage);

  // Ambil data untuk halaman aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSupplys.slice(indexOfFirstItem, indexOfLastItem);

  // Status
  const getPaymentStatus = (status) => {
    if(status  === "rejected") return <div className="py-1 text-l font-semibold rounded-md text-red-500 border border-red-500">{status}</div>
    if(status  === "pending")return <div className="py-1 text-l font-semibold rounded-md text-gray-500 border border-gray-500">{status}</div>
    if(status  === "accepted")return <div className="py-1 text-l font-semibold rounded-md text-green-500 border border-green-500">{status}</div>
    else return <div className="badge badge-ghost">{status}</div>
  }


  // DROPDOWN
  const [openDropdown, setOpenDropdown] = useState(null);

  // Mengaktifkan Dropdown
  const handleActionClick = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); 
  };

  // EXCEL
  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(supplys); // Ubah data JSON ke format Excel
    const workbook = utils.book_new(); // Buat workbook baru
    utils.book_append_sheet(workbook, worksheet, "Supply"); // Tambahkan worksheet ke workbook
  
    // Buat file Excel
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
  
    // Simpan file dengan nama 'CustomerData.xlsx'
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "RFQData.xlsx");
  };

  // PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Judul PDF
    doc.text("RFQ Data", 14, 10);
  
    // Data tabel
    const tableColumn = ["id_Pesanan", "Supplier", "Total", "Status", "AT"];
    const tableRows = supplys.map(item => [
      item.id_pesanan,
      item.nama_supplier,
      item.total,
      item.status,
      moment(item.created_at).format("YYYY-MM-DD")
    ]);
  
    // Menambahkan tabel ke PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Posisi awal tabel
    });
  
    // Simpan file sebagai 'SupplyData.pdf'
    doc.save("RFQ.pdf");
  };

   // VIEW
  const openViewSupply = (supply) => {
    dispatch(openModal({
      title: "Detail Pesanan",
      bodyType: MODAL_BODY_TYPES.SUPPLY_VIEW,
      size: 'lg',
      extraObject: supply, // Kirim seluruh objek pesanan
    }));
  };

  // EDIT
  const openEditSupply = () => {
    dispatch(openModal({title : "Edit Order", bodyType : MODAL_BODY_TYPES.SUPPLY_EDIT}))
  }

  // DELETE
  const deleteSupply = (index) => {
    dispatch(openModal({
        title: "Delete",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: { 
            message: `Are you sure you want to delete this order?`, 
            type: CONFIRMATION_MODAL_CLOSE_TYPES.SUPPLY_DELETE, 
            index,
            onConfirm: () => handleDeleteConfirmation(index) 
        }
    }));
  };

  const handleDeleteConfirmation = async (index) => {
      dispatch(deleteSupply(index)); 

      // Tampilkan notifikasi
      dispatch(showNotification({
          message: "Order deleted successfully!",
          status: 1 
      }));
  };

  if (isCreateSupply) {
    return <CreateSupply />;
  }


  return (
    <>
      <TitleCard title="Order Management">

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
                onClick={() => openSupplyFilter()} >
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
            </div>
        </div>

        {/* Tabel Produk */}
        <div className="w-full">
            <table className="table w-full table-auto">
            <thead>
                <tr>
                    <th className="text-center text-primary text-base">ID_Pesanan</th>
                    <th className="text-center text-primary text-base">Supplier</th>
                    <th className="text-center text-primary text-base">Total</th>
                    <th className="text-center text-primary text-base">Status</th>
                    <th className="text-center text-primary text-base">AT</th>
                    <th className="text-center text-primary text-base">Action</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map((supply, index) => (
                  <tr key={index}>
                    <td className="text-center">{supply.id_pesanan}</td> 
                    <td className="text-center">{supply.nama_supplier}</td> 
                    <td className="text-center">{formatRupiah(supply.total)}</td>
                    <td className="text-center">{getPaymentStatus(supply.status)}</td>  
                    <td className="text-center">{moment(supply.created_at).format("DD-MM-YYYY")}</td>                  
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
                              <li onClick={() => openViewSupply(supply)}>  
                                  <span>View</span>
                              </li>
                          </div>
                  { /* Download Invoice - only if status accepted */ }
                  { supply.status === "accepted" && (
                    <div className="flex items-center ml-2 cursor-pointer" onClick={async () => {
                      try {
                        const pdfBlob = await downloadInvoicePDF(supply.id_pesanan)();
                        const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `invoice_${supply.id_pesanan}.pdf`);
                        document.body.appendChild(link);
                        link.click();
                        link.parentNode.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error('Failed to download invoice PDF:', error);
                        alert('Failed to download invoice PDF');
                      }
                    }}>
                      <DocumentText className="h-5 w-5 inline-block mr-1" />
                      <li>
                        <span>Download Invoice</span>
                      </li>
                    </div>
                  )}
                                            
                          {/* Edit */}
                          {/* <div className="flex items-center ml-2">
                            <PencilSquare className="h-5 w-5 inline-block" />
                            <li onClick={() => openEditSupply(supply.id_pesanan)}> 
                                <span>Edit</span>
                            </li>
                          </div> */}

                          {/* Delete */}
                          {/* <div className="flex items-center ml-2">
                              <Trash className="h-5 w-5 inline-block" />
                              <li onClick={() => deleteSupply(index)}>  
                                  <span>Delete</span>
                              </li>
                          </div>                          */}
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
                  className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-primary text-white btn-active' : ''}`}
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

export default Supply;
