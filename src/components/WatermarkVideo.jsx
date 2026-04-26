export default function WatermarkVideo() {
    return (
        <video
            className="watermark-video"
            src="/fondo-bandera.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aria-hidden="true"
        />
    );
}
