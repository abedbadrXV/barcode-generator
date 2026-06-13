'use client';
import { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

export default function BarcodeGenerator() {
  const [barcode, setBarcode] = useState('1234567890123');
  const [textAbove, setTextAbove] = useState('XIMI-V');
  const [textBelow, setTextBelow] = useState('Price: $9.99');
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(3);
  const [unit, setUnit] = useState('inches');
  const [barcodeFormat, setBarcodeFormat] = useState('CODE128');
  const barcodeRef = useRef(null);

  const presets = {
    small: { width: 2, height: 2, name: '2×2"' },
    medium: { width: 3, height: 3, name: '3×3"' },
    large: { width: 4, height: 6, name: '4×6"' },
    standard: { width: 3, height: 4, name: '3×4"' },
  };

  useEffect(() => {
    if (barcodeRef.current && barcode.trim()) {
      try {
        JsBarcode(barcodeRef.current, barcode, {
          format: barcodeFormat,
          width: 2,
          height: 100,
          displayValue: false,
          margin: 0,
        });
      } catch (err) {
        console.error('Invalid barcode:', err);
      }
    }
  }, [barcode, barcodeFormat]);

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const inches = unit === 'inches' ? 1 : 0.3937;
    const dpi = 300;
    const labelWidth = width * dpi * inches;
    const labelHeight = height * dpi * inches;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Barcode Label</title>
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .label {
              width: ${labelWidth}px;
              height: ${labelHeight}px;
              padding: ${labelHeight * 0.05}px ${labelHeight * 0.08}px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              align-items: center;
            }
            .text-above { font-size: ${labelHeight * 0.12}px; font-weight: bold; text-align: center; }
            .barcode-container { width: 90%; display: flex; justify-content: center; }
            .barcode-container svg { max-width: 100%; height: auto; }
            .barcode-number { font-size: ${labelHeight * 0.08}px; font-family: 'Courier New', monospace; text-align: center; margin-top: 2px; }
            .text-below { font-size: ${labelHeight * 0.1}px; font-weight: bold; text-align: center; }
          </style>
        </head>
        <body>
          <div class="label">
            ${textAbove ? `<div class="text-above">${textAbove}</div>` : ''}
            <div class="barcode-container"><svg id="barcode-print"></svg></div>
            <div class="barcode-number">${barcode}</div>
            ${textBelow ? `<div class="text-below">${textBelow}</div>` : ''}
          </div>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
          <script>
            JsBarcode("#barcode-print", "${barcode}", {
              format: "${barcodeFormat}",
              width: 2,
              height: 100,
              displayValue: false,
              margin: 0,
            });
            window.print();
          <\/script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const applyPreset = (preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const previewScale = Math.min(300, window.innerWidth * 0.3) / Math.max(width, height);

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf9', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Barcode Label Generator</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Design and print labels for your thermal printer</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Controls */}
        <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Barcode Number</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Text Above</label>
            <input
              type="text"
              value={textAbove}
              onChange={(e) => setTextAbove(e.target.value)}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Text Below</label>
            <input
              type="text"
              value={textBelow}
              onChange={(e) => setTextBelow(e.target.value)}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Barcode Format</label>
            <select
              value={barcodeFormat}
              onChange={(e) => setBarcodeFormat(e.target.value)}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="CODE128">CODE 128</option>
              <option value="CODE39">CODE 39</option>
              <option value="EAN13">EAN-13</option>
              <option value="UPC">UPC</option>
              <option value="ITF">ITF-14</option>
            </select>
          </div>

          <div style={{ height: '1px', background: '#ddd', margin: '20px 0' }}></div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Presets</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(preset)}
                  style={{
                    padding: '10px',
                    fontSize: '13px',
                    border: width === preset.width && height === preset.height ? '1px solid #000' : '1px solid #ddd',
                    background: width === preset.width && height === preset.height ? '#000' : '#fff',
                    color: width === preset.width && height === preset.height ? '#fff' : '#000',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Custom Size</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>Width</label>
                <input type="number" value={width} onChange={(e) => setWidth(parseFloat(e.target.value))} step="0.1" style={{ width: '100%', padding: '8px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>Height</label>
                <input type="number" value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} step="0.1" style={{ width: '100%', padding: '8px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: '100%', padding: '8px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="inches">Inches</option>
                  <option value="mm">Millimeters</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrint}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 'bold',
              background: '#1c1917',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🖨️ Print Label
          </button>
        </div>

        {/* Preview */}
        <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ marginBottom: '8px', fontSize: '18px' }}>Preview</h2>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>{width}" × {height}" ({unit === 'inches' ? 'in' : 'mm'})</p>
          
          <div
            style={{
              width: `${width * previewScale}px`,
              height: `${height * previewScale}px`,
              border: '2px dashed #ddd',
              borderRadius: '4px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              background: '#fef3f2',
            }}
          >
            {textAbove && <div style={{ fontSize: `${width * previewScale * 0.15}px`, fontWeight: 'bold', textAlign: 'center' }}>{textAbove}</div>}
            <svg ref={barcodeRef} style={{ maxWidth: '90%', height: 'auto' }}></svg>
            <div style={{ fontSize: `${width * previewScale * 0.1}px`, fontFamily: 'monospace' }}>{barcode}</div>
            {textBelow && <div style={{ fontSize: `${width * previewScale * 0.12}px`, fontWeight: 'bold', textAlign: 'center' }}>{textBelow}</div>}
          </div>

          <p style={{ fontSize: '12px', color: '#666', marginTop: '16px' }}>✓ Ready to print</p>
        </div>
      </div>
    </div>
  );
}
