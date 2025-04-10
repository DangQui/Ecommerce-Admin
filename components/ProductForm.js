import Layout from "@/components/Layout";
import axios from "axios";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";


export default function ProductForm({
    // Các giá trị hiện tại
    _id,
    title: existingTitle, 
    description: existingDescription, 
    price: existingPrice,
    images,
}) {
    const[title, setTitle] = useState(existingTitle || "");
    const[description, setDescription] = useState(existingDescription || "");
    const[price, setPrice] = useState(existingPrice || "");
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {title, description, price};
        if (_id) {
            // Cập nhật sản phẩm
            await axios.put('/api/products', {...data, _id});
        } else{
            // Thêm mới sản phẩm
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
    }

    async function upLoadImages(ev) {
        const files = ev.target?.files;
        if (files.length > 0) {
            const data = new FormData();
            for (const file of files){
                data.append('file', file);
            }
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,

            })
            console.log(res);
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Tên sản phẩm</label>
            <input 
                type="text" 
                placeholder="Nhập tên sản phẩm" 
                value={title}
                onChange={ev => setTitle(ev.target.value)} 
            />
            <label>
                Hình ảnh
            </label>
            <div className="mb-2">
                <label className="w-24 h-24 text-center 
                flex items-center justify-center text-sm gap-1
                text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                    stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" 
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 
                        21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Tải lên
                    </div>
                    <input type="file" onChange={upLoadImages} className="hidden" />
                </label>
                {!images?.length && (
                    <div>Không có hình ảnh của sản phẩm này</div>
                )}
            </div>
            <label>Mô tả</label>
            <textarea 
                placeholder="Nhập mô tả sản phẩm" 
                value={description} 
                onChange={ev => setDescription(ev.target.value)}
            />
            <label>Giá (VND)</label>
            <input 
                type="number" 
                placeholder="Nhập giá sản phẩm" 
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />
            <button type="submit" className="btn-primary">Lưu</button>
        </form>
    );
}