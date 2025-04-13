import Layout from "@/components/Layout";
import { Category } from "@/models/Category";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {

    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    async function saveCategory(ev) {
        ev.preventDefault();    
        const data = {name, parentCategory};
        if (editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setName("");
        fetchCategories();
    }

    function editCategory(Category) {
        setEditedCategory(Category);
        setName(Category.name);
        setParentCategory(Category.parent?._id);
    }

    function deleteCategory(Category) {
        swal.fire({
            title: 'Bạn có chắc chắn không?',
            text: `Bạn có muốn xóa ${Category.name} không?`,
            showCancelButton: true,
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Xóa',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            // when confirmed and promise resolved...
            if (result.isConfirmed) {
                const {_id} = Category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }

    return (
        <Layout>
            <h1>Danh Mục Sản Phẩm</h1>
            <label>{editedCategory ? `Chỉnh sửa ${editedCategory.name} ` : 'Tạo danh mục mới'}</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                    className="!mb-0" 
                    type="text" 
                    placeholder="Nhập tên danh mục" 
                    onChange={ev => setName(ev.target.value)} 
                    value={name}
                />
                <select className="!mb-0" 
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory}>
                    <option value="">Không có danh mục</option>
                    {categories.length > 0 && categories.map(Category => (
                        <option value={Category._id}>{Category.name}</option>
                    ))}
                </select>
                <button type="submit" className="btn-primary py-1">Lưu</button>
            </form>

            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Sản phẩm</td>
                        <td>Danh mục</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(Category => (
                        <tr>
                            <td>{Category.name}</td>
                            <td>{Category?.parent?.name}</td>
                            <td>
                                <button onClick={() => editCategory(Category)} className="btn-primary mr-1">Chỉnh sửa</button>
                                <button onClick={() => deleteCategory(Category)} className="btn-primary">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
));