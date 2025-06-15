import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategorysContent } from './categorySlice';


const CategoryList = () => {
  const dispatch = useDispatch();
  const { categorys, isLoading } = useSelector((state) => state.Category);

  useEffect(() => {
    dispatch(getCategorysContent());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div>
      <h2>Category List</h2>
      {categorys.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul>
          {categorys.map((category) => (
            <li key={category.id_kategori}>{category.nama_kategori}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;
