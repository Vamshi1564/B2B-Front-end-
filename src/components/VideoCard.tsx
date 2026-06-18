import { useState, useRef, useEffect } from "react";
import { API_URL } from "@/config/api";

export default function VideoCard({ video }: any) {
  const [play, setPlay] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 🔥 Force first frame load (no autoplay)
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.currentTime = 0.1; // 👈 forces frame render
    }
  }, []);

  const handlePlay = () => {
    setPlay(true);

    setTimeout(() => {
      videoRef.current?.play();
    }, 100);
  };

  return (
     <div className="relative w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl  bg-[#FAFAD2] h-[400px] mb-[-20px]">


      {/* 🎬 MAIN VIDEO */}
      {video && (
        <video
          ref={videoRef}
          src={`${API_URL}${video.video_url}`}
          className={`w-full h-full object-cover ${
            play ? "block" : "hidden"
          }`}
          controls
          playsInline
        />
      )}

      {/* 🎯 PREVIEW (NO AUTOPLAY) */}
      {video && !play && (
        <div className="absolute inset-0">

          <video
            ref={previewRef}
            src={`${API_URL}${video.video_url}`}
            className="w-full h-full object-cover"
            muted
            preload="auto"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlay}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition"
            >
              <div className="w-0 h-0 border-l-[25px] border-l-black border-y-[15px] border-y-transparent ml-1"></div>
            </button>
          </div>

        </div>
      )}

      {/* ❌ NO VIDEO */}
      {!video && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-center px-6 bg-[#FAFAD2]">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-muted-foreground px-6">
              Launching <span className="text-red-500">Soon</span>
            </h2>
            <p className="text-lg md:text-xl text-black/70">
              Something exciting is coming soon 🚀
            </p>
          </div>
        </div>
      )}

    </div>
  );
}