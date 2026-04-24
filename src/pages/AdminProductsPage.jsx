import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import { useApp } from '../context/AppContext';
import { createProduct, fetchProducts, updateProduct } from '../services/productService';
import { categories, pantSizes, tshirtSizes } from '../utils/constants';

const emptyForm = {
  sku: '',
  name: '',
  slug: '',
  price: '',
  category: categories[0],
  description: '',
  images: [],
  sizes: tshirtSizes.join(','),
  stock: '',
  featured: false
};

const readFilesAsDataUrls = (files) =>
  Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageUrl, setImageUrl] = useState(''); // ✅ FIXED
  const [editingId, setEditingId] = useState('');
  const { flash } = useApp();

  const load = () =>
    fetchProducts({ limit: 50 })
      .then((data) => setProducts(data.items))
      .catch(() => setProducts([]));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (form.images.length > 5) {
      flash('Maximum 5 images allowed');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images,
      sizes: form.sizes
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        flash('Product updated');
      } else {
        await createProduct(payload);
        flash('Product created');
      }

      setForm(emptyForm);
      setEditingId('');
      setImageUrl('');
      load();
    } catch (error) {
      flash(error.response?.data?.message || 'Unable to save product');
    }
  };

  const onImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    const next = [...form.images, ...(await readFilesAsDataUrls(files))].slice(0, 5);
    setForm({ ...form, images: next });
  };

  const addImageByUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;

    if (!url.startsWith('http')) {
      flash('Invalid image URL');
      return;
    }

    if (form.images.includes(url)) {
      flash('Image already added');
      return;
    }

    if (form.images.length >= 5) {
      flash('Maximum 5 images allowed');
      return;
    }

    setForm({
      ...form,
      images: [...form.images, url]
    });

    setImageUrl('');
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      ...product,
      price: product.price,
      stock: product.stock,
      images: product.images || [],
      sizes: product.sizes.join(','),
      featured: product.featured
    });
  };

  return (
    <AdminShell title="Products">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">

        {/* FORM */}
        <form onSubmit={submit} className="card space-y-4 p-6">

          <div className="grid grid-cols-2 gap-3">
            <input className="field" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <input className="field" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>

          <input className="field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

          <div className="grid grid-cols-2 gap-3">
            <input className="field" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input className="field" placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          </div>

          <select
            className="field"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
                sizes:
                  e.target.value === 'Pants'
                    ? pantSizes.join(',')
                    : tshirtSizes.join(',')
              })
            }
          >
            {[...categories, 'Pants', 'Jeans', 'Trousers', 'Cargos', 'Shoes', 'Watches'].map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <input
            className="field"
            placeholder="Sizes comma separated"
            value={form.sizes}
            onChange={(e) => setForm({ ...form, sizes: e.target.value })}
          />

          {/* Upload */}
          <label className="block text-sm font-medium text-slate-600">
            Upload images (max 5)
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onImageUpload}
              className="field mt-2"
            />
          </label>

          {/* URL Upload */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="field flex-1"
            />
            <button
              type="button"
              onClick={addImageByUrl}
              className="btn-secondary px-4"
            >
              Add
            </button>
          </div>

          {/* Preview */}
          <div className="grid grid-cols-5 gap-2">
            {form.images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt="preview" className="h-16 w-full rounded-lg object-cover" />
                <button
                  type="button"
                  className="absolute right-1 top-1 bg-black/70 text-white text-xs px-1 rounded"
                  onClick={() =>
                    setForm({
                      ...form,
                      images: form.images.filter((_, i) => i !== index)
                    })
                  }
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <textarea
            className="field min-h-24"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm({ ...form, featured: e.target.checked })
              }
            />
            Featured
          </label>

          <button className="btn-primary w-full">
            {editingId ? 'Update product' : 'Add product'}
          </button>
        </form>

        {/* TABLE */}
        <div className="card overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="px-4 py-3">{product.sku}</td>
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">₹{product.price}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(product)}
                      className="text-brand-navy font-semibold"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AdminShell>
  );
};

export default AdminProductsPage;