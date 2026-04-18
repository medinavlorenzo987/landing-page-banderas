export default function WatermarkVideo() {
    return (
        <video 
            className="watermark-video" 
            src="/fondo-bandera.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            aria-hidden="true"
        />
    );
}
