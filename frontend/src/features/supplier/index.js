import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import EllipsisVertical from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import Eye from '@heroicons/react/24/outline/EyeIcon';
import PencilSquare from '@heroicons/react/24/outline/PencilSquareIcon';
import Trash from '@heroicons/react/24/outline/TrashIcon';
import Funnel from '@heroicons/react/24/outline/FunnelIcon';
import PlusCircle from '@heroicons/react/24/outline/PlusCircleIcon';
import DocumentChartBar from '@heroicons/react/24/outline/DocumentChartBarIcon';
import DocumentText from '@heroicons/react/24/outline/DocumentTextIcon';
import { openRightDrawer } from '../common/rightDrawerSlice';
import { showNotification } from "../common/headerSlice";
import { openModal } from "../common/modalSlice";
import {
  deleteSupplier,
  editSupplier,
  getSuppliersContent,
} from "../supplier/supplierSlice";
import {
  RIGHT_DRAWER_TYPES,
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from '../../utils/globalConstantUtil';

export const SUPPLIERDATA = [
    { id_supplier: 1, id_user: 1, nama_supplier: "ALPHA MOTOR", tipe_mobil: "MASDA FORD+ NISAN+ HAYUNDAI+ KIA ", telp: "0930289349", alamat_supplier: "WADUNG" },
    { id_supplier: 2, id_user: 1, nama_supplier: "KARYA MULIA MOTOR ", tipe_mobil: "HONDA ",telp: "0928392029", alamat_supplier: "WADUNG" },
    { id_supplier: 3, id_user: 1, nama_supplier: "ASIA DISEL ", tipe_mobil: "MOBIL BESAR", telp: "0829374392", alamat_supplier: "WADUNG"}
];

function Suppliers() {
  const dispatch = useDispatch();

  // ✅ Safe default value to avoid undefined error
  const { suppliers = [], isLoading } = useSelector((state) => state.Supplier || {});

  useEffect(() => {
    dispatch(getSuppliersContent());
  }, [dispatch]);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleActionClick = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const openSupplierFilter = () => {
    dispatch(openRightDrawer({ header: "Filters", bodyType: RIGHT_DRAWER_TYPES.SUPPLIER_FILTER }));
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.nama_supplier?.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);

  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(suppliers);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Supplier");
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "SupplierData.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Supplier Data", 14, 10);
    const tableColumn = ["Id_Supplier", "Nama Supplier", "Telp"];
    const tableRows = suppliers.map(item => [
      item.id_supplier,
      item.nama_supplier,
      item.telp,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("SupplierData.pdf");
  };

  const openCreateSupplier = () => {
    dispatch(openModal({ title: "Create Supplier", bodyType: MODAL_BODY_TYPES.SUPPLIER_ADD_NEW }));
  };

  const openEditSupplier = (supplier) => {
    dispatch(openModal({ title: "Edit Supplier", bodyType: MODAL_BODY_TYPES.SUPPLIER_EDIT, extraObject: supplier }));
  };

  const openViewSupplier = (supplier) => {
    dispatch(openModal({
      title: "Supplier Details",
      bodyType: MODAL_BODY_TYPES.SUPPLIER_VIEW,
      extraObject: supplier
    }));
  };

  const deleteSupplierConfirm = (index) => {
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
    dispatch(deleteSupplier({ index }));
    dispatch(showNotification({
      message: "Supplier deleted successfully!",
      status: 1
    }));
  };

  // ✅ Optional: Loading state
  if (isLoading) {
    return <div className="p-6 text-center">Loading supplier data...</div>;
  }

  return (
    <TitleCard title="Supplier Management">
      <div className="flex justify-between items-center mb-4">
        <SearchBar
          searchText={searchText}
          setSearchText={(text) => {
            setSearchText(text);
            setCurrentPage(1);
          }}
        />
        <div className="flex items-center space-x-2">
          <button className="border btn-sm border-primary text-primary rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-primary hover:text-white hover:shadow-xl transition duration-200"
            onClick={openSupplierFilter}>
            <Funnel className="h-5 w-5" />
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
            onClick={openCreateSupplier}>
            <PlusCircle className="h-5 w-5" />
            <span>Create</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <table className="table w-full table-auto">
          <thead>
            <tr>
              <th className="text-center text-primary text-base">Code Supplier</th>
              <th className="text-center text-primary text-base">Nama Supplier</th>
              <th className="text-center text-primary text-base">Telp</th>
              <th className="text-center text-primary text-base">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">No suppliers found.</td>
              </tr>
            ) : (
              currentItems.map((supplier, index) => (
                <tr key={index}>
                  <td className="text-center">{supplier.id_supplier}</td>
                  <td className="text-center">{supplier.nama_supplier}</td>
                  <td className="text-center">{supplier.telp}</td>
                  <td>
                    <div className="dropdown dropdown-end ml-5">
                      <button onClick={() => handleActionClick(index)}>
                        <EllipsisVertical className="h-6 w-6" />
                      </button>
                      <ul className={`menu menu-compact dropdown-content shadow bg-base-100 rounded-box w-30 z-50 ${openDropdown === index ? 'block' : 'hidden'}`}>
                        <li onClick={() => openViewSupplier(supplier)}>
                          <div className="flex items-center ml-2">
                            <Eye className="h-5 w-5 inline-block" />
                            <span>View</span>
                          </div>
                        </li>
                        {/* <li onClick={() => openEditSupplier(supplier)}>
                          <div className="flex items-center ml-2">
                            <PencilSquare className="h-5 w-5 inline-block" />
                            <span>Edit</span>
                          </div>
                        </li> */}
                        {/* <li onClick={() => deleteSupplierConfirm(index)}>
                          <div className="flex items-center ml-2">
                            <Trash className="h-5 w-5 inline-block" />
                            <span>Delete</span>
                          </div>
                        </li> */}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-5 mx-5 space-x-4">
        <span className="text-sm text-gray-500">
          Rows Per Page <span className="font-bold text-primary">{itemsPerPage}</span>
        </span>

        <div className="flex justify-end items-center space-x-4">
          <span className="text-sm text-gray-500">
            Page <span className="font-bold text-primary">{currentPage}</span> of <span className="font-bold text-primary">{totalPages}</span>
          </span>

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
  );
}

export default Suppliers;
