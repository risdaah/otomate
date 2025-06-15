import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { createNewProduct, fetchKategori, fetchMobil, fetchJenisStok, getProductsContent } from "../productSlice";

const INITIAL_PRODUCT_OBJ = {
  nama: "",
  stok: "",
  harga: "",
  id_kategori: "",
  id_mobil: "",
  id_jenis_stok: ""
};

function CreateModalBodyProduct({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ProductObj, setProductObj] = useState(INITIAL_PRODUCT_OBJ);

  // Ambil data dari Redux store
  const { kategoriList, mobilList, jenisStokList } = useSelector((state) => state.Product);

  // Fetch hanya jika data belum ada
  useEffect(() => {
    if (kategoriList.length === 0) dispatch(fetchKategori());
    if (mobilList.length === 0) dispatch(fetchMobil());
    if (jenisStokList.length === 0) dispatch(fetchJenisStok());
  }, [dispatch, kategoriList, mobilList, jenisStokList]);

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setProductObj({ ...ProductObj, [updateType]: value });
  };

  const saveNewProduct = async () => {
    const { nama, stok, harga, id_kategori, id_mobil, id_jenis_stok } = ProductObj;

    if (!nama.trim()) return setErrorMessage("Nama produk wajib diisi");
    if (!stok.trim()) return setErrorMessage("Stok produk wajib diisi");

    const newProduct = {
      nama,
      stok,
      harga,
      id_kategori,
      id_mobil,
      id_jenis_stok,
    };

    await dispatch(createNewProduct(newProduct));
    await dispatch(getProductsContent());
    await dispatch(showNotification({ message: "Produk berhasil ditambahkan!", status: 1 }));
    closeModal();
  };


  return (
    <>
      <InputText
        type="text"
        defaultValue={ProductObj.nama}
        updateType="nama"
        labelTitle="Nama Produk"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={ProductObj.stok}
        updateType="stok"
        labelTitle="Stok Produk"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={ProductObj.harga}
        updateType="harga"
        labelTitle="Harga Produk"
        updateFormValue={updateFormValue}
      />

      <div className="form-control mt-3">
        <label htmlFor="kategori" className="ml-1">
          Kategori
        </label>
        <select
          id="kategori"
          value={ProductObj.id_kategori}
          onChange={(e) => updateFormValue({ updateType: "id_kategori", value: e.target.value })}
          className="select select-bordered mt-2"
        >
          <option value="">Pilih Kategori</option>
          {kategoriList.map((kategori) => (
            <option key={kategori.id_kategori} value={kategori.id_kategori}>
              {kategori.nama_kategori}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control mt-3">
        <label htmlFor="mobil" className="ml-1">
          Mobil
        </label>
        <select
          id="mobil"
          value={ProductObj.id_mobil}
          onChange={(e) => updateFormValue({ updateType: "id_mobil", value: e.target.value })}
          className="select select-bordered mt-2"
        >
          <option value="">Pilih Mobil</option>
          {mobilList.map((mobil) => (
            <option key={mobil.id_mobil} value={mobil.id_mobil}>
              {mobil.nama_mobil}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control mt-3">
        <label htmlFor="jenisStok" className="ml-1">
          Jenis Stok
        </label>
        <select
          id="jenisStok"
          value={ProductObj.id_jenis_stok}
          onChange={(e) => updateFormValue({ updateType: "id_jenis_stok", value: e.target.value })}
          className="select select-bordered mt-2"
        >
          <option value="">Pilih Jenis Stok</option>
          {jenisStokList.map((jenis) => (
            <option key={jenis.id_jenis_stok} value={jenis.id_jenis_stok}>
              {jenis.jenis}
            </option>
          ))}
        </select>
      </div>

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary px-6" onClick={saveNewProduct}>Save</button>
      </div>
    </>
  );
}

export default CreateModalBodyProduct;
