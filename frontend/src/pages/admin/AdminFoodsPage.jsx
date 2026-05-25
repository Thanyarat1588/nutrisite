import { useState, useEffect, useRef } from 'react';
import { getFoods, getCategories, createFood, updateFood, deleteFood } from '../../utils/api';
import { Spinner } from '../../components/index';
import toast from 'react-hot-toast';

const EMOJIS = ['🥗','🐟','🥩','🥚','🥦','🥕','🍎','🥑','🌾','🍵','🥜','🫐','🍊','🍋','🧄','🥬','🫒','🍇','🥝','🍓'];
const COLORS  = ['#f0fdf4','#fffbeb','#fef9c3','#fff7ed','#f0fdfa','#eff6ff','#fdf4ff','#fce7f3'];
const EMPTY   = { title:'',subtitle:'',description:'',category_id:'',calories:0,protein:0,carbs:0,fat:0,benefits:[],emoji:'🥗',bg_color:'#f0fdf4',is_featured:false };

export default function AdminFoodsPage() {
  const [foods,   setFoods]   = useState([]);
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving,  setSaving]  = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getFoods({ limit:200 }), getCategories()])
      .then(([fRes, cRes]) => { setFoods(fRes.data.data); setCats(cRes.data.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = foods.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    (f.subtitle||'').toLowerCase().includes(search.toLowerCase())
  );
  const catMap = Object.fromEntries(cats.map(c => [c.id, c]));

  const handleDelete = async (food) => {
    try { await deleteFood(food.id); toast.success('ลบสำเร็จ'); setConfirm(null); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'ลบไม่สำเร็จ'); }
  };

  return (
    <div>
      {modal   && <FoodModal food={modal==='new'?null:modal} cats={cats} saving={saving} setSaving={setSaving} onSave={load} onClose={()=>setModal(null)}/>}
      {confirm && <ConfirmModal message={`ลบ "${confirm.title}"?`} onConfirm={()=>handleDelete(confirm)} onClose={()=>setConfirm(null)}/>}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">จัดการอาหาร</h1>
          <p className="text-gray-400 text-xs sm:text-sm">{foods.length} รายการ</p>
        </div>
        <button onClick={() => setModal('new')}
          className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-primary text-white font-semibold
                     rounded-xl text-xs sm:text-sm whitespace-nowrap hover:bg-primary-dark">
          + เพิ่มรายการ
        </button>
      </div>

      <div className="mb-4">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 ค้นหา..."
          className="w-full sm:max-w-xs md:max-w-sm px-4 py-2.5 border border-gray-200 rounded-xl
                     text-sm focus:outline-none focus:border-primary"/>
      </div>

      {loading ? <Spinner/> : (
        <>
          {/* ── Mobile Card (< sm) ── */}
          <div className="sm:hidden space-y-3">
            {filtered.map(f => {
              const cat = catMap[f.category_id];
              return (
                <div key={f.id} className="bg-white rounded-2xl shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                         style={{ background: f.bg_color||'#f0fdf4' }}>
                      {f.image_url ? <img src={f.image_url} alt="" className="w-full h-full object-cover rounded-xl"/> : f.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-semibold text-sm text-gray-900 truncate">{f.title}</p>
                        {f.is_featured===1 && <span className="text-amber-400 text-xs">⭐</span>}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{f.subtitle}</p>
                      {cat && <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:cat.bg_color,color:cat.color}}>{cat.icon} {cat.name}</span>}
                      <p className="text-xs text-gray-400 mt-1">{Number(f.calories).toFixed(0)} kcal · {Number(f.protein).toFixed(1)}g protein</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={()=>setModal(f)} className="flex-1 py-2 border border-primary text-primary text-xs font-semibold rounded-xl hover:bg-primary-xlight">✏️ แก้ไข</button>
                    <button onClick={()=>setConfirm(f)} className="flex-1 py-2 border border-red-300 text-red-500 text-xs font-semibold rounded-xl hover:bg-red-50">🗑️ ลบ</button>
                  </div>
                </div>
              );
            })}
            {filtered.length===0 && <div className="text-center py-12 text-gray-400">ไม่พบข้อมูล</div>}
          </div>

          {/* ── Tablet Card Grid (sm–md) ── */}
          <div className="hidden sm:grid md:hidden grid-cols-2 gap-4">
            {filtered.map(f => {
              const cat = catMap[f.category_id];
              return (
                <div key={f.id} className="bg-white rounded-2xl shadow-sm p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                         style={{ background: f.bg_color||'#f0fdf4' }}>
                      {f.image_url ? <img src={f.image_url} alt="" className="w-full h-full object-cover rounded-xl"/> : f.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{f.title} {f.is_featured===1?'⭐':''}</p>
                      {cat && <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5" style={{background:cat.bg_color,color:cat.color}}>{cat.icon} {cat.name}</span>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{Number(f.calories).toFixed(0)} kcal · โปรตีน {Number(f.protein).toFixed(1)}g</p>
                  <div className="flex gap-2">
                    <button onClick={()=>setModal(f)} className="flex-1 py-2 border border-primary text-primary text-xs font-semibold rounded-xl hover:bg-primary-xlight">แก้ไข</button>
                    <button onClick={()=>setConfirm(f)} className="flex-1 py-2 border border-red-300 text-red-500 text-xs font-semibold rounded-xl hover:bg-red-50">ลบ</button>
                  </div>
                </div>
              );
            })}
            {filtered.length===0 && <div className="col-span-2 text-center py-12 text-gray-400">ไม่พบข้อมูล</div>}
          </div>

          {/* ── Desktop Table (md+) ── */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>{['อาหาร','หมวดหมู่','แคลอรี','โปรตีน','แนะนำ','จัดการ'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(f => {
                    const cat = catMap[f.category_id];
                    return (
                      <tr key={f.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{background:f.bg_color||'#f0fdf4'}}>
                              {f.image_url ? <img src={f.image_url} alt="" className="w-full h-full object-cover rounded-xl"/> : f.emoji}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-gray-900">{f.title}</p>
                              <p className="text-xs text-gray-400">{f.subtitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {cat && <span className="text-xs font-semibold px-2 py-1 rounded-full inline-block" style={{background:cat.bg_color,color:cat.color}}>{cat.icon} {cat.name}</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{Number(f.calories).toFixed(0)} kcal</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{Number(f.protein).toFixed(1)}g</td>
                        <td className="px-4 py-3 text-center">{f.is_featured===1?'⭐':<span className="text-gray-200">○</span>}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={()=>setModal(f)} className="px-3 py-1.5 border border-primary text-primary text-xs font-semibold rounded-lg hover:bg-primary-xlight">แก้ไข</button>
                            <button onClick={()=>setConfirm(f)} className="px-3 py-1.5 border border-red-300 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50">ลบ</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length===0 && <div className="text-center py-12 text-gray-400">ไม่พบข้อมูล</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Modal ── bottom-sheet on mobile, centered on md+ */
function FoodModal({ food, cats, saving, setSaving, onSave, onClose }) {
  const [form,    setForm]    = useState(
    food ? { ...food, benefits:Array.isArray(food.benefits)?food.benefits:JSON.parse(food.benefits||'[]'), is_featured:food.is_featured===1 }
         : { ...EMPTY, category_id:cats[0]?.id||'' }
  );
  const [benefit, setBenefit] = useState('');
  const [preview, setPreview] = useState(food?.image_url||null);
  const [file,    setFile]    = useState(null);
  const fileRef = useRef();
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleFile = (e) => {
    const f=e.target.files[0]; if(!f)return;
    setFile(f);
    const r=new FileReader(); r.onload=ev=>setPreview(ev.target.result); r.readAsDataURL(f);
  };
  const addBenefit = () => { if(!benefit.trim())return; set('benefits',[...form.benefits,benefit.trim()]); setBenefit(''); };

  const handleSubmit = async () => {
    if(!form.title.trim()||!form.category_id) return toast.error('กรอกชื่อและหมวดหมู่ก่อน');
    setSaving(true);
    try {
      const fd=new FormData();
      Object.entries(form).forEach(([k,v])=>{
        if(k==='benefits') fd.append(k,JSON.stringify(v));
        else if(k==='is_featured') fd.append(k,v?'true':'false');
        else fd.append(k,v??'');
      });
      if(file) fd.append('image',file);
      if(food?.id){ await updateFood(food.id,fd); toast.success('แก้ไขสำเร็จ'); }
      else        { await createFood(fd);          toast.success('เพิ่มสำเร็จ'); }
      onSave(); onClose();
    } catch(err){ toast.error(err.response?.data?.message||'บันทึกไม่สำเร็จ'); }
    finally{ setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50
                    flex items-end sm:items-center justify-center
                    p-0 sm:p-4 md:p-6"
         onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="bg-white w-full
                      sm:max-w-lg md:max-w-xl
                      rounded-t-3xl sm:rounded-2xl
                      max-h-[92vh] sm:max-h-[88vh]
                      overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-base sm:text-lg">{food?'แก้ไขรายการ':'เพิ่มรายการใหม่'}</h2>
          <button onClick={onClose} className="text-gray-400 text-xl hover:text-gray-600 w-8 h-8 flex items-center justify-center">✕</button>
        </div>
        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Image upload */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">รูปภาพ</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
            {preview
              ? <div className="relative inline-block">
                  <img src={preview} alt="" className="w-24 h-24 object-cover rounded-xl"/>
                  <button onClick={()=>{setPreview(null);setFile(null);set('image_url',null)}}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                </div>
              : <button onClick={()=>fileRef.current.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-5 text-center hover:border-primary hover:bg-primary-xlight transition-all">
                  <div className="text-2xl mb-1">📁</div>
                  <p className="text-xs sm:text-sm text-gray-400">แตะหรือคลิกเพื่ออัปโหลดรูปภาพ</p>
                </button>
            }
          </div>
          {/* Emoji + Color — 2 cols on all sizes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">ไอคอน</label>
              <div className="flex flex-wrap gap-1.5">
                {EMOJIS.map(e=>(
                  <button key={e} onClick={()=>set('emoji',e)}
                    className={`text-xl p-1.5 rounded-lg ${form.emoji===e?'bg-primary-xlight ring-2 ring-primary':'hover:bg-gray-100'}`}>{e}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">สีพื้นหลัง</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c=>(
                  <button key={c} onClick={()=>set('bg_color',c)}
                    className={`w-8 h-8 rounded-lg ${form.bg_color===c?'ring-2 ring-offset-1 ring-gray-800 scale-110':''}`}
                    style={{background:c}}/>
                ))}
              </div>
            </div>
          </div>
          {/* Title + Subtitle
              mobile: stack / sm+: 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">ชื่ออาหาร *</label>
              <input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="เช่น แซลมอนย่าง"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">ชื่อย่อ</label>
              <input value={form.subtitle} onChange={e=>set('subtitle',e.target.value)} placeholder="เช่น อุดมด้วยโอเมก้า-3"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"/>
            </div>
          </div>
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">หมวดหมู่ *</label>
            <select value={form.category_id} onChange={e=>set('category_id',Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white">
              <option value="">-- เลือกหมวดหมู่ --</option>
              {cats.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">คำอธิบาย</label>
            <textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary resize-none"/>
          </div>
          {/* Nutrition
              mobile: 2 cols / sm+: 4 cols */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">โภชนาการ (ต่อ 100g)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[['calories','แคลอรี'],['protein','โปรตีน'],['carbs','คาร์บ'],['fat','ไขมัน']].map(([k,l])=>(
                <div key={k}>
                  <p className="text-xs text-gray-400 mb-1">{l}</p>
                  <input type="number" min="0" step="0.1" value={form[k]} onChange={e=>set(k,parseFloat(e.target.value)||0)}
                    className="w-full px-2 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary text-center"/>
                </div>
              ))}
            </div>
          </div>
          {/* Benefits */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">ประโยชน์</label>
            <div className="flex gap-2 mb-2">
              <input value={benefit} onChange={e=>setBenefit(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addBenefit()}
                placeholder="พิมพ์แล้วกด Enter..."
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"/>
              <button onClick={addBenefit} className="px-3 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl">+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.benefits.map((b,i)=>(
                <span key={i} className="inline-flex items-center gap-1 bg-primary-xlight text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                  {b}<button onClick={()=>set('benefits',form.benefits.filter((_,j)=>j!==i))} className="ml-0.5 text-primary/60 hover:text-primary">✕</button>
                </span>
              ))}
            </div>
          </div>
          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={!!form.is_featured} onChange={e=>set('is_featured',e.target.checked)} className="w-4 h-4 accent-primary"/>
            <span className="text-sm text-gray-700 font-medium">⭐ แสดงในรายการแนะนำ</span>
          </label>
        </div>
        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">ยกเลิก</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl text-sm disabled:opacity-60">
            {saving?'กำลังบันทึก...':'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-7 max-w-sm w-full text-center shadow-2xl">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="font-bold text-base mb-2">ยืนยันการลบ</h3>
        <p className="text-gray-500 text-sm mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">ยกเลิก</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm">ลบ</button>
        </div>
      </div>
    </div>
  );
}
