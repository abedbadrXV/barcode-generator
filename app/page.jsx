'use client';
import React, { useState, useRef, useEffect } from 'react';
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
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .label {
              width: ${labelWidth}px;
              height: ${labelHeight}px;
              padding: ${labelHeight * 0.05}px ${labelHeight * 0.08}px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              align-items: center;
              page-break-after: always;
              border: 1px solid #ddd;
            }
            .text-above {
              font-size: ${labelHeight * 0.12}px;
              font-weight: bold;
              text-align: center;
              width: 100%;
              word-wrap: break-word;
            }
            .barcode-container {
              width: 90%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .barcode-container svg {
              max-width: 100%;
              height: auto;
            }
            .barcode-number {
              font-size: ${labelHeight * 0.08}px;
              font-family: 'Courier New', monospace;
              text-align: center;
              margin-top: 2px;
            }
            .text-below {
              font-size: ${labelHeight * 0.1}px;
              font-weight: bold;
              text-align: center;
              width: 100%;
              word-wrap: break-word;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .label {
                border: none;
                margin: 0;
                padding: 0.1in 0.15in;
              }
            }
          </style>
        </head>
        <body>
          <div class="label">
            ${textAbove ? `<div class="text-above">${textAbove}</div>` : ''}
            <div class="barcode-container">
              <svg id="barcode-print"></svg>
            </div>
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

  const previewPaddingRatio = 0.08;
  const previewPx = Math.min(window.innerWidth * 0.3, 300);
  const previewScale = previewPx / Math.max(width, height);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Barcode Label Generator</h1>
        <p style={styles.subtitle}>Design and print labels for your thermal printer</p>
      </div>

      <div style={styles.mainGrid}>
        {/* Controls Panel */}
        <div style={styles.controlPanel}>
          <div style={styles.section}>
            <label style={styles.label}>Barcode Number</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Enter barcode (digits)"
              style={styles.input}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Text Above</label>
            <input
              type="text"
              value={textAbove}
              onChange={(e) => setTextAbove(e.target.value)}
              placeholder="Optional"
              style={styles.input}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Text Below</label>
            <input
              type="text"
              value={textBelow}
              onChange={(e) => setTextBelow(e.target.value)}
              placeholder="Optional"
              style={styles.input}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Barcode Format</label>
            <select
              value={barcodeFormat}
              onChange={(e) => setBarcodeFormat(e.target.value)}
              style={styles.select}
            >
              <option value="CODE128">CODE 128</option>
              <option value="CODE39">CODE 39</option>
              <option value="EAN13">EAN-13</option>
              <option value="UPC">UPC</option>
              <option value="ITF">ITF-14</option>
            </select>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.section}>
            <label style={styles.label}>Label Size Presets</label>
            <div style={styles.presetGrid}>
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(preset)}
                  style={{
                    ...styles.presetBtn,
                    ...(width === preset.width && height === preset.height
                      ? styles.presetBtnActive
                      : {}),
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Custom Size</label>
            <div style={styles.sizeInputGroup}>
              <div>
                <label style={styles.smallLabel}>Width</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  min="1"
                  max="10"
                  style={styles.numberInput}
                />
              </div>
              <div>
                <label style={styles.smallLabel}>Height</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  min="1"
                  max="10"
                  style={styles.numberInput}
                />
              </div>
              <div>
                <label style={styles.smallLabel}>Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={styles.unitSelect}
                >
                  <option value="inches">Inches</option>
                  <option value="mm">Millimeters</option>
                </select>
              </div>
            </div>
            <p style={styles.hint}>
              Common thermal printer: 4×6 inches (101×152 mm)
            </p>
          </div>

          <button onClick={handlePrint} style={styles.printBtn}>
            🖨️ Print Label
          </button>
        </div>

        {/* Preview Panel */}
        <div style={styles.previewPanel}>
          <div style={styles.previewHeader}>
            <h2 style={styles.previewTitle}>Label Preview</h2>
            <p style={styles.previewDimensions}>
              {width}" × {height}" ({unit === 'inches' ? 'in' : 'mm'})
            </p>
          </div>

          <div
            style={{
              ...styles.previewContainer,
              width: `${width * previewScale}px`,
              height: `${height * previewScale}px`,
            }}
          >
            {textAbove && (
              <div
                style={{
                  ...styles.previewText,
                  fontSize: `${Math.max(10, width * previewScale * 0.15)}px`,
                  marginBottom: `${previewPaddingRatio * width * previewScale}px`,
                }}
              >
                {textAbove}
              </div>
            )}

            <div style={styles.barcodeWrap}>
              <svg ref={barcodeRef} style={styles.barcodeSvg}></svg>
            </div>

            <div
              style={{
                fontSize: `${Math.max(8, width * previewScale * 0.1)}px`,
                fontFamily: "'Courier New', monospace",
                marginTop: `${previewPaddingRatio * width * previewScale * 0.5}px`,
              }}
            >
              {barcode}
            </div>

            {textBelow && (
              <div
                style={{
                  ...styles.previewText,
                  fontSize: `${Math.max(10, width * previewScale * 0.12)}px`,
                  marginTop: `${previewPaddingRatio * width * previewScale}px`,
                }}
              >
                {textBelow}
              </div>
            )}
          </div>

          <p style={styles.printHint}>
            ✓ Ready to print. Adjust settings above and preview updates in real-time.
          </p>
        </div>
      </div>

      <div style={styles.footer}>
        <p>Built for thermal barcode printers. Supports 2×2" to 4×6" label sizes.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#fafaf9',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e7e5e4',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '32px',
    fontWeight: '700',
    color: '#1c1917',
  },
  subtitle: {
    margin: '0',
    fontSize: '16px',
    color: '#78716d',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 1fr) minmax(300px, 1fr)',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto 60px',
  },
  controlPanel: {
    background: '#fff',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  section: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1c1917',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #d6d3d1',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #d6d3d1',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    background: '#fff',
    cursor: 'pointer',
  },
  divider: {
    height: '1px',
    background: '#e7e5e4',
    margin: '32px 0',
  },
  presetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  presetBtn: {
    padding: '12px',
    fontSize: '13px',
    fontWeight: '500',
    border: '1px solid #d6d3d1',
    borderRadius: '4px',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#78716d',
  },
  presetBtnActive: {
    background: '#1c1917',
    color: '#fff',
    borderColor: '#1c1917',
  },
  sizeInputGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  smallLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#78716d',
    marginBottom: '4px',
  },
  numberInput: {
    width: '100%',
    padding: '8px',
    fontSize: '13px',
    border: '1px solid #d6d3d1',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  unitSelect: {
    width: '100%',
    padding: '8px',
    fontSize: '13px',
    border: '1px solid #d6d3d1',
    borderRadius: '4px',
    boxSizing: 'border-box',
    background: '#fff',
    cursor: 'pointer',
  },
  hint: {
    fontSize: '12px',
    color: '#b1aca7',
    margin: '8px 0 0 0',
  },
  printBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    background: '#1c1917',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  previewPanel: {
    background: '#fff',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  previewHeader: {
    textAlign: 'center',
    marginBottom: '24px',
    width: '100%',
  },
  previewTitle: {
    margin: '0 0 4px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1c1917',
  },
  previewDimensions: {
    margin: '0',
    fontSize: '12px',
    color: '#78716d',
  },
  previewContainer: {
    border: '2px dashed #d6d3d1',
    borderRadius: '4px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    background: '#fef3f2',
    boxSizing: 'border-box',
    marginBottom: '16px',
  },
  previewText: {
    fontWeight: '600',
    textAlign: 'center',
    color: '#1c1917',
    wordWrap: 'break-word',
    width: '100%',
  },
  barcodeWrap: {
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
  },
  barcodeSvg: {
    maxWidth: '100%',
    height: 'auto',
  },
  printHint: {
    fontSize: '12px',
    color: '#78716d',
    margin: '0',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: '#78716d',
    fontSize: '13px',
    borderTop: '1px solid #e7e5e4',
    paddingTop: '20px',
  },
};
