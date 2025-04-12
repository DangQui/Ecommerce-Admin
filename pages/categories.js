import Layout from "@/components/Layout";
import { Category } from "@/models/Category";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {

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
        await axios.post('/api/categories', {name, parentCategory});
        setName("");
        fetchCategories();
    }

    return (
        <Layout>
            <h1>Danh Mục Sản Phẩm</h1>
            <label>Tên danh mục mới</label>
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
                    <option value="">Danh mục sản phẩm</option>
                    {categories.length > 0 && categories.map(Category => (
                        <option value={Category._id}>{Category.name}</option>
                    ))}
                </select>
                <button type="submit" className="btn-primary py-1">Lưu</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Danh mục</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(Category => (
                        <tr>
                            <td>{Category.name}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}