import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
  DocumentChartBarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import TitleCard from "../../../components/Cards/TitleCard";
import SearchBar from "../../../components/Input/SearchBar";

import { openModal } from "../../common/modalSlice";
import { showNotification } from "../../common/headerSlice";
import {
  deleteCategoryApi,
  getCategories,
} from "../category/categorySlice";

import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";

function Category() {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.Category);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCategorys = categories.filter((category) =>
    category.nama_kategori.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategorys.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategorys.slice(indexOfFirstItem, indexOfLastItem);

  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(categories);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Category");
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "KategoriData.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Kategori Data", 14, 10);

    const tableColumn = ["id_kategori", "nama_kategori"];
    const tableRows = categories.map((item) => [
      item.id_kategori,
      item.nama_kategori,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("KategoriData.pdf");
  };

  const openCreateCategory = () => {
    dispatch(
      openModal({
        title: "Create Kategori",
        bodyType: MODAL_BODY_TYPES.CATEGORY_ADD_NEW,
      })
    );
  };

  const openEditCategory = (id_kategori) => {
    dispatch(
      openModal({
        title: "Edit Category",
        bodyType: MODAL_BODY_TYPES.CATEGORY_EDIT,
        extraObject: { id_kategori },
      })
    );
  };

  const deleteCategory = (id_kategori) => {
    dispatch(
      openModal({
        title: "Konfirmasi",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Yakin mau hapus kategori ini?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.CATEGORY_DELETE,
          id_kategori,
        },
      })
    );
  };

  return (
    <>
      <TitleCard title="Category Management">
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
              className="border btn-sm border-success text-success rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-success hover:text-white hover:shadow-xl transition duration-200"
              onClick={downloadExcel}
            >
              <DocumentChartBarIcon className="h-5 w-5" />
              <span>EXCEL</span>
            </button>
            <button
              className="border btn-sm border-error text-error rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-error hover:text-white hover:shadow-xl transition duration-200"
              onClick={downloadPDF}
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span>PDF</span>
            </button>
            <button
              className="btn-sm bg-primary text-white rounded-md px-4 py-2 flex items-center space-x-1 hover:shadow-xl transition duration-200"
              onClick={openCreateCategory}
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Create</span>
            </button>
          </div>
        </div>

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
                  <td className="text-center">{category.nama_kategori}</td>
                  <td>
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => openEditCategory(category.id_kategori)}
                        className="border btn-sm border-yellow-500 text-yellow-500 rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-yellow-500 hover:text-white transition duration-200"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => deleteCategory(category.id_kategori)}
                        className="border btn-sm border-red-500 text-red-500 rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-red-500 hover:text-white transition duration-200"
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

        <div className="flex justify-between items-center mt-5 mx-5 space-x-4">
          <span className="text-sm text-gray-500">
            Rows Per Page <span className="font-bold text-primary">{itemsPerPage}</span>
          </span>

          <div className="flex justify-end items-center space-x-4">
            <span className="text-sm text-gray-500">
              Page <span className="font-bold text-primary">{currentPage}</span> of{" "}
              <span className="font-bold text-primary">{totalPages}</span>
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
      </TitleCard>
    </>
  );
}

export default Category;
