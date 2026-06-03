import { useRef, useCallback } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function Footer() {
  const qrRef = useRef<HTMLCanvasElement>(null)

  const handleDownload = useCallback(() => {
    const canvas = qrRef.current
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'after-office-sports-qr.png'
    a.click()
  }, [])

  const pageUrl = 'https://torneosyamistoso.qngine.com.ar'

  return (
    <footer>
      <div className="qr-section">
        <QRCodeCanvas
          ref={qrRef as any}
          value={pageUrl}
          size={100}
          bgColor="#ffffff"
          fgColor="#17211d"
          level="M"
        />
        <div className="qr-info">
          <strong>Compartilo!</strong>
          <span>Escanealo o descargalo para invitar a tus compas.</span>
          <button className="btn-download-qr" onClick={handleDownload}>
            Descargar QR
          </button>
        </div>
      </div>
      After Office Sports · Hecho con ganas y sin overtime.
      <span style={{ display: 'none' }}>v2</span>
    </footer>
  )
}
