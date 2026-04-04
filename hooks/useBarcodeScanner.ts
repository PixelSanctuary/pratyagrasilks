import { useEffect, useRef } from 'react';

interface UseBarcodeScannnerOptions {
    onScan: (barcode: string) => void;
    enabled?: boolean;
}

export function useBarcodeScanner({ onScan, enabled = true }: UseBarcodeScannnerOptions) {
    const bufferRef = useRef<string>('');
    const firstKeystrokeRef = useRef<number>(0);
    const callbackRef = useRef<(barcode: string) => void>(onScan);
    const enabledRef = useRef<boolean>(enabled);

    useEffect(() => { callbackRef.current = onScan; }, [onScan]);
    useEffect(() => { enabledRef.current = enabled; }, [enabled]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!enabledRef.current) return;

            if (e.key === 'Enter') {
                const elapsed = Date.now() - firstKeystrokeRef.current;
                if (bufferRef.current.length > 0 && elapsed < 50) {
                    callbackRef.current(bufferRef.current);
                }
                bufferRef.current = '';
                firstKeystrokeRef.current = 0;
                return;
            }

            if (e.key.length === 1) {
                if (bufferRef.current.length === 0) {
                    firstKeystrokeRef.current = Date.now();
                }
                bufferRef.current += e.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
}
