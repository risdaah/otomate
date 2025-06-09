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
import { deleteUser, editUser, getUsersContent } from "../people/peopleSlice";
import { RIGHT_DRAWER_TYPES, CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil';

export const USERDATA = [
    { id_user: 1, nama: "Risda Rahmawati", email: "risda@gmail.com", role: "Admin Bengkel", profilImg:"/Profile.svg", status: "Active" }, 
    { id_user: 2, nama: "Nanda Kharisma", email: "nanda@gmail.com", role: "Supplier", profilImg:"/Profile.svg", status: "Inactive" },
    { id_user: 3, nama: "Talia Aprianti", email: "talia@gmail.com", role: "Supplier",  profilImg:"/Profile.svg", status: "Active" },
];

function AllUsers() {
  const [user] = useState(USERDATA);

  // DROPDOWN
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();

  // Mengaktifkan Dropdown
  const handleActionClick = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); 
  };

  // FILTER
  const openUserFilter = () => {
    dispatch(openRightDrawer({header : "Filters", bodyType : RIGHT_DRAWER_TYPES.USER_FILTER}));
  };

  useEffect(() => {
    dispatch(getUsersContent())
  }, [])  

  // Status
  const getStockStatus = (status) => {
    if (status === "Active") {
        return (
            <div className="py-1 text-l rounded-md text-white border border-green-500">
                <span className="px-2 font-semibold text-green-500">Active</span>
            </div>
        );
        } else {
            return (
                <div className="py-1 text-l rounded-md text-white border border-gray-500">
                    <span className="px-2 font-semibold text-gray-500">Inactive</span>
                </div>
            );
        }
    };

    
  // PAGINATION
  const [searchText, setSearchText] = useState(""); // Untuk teks pencarian
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const itemsPerPage = 10; // Jumlah item per halaman

  // Filter data berdasarkan teks pencarian
  const filteredUsers = USERDATA.filter((user) =>
    user.nama.toLowerCase().includes(searchText.toLowerCase())
  );

  // Hitung jumlah halaman
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Ambil data untuk halaman aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // EXCEL
  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(USERDATA); // Ubah data JSON ke format Excel
    const workbook = utils.book_new(); // Buat workbook baru
    utils.book_append_sheet(workbook, worksheet, "User"); // Tambahkan worksheet ke workbook
  
    // Buat file Excel
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
  
    // Simpan file dengan nama 'CustomerData.xlsx'
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "UserData.xlsx");
  };

  // PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Judul PDF
    doc.text("User Data", 14, 10);
  
    // Data tabel
    const tableColumn = ["Id_User", "Nama", "Email", "Role", "Status"];
    const tableRows = USERDATA.map(item => [
      item.id_user,
      item.nama,
      item.email,
      item.role,
      item.status
    ]);
  
    // Menambahkan tabel ke PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Posisi awal tabel
    });
  
    // Simpan file sebagai 'UserData.pdf'
    doc.save("UserData.pdf");
  };

   
  // CREATE
  const openCreateUser = () => {
    dispatch(openModal({title : "Create User", bodyType : MODAL_BODY_TYPES.USER_ADD_NEW}))
  }

  // EDIT
  const openEditUser = () => {
    dispatch(openModal({title : "Edit User", bodyType : MODAL_BODY_TYPES.USER_EDIT}))
  }

  // VIEW
  const openViewUser = (user) => {
    dispatch(openModal({
      title: "User Details",
      bodyType: MODAL_BODY_TYPES.USER_VIEW,
      extraObject: user
    }));
  };

  // DELETE
  const deleteUser = (index) => {
    dispatch(openModal({
        title: "Delete",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: { 
            message: `Are you sure you want to delete this user?`, 
            type: CONFIRMATION_MODAL_CLOSE_TYPES.USER_DELETE, 
            index,
            onConfirm: () => handleDeleteConfirmation(index) 
        }
    }));
  };

  const handleDeleteConfirmation = async (index) => {
      dispatch(deleteUser(index)); 

      // Tampilkan notifikasi
      dispatch(showNotification({
          message: "User deleted successfully!",
          status: 1 
      }));
  };

  return (
    <>
      <TitleCard title="User Management">

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
                onClick={() => openUserFilter()} >
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
                onClick={() => openCreateUser()}
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
                <th className="text-center text-primary text-base">Code</th>   
                <th className="text-center text-primary text-base">User</th>              
                <th className="text-center text-primary text-base">Email</th>
                <th className="text-center text-primary text-base">Role</th>
                <th className="text-center text-primary text-base">Status</th>
                <th className="text-center text-primary text-base">Action</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map((user, index) => (
                  <tr key={index}>
                    <td className="text-center">{user.id_user}</td>
                    <td>
                        <div className="flex items-center space-x-3 ml-10">
                            <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12 mr-4">
                                        <img  src={user.profilImg}
                                              alt={user.nama} />
                                    </div>
                            </div>
                            <div>
                                    <div className="font-bold">{user.nama}</div>
                                </div>
                            </div>
                        </td>
                    <td className="text-center">{user.email}</td>                    
                    <td className="text-center">{user.role}</td>
                    <td className="text-center">{getStockStatus(user.status)}</td>
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
                              <li onClick={() => openViewUser(user.id_produk)}>    
                                  <span>View</span>
                              </li>
                          </div>
                          
                          {/* Edit */}
                          <div className="flex items-center ml-2">
                            <PencilSquare className="h-5 w-5 inline-block" />
                            <li onClick={() => openEditUser(user.id_produk)}> 
                                <span>Edit</span>
                            </li>
                          </div>

                          {/* Delete */}
                          <div className="flex items-center ml-2">
                              <Trash className="h-5 w-5 inline-block" />
                              <li onClick={() => deleteUser(index)}>  
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

export default AllUsers;
