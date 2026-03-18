import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, X, Plus, AlertCircle, CheckCircle, Loader, RefreshCw, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { lookupBarcode } from '../utils/productLookup';
import AddDrinkModal from '../components/AddDrinkModal';
import ProPaywall from '../components/ProPaywall';

function ProductCard({ product, onConfirm, onCancel, onManualCaffeine }) {
  const [manualMg, setManualMg] = useState('');
  const [editingCaffeine, setEditingCaffeine] = useState(!product.hasCaffeineData);

  const caffeine = editingCaffeine ? parseFloat(manualMg) || 0 : product.caffeine;

  return (
    <div className="animate-slide-up bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl overflow-hidden">
      {product.image && (
        <img src={product.image} alt={product.name} className="w-full h-40 object-contain bg-white p-2" />
      )}
      <div className="p-4">
        <p className="text-neutral-500 text-xs">{product.brand}</p>
        <p className="text-white font-bold text-lg mt-0.5 leading-snug">{product.name}</p>

        {product.hasCaffeineData && !editingCaffeine ? (
          <div className="flex items-center gap-2 mt-3">
            <CheckCircle size={15} className="text-green-400 shrink-0" />
            <span className="text-green-400 font-bold text-lg">{product.caffeine}mg</span>
            <span className="text-neutral-500 text-sm">
              {product.source === 'local' || product.source === 'local-match' ? 'from database' : 'caffeine found'}
            </span>
            <button onClick={() => setEditingCaffeine(true)} className="ml-auto text-neutral-500 text-xs hover:text-white">Edit</button>
          </div>
        ) : (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={14} className="text-yellow-400 shrink-0" />
              <span className="text-yellow-400 text-xs">Caffeine not found — enter manually</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={manualMg}
                onChange={e => setManualMg(e.target.value)}
                placeholder="e.g. 160"
                min="0"
                max="1000"
                autoFocus={!product.hasCaffeineData}
                className="flex-1 bg-[#111] border border-[#333] rounded-xl px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-brand-500"
              />
              <span className="flex items-center text-neutral-500 text-sm pr-1">mg</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-[#222] border border-[#333] rounded-xl py-3 text-white text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ ...product, caffeine })}
            disabled={caffeine <= 0}
            className="flex-1 bg-brand-500 disabled:bg-[#333] disabled:text-neutral-600 rounded-xl py-3 text-black text-sm font-bold transition-colors"
          >
            Add {caffeine > 0 ? `(${caffeine}mg)` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Scanner() {
  const { addEntry, isPro } = useApp();

  if (!isPro) {
    return <ProPaywall featureName="Barcode scanning" />;
  }
  const [scannerState, setScannerState] = useState('idle'); // idle | starting | scanning | loading | result | error
  const [product, setProduct] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const scannerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, []);

  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    const el = document.getElementById('qr-reader');
    if (el) el.innerHTML = '';
  }, []);

  const startScanner = useCallback(async () => {
    setScannerState('starting');
    setProduct(null);
    setErrorMsg('');

    try {
      const { Html5QrcodeScanner, Html5QrcodeSupportedFormats } = await import('html5-qrcode');

      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 260, height: 120 },
          aspectRatio: 1.5,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
          ],
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
        },
        false
      );

      scanner.render(
        async (barcode) => {
          scanner.clear().catch(() => {});
          scannerRef.current = null;
          if (!mountedRef.current) return;

          setScannerState('loading');
          const result = await lookupBarcode(barcode);

          if (!mountedRef.current) return;
          setProduct(result);
          setScannerState('result');
        },
        () => {} // ignore per-frame errors
      );

      scannerRef.current = scanner;
      if (mountedRef.current) setScannerState('scanning');
    } catch (err) {
      if (mountedRef.current) {
        setErrorMsg('Camera access denied or not available.');
        setScannerState('error');
      }
    }
  }, []);

  const handleConfirm = (productData) => {
    addEntry({
      name: productData.name,
      caffeine: productData.caffeine,
      size: '',
      emoji: '🔖',
      drinkId: null,
      barcode: productData.barcode,
    });
    setScannerState('idle');
    setProduct(null);
  };

  const handleCancel = () => {
    setScannerState('idle');
    setProduct(null);
  };

  const handleRetry = () => {
    stopScanner();
    startScanner();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="px-4 pt-14 pb-4">
        <h1 className="text-white text-2xl font-black tracking-tight">Scan Barcode</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Point your camera at a product barcode</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Scanner area */}
        {(scannerState === 'idle' || scannerState === 'error') && (
          <div className="flex flex-col items-center py-6 gap-4">
            <div className="w-24 h-24 bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl flex items-center justify-center">
              <Camera size={40} className="text-brand-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">Scan a barcode</p>
              <p className="text-neutral-500 text-sm mt-1">Works with most food & drink products</p>
            </div>
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-red-400 text-sm text-center">
                {errorMsg}
              </div>
            )}
            <button
              onClick={startScanner}
              className="bg-brand-500 text-black font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2 active:scale-95 transition-transform shadow-lg shadow-brand-500/25"
            >
              <Camera size={18} />
              Start Camera
            </button>
          </div>
        )}

        {scannerState === 'starting' && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Loader size={32} className="text-brand-400 animate-spin" />
            <p className="text-neutral-400 text-sm">Starting camera...</p>
          </div>
        )}

        {/* The html5-qrcode renderer mounts here */}
        <div
          id="qr-reader"
          className={`overflow-hidden rounded-3xl ${scannerState === 'scanning' ? 'block' : 'hidden'}`}
          style={{ '--tw-ring-shadow': 'none' }}
        />

        {scannerState === 'scanning' && (
          <div className="flex justify-center">
            <button
              onClick={() => { stopScanner(); setScannerState('idle'); }}
              className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm transition-colors"
            >
              <X size={14} /> Cancel scan
            </button>
          </div>
        )}

        {scannerState === 'loading' && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Loader size={32} className="text-brand-400 animate-spin" />
            <p className="text-neutral-400 text-sm">Looking up product...</p>
          </div>
        )}

        {scannerState === 'result' && product && (
          <>
            {product.found ? (
              <ProductCard
                product={product}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            ) : (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-5 text-center">
                <AlertCircle size={32} className="text-yellow-400 mx-auto mb-3" />
                <p className="text-white font-semibold">Product not found</p>
                <p className="text-neutral-500 text-sm mt-1 mb-4">
                  Barcode: {product.barcode}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleRetry}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#222] rounded-xl py-3 text-white text-sm font-medium"
                  >
                    <RefreshCw size={14} /> Try again
                  </button>
                  <button
                    onClick={() => { setAddModalOpen(true); handleCancel(); }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-brand-500 rounded-xl py-3 text-black text-sm font-bold"
                  >
                    <Plus size={14} /> Add manually
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-[#1f1f1f]" />
          <span className="text-neutral-600 text-xs">or</span>
          <div className="flex-1 h-px bg-[#1f1f1f]" />
        </div>

        {/* Manual add button */}
        <button
          onClick={() => setAddModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl py-4 text-neutral-300 text-sm font-medium hover:bg-[#222] transition-colors"
        >
          <Search size={16} className="text-neutral-500" />
          Search drinks database
        </button>

        {/* Tips */}
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
          <p className="text-neutral-400 text-xs font-semibold mb-2">SCANNING TIPS</p>
          <ul className="space-y-1.5 text-neutral-500 text-xs">
            <li>• Hold the barcode within the highlighted area</li>
            <li>• Ensure good lighting for best results</li>
            <li>• Works with EAN-13 and UPC barcodes on most drinks</li>
            <li>• Caffeine data powered by Open Food Facts</li>
          </ul>
        </div>
      </div>

      <AddDrinkModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
}
