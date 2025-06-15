import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from '../../../../components/Input/InputText';
import ErrorText from '../../../../components/Typography/ErrorText';
import { showNotification } from "../../../common/headerSlice";
import { editCategoryApi } from '../categorySlice';
import { getCategories } from '../categorySlice';


function EditModalBodyCategory({ closeModal, id_kategori }) {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.Category.categories);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryObj, setCategoryObj] = useState({
    id_kategori: "",
    nama_kategori: ""
  });

  // Set data kategori dari store
  useEffect(() => {
    const selected = categories.find(c => c.id_kategori === id_kategori);
    if (selected) {
      setCategoryObj({
        id_kategori: selected.id_kategori,
        nama_kategori: selected.nama_kategori || ""
      });
    }
  }, [id_kategori, categories]);

  const saveEditCategory = async () => {
    setLoading(true);
    setErrorMessage("");

    const categoryToSave = {
      id: categoryObj.id || id_kategori,
      nama_kategori: categoryObj.nama_kategori
    };

    try {
      await dispatch(editCategoryApi(categoryToSave)).unwrap();
      dispatch(showNotification({ message: "Edit Category Success!", status: 1 }));
      await dispatch(getCategories());
      closeModal();
    } catch (error) {
      const errorMsg = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
      setErrorMessage(errorMsg || "Failed to edit category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InputText
        type="text"
        value={categoryObj.nama_kategori}
        updateFormValue={({ updateType, value }) => {
          setErrorMessage("");
          setCategoryObj(prev => ({ ...prev, [updateType]: value }));
        }}
        updateType="nama_kategori"
        className="input input-bordered w-full mt-4"
        labelTitle="Nama Kategori"
        placeholder="Enter category name"
      />

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary px-6" onClick={saveEditCategory} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default EditModalBodyCategory;
