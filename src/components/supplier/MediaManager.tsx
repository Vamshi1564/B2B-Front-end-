import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Star } from "lucide-react";

type Props = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  videos: File[];
  setVideos: React.Dispatch<React.SetStateAction<File[]>>;
  coverIndex: number | null;
  setCoverIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

const MediaManager = ({
  images,
  setImages,
  videos,
  setVideos,
  coverIndex,
  setCoverIndex,
}: Props) => {

  // IMAGE UPLOAD
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(prev => [...prev, ...Array.from(e.target.files)]);
  };

  // VIDEO UPLOAD
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setVideos(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (coverIndex === index) setCoverIndex(null);
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-10">

      {/* IMAGE SECTION */}
      <div>
        <Label className="text-lg font-semibold">Property Images</Label>

        <div className="mt-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {images.map((file, index) => {
              const preview = URL.createObjectURL(file);

              return (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    className="h-36 w-full object-cover rounded-lg"
                  />

                  {/* Cover Button */}
                  <button
                    type="button"
                    onClick={() => setCoverIndex(index)}
                    className="absolute bottom-2 left-2 bg-white p-1 rounded"
                  >
                    <Star
                      size={16}
                      className={
                        coverIndex === index
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }
                    />
                  </button>

                  {/* Remove */}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VIDEO SECTION */}
      <div>
        <Label className="text-lg font-semibold">Property Videos</Label>

        <div className="mt-4">
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoUpload}
          />
        </div>

        {videos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {videos.map((file, index) => {
              const preview = URL.createObjectURL(file);

              return (
                <div key={index} className="relative">
                  <video
                    src={preview}
                    className="h-36 w-full object-cover rounded-lg"
                    controls
                  />

                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removeVideo(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default MediaManager;