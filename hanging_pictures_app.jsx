import {BrowserRouter as Router,Route,Routes,useNavigate} from 'react-router-dom';
import {useState} from 'react';

function PageOne({setFormData}) {
  const [wallWidth,setWallWidth]=useState('');
  const [pictureWidth,setPictureWidth]=useState('');
  const [quantity,setQuantity]=useState('');
  const [hangingHeight,setHangingHeight]=useState('');
  const navigate=useNavigate();

  const handleNext=()=>{
    setFormData({wallWidth,pictureWidth,quantity,hangingHeight});
    navigate('/layout');
  };

  return(
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Picture Hanging Assistant</h1>
      <input placeholder="Wall Width (inches)" value={wallWidth} onChange={e=>setWallWidth(e.target.value)} className="border p-2 w-full" />
      <input placeholder="Picture Width (inches)" value={pictureWidth} onChange={e=>setPictureWidth(e.target.value)} className="border p-2 w-full" />
      <input placeholder="Quantity of Pictures" value={quantity} onChange={e=>setQuantity(e.target.value)} className="border p-2 w-full" />
      <input placeholder="Hanging Height (inches from floor)" value={hangingHeight} onChange={e=>setHangingHeight(e.target.value)} className="border p-2 w-full" />
      <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Calculate Layout</button>
    </div>
  );
}

function PageTwo({formData,setOffsets}) {
  const navigate=useNavigate();
  const {wallWidth,pictureWidth,quantity}=formData;
  const wall=parseFloat(wallWidth);
  const pic=parseFloat(pictureWidth);
  const qty=parseInt(quantity);
  const totalPicsWidth=pic*qty;
  const gap=(wall-totalPicsWidth)/(qty+1);

  const centers=Array.from({length:qty},(_,i)=>gap+i*(pic+gap)+pic/2);

  const handleReset=()=>navigate('/');
  const handleApplyOffsets=()=>navigate('/offsets');

  return(
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Layout Results</h2>
      <p>Even Gap Between Pictures: <strong>{gap.toFixed(2)} in</strong></p>
      <h3 className="font-semibold">Center Marks (inches from left wall):</h3>
      <ul className="list-disc ml-4">
        {centers.map((c,i)=>(<li key={i}>Picture {i+1}: {c.toFixed(2)} in</li>))}
      </ul>
      <div className="flex space-x-4">
        <button onClick={handleReset} className="bg-gray-500 text-white px-4 py-2 rounded">Reset</button>
        <button onClick={handleApplyOffsets} className="bg-green-600 text-white px-4 py-2 rounded">Apply Offsets</button>
      </div>
      <div className="mt-6 border-t pt-4">
        <div className="relative h-24 border w-full bg-gray-100">
          {centers.map((c,i)=>(
            <div key={i} className="absolute top-8 w-1 h-12 bg-blue-600" style={{left:`${(c/wall)*100}%`,transform:'translateX(-50%)'}}>
              <span className="absolute -top-6 text-xs text-center w-10 left-1/2 -translate-x-1/2">Pic {i+1}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-center mt-2">Visual Layout (wall width scaled)</p>
      </div>
    </div>
  );
}

function PageThree({offsets,setOffsets,quantity}) {
  const navigate=useNavigate();

  const handleOffsetChange=(i,value)=>{
    const newOffsets=[...offsets];
    newOffsets[i]=parseFloat(value)||0;
    setOffsets(newOffsets);
  };

  return(
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Offset Each Picture (inches)</h2>
      {Array.from({length:quantity},(_,i)=>(
        <input key={i} placeholder={`Offset Picture ${i+1}`} onChange={e=>handleOffsetChange(i,e.target.value)} className="border p-2 w-full" />
      ))}
      <button onClick={()=>navigate('/layout')} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Return to Layout</button>
    </div>
  );
}

export default function App() {
  const [formData,setFormData]=useState({});
  const [offsets,setOffsets]=useState([]);

  return(
    <Router>
      <Routes>
        <Route path="/" element={<PageOne setFormData={setFormData} />} />
        <Route path="/layout" element={<PageTwo formData={formData} setOffsets={setOffsets} />} />
        <Route path="/offsets" element={<PageThree quantity={parseInt(formData.quantity||0)} offsets={offsets} setOffsets={setOffsets} />} />
      </Routes>
    </Router>
  );
}
