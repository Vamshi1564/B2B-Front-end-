import { useEffect, useState } from "react";
import { X, ImagePlus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  coverIndex: number | null;
  setCoverIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onNext: () => void;
};

const PropertyGallery = ({
  images,
  setImages,
  coverIndex,
  setCoverIndex,
  onNext,
}: Props) => {

  const [previews, setPreviews] = useState<string[]>([]);

  // ✅ Generate previews safely
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setImages(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));

    // ✅ Fix cover index shifting
    if (coverIndex === index) {
      setCoverIndex(null);
    } else if (coverIndex !== null && coverIndex > index) {
      setCoverIndex(coverIndex - 1);
    }
  };

  return (
    <div className="bg-card border rounded-3xl shadow-xl p-10 space-y-10">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold">Property Images</h2>
        <p className="text-muted-foreground mt-2">
          Upload high-quality photos to improve booking conversions.
        </p>
      </div>

      {/* UPLOAD AREA */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 cursor-pointer hover:bg-muted/30 transition">

        <ImagePlus className="w-12 h-12 text-primary mb-4" />

        <span className="font-semibold text-lg">
          Upload Images
        </span>

        <span className="text-sm text-muted-foreground mt-1">
          Recommended resolution: 1200x800px
        </span>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* PREVIEW GRID */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden shadow-md group"
            >
              <img
                src={preview}
                className="w-full h-44 object-cover"
              />

              {/* COVER BADGE */}
              {coverIndex === index && (
                <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                  Cover Image
                </div>
              )}

              {/* HOVER CONTROLS */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">

                <button
                  type="button"
                  onClick={() => setCoverIndex(index)}
                  className="bg-white p-2 rounded-full hover:scale-110 transition"
                >
                  <Star className="w-4 h-4 text-yellow-500" />
                </button>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-white p-2 rounded-full hover:scale-110 transition"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

      {/* CONTINUE */}
      <Button
        disabled={images.length === 0}
        onClick={onNext}
        className="w-full h-12 text-lg rounded-xl"
      >
        Save & Continue →
      </Button>

    </div>
  );
};

export default PropertyGallery;