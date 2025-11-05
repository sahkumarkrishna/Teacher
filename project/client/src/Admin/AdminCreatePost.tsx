import { useState, useEffect } from "react";
import { useRouter } from "../router";
import AdminSidebar from "./AdminSidebar";
import { Menu } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCreatePost() {
  const { navigate } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) navigate("/");
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };



const submitPost = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!coverImage) {
    toast.error("⚠️ Cover Image is required!");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("author", author);
    formData.append("tags", tags);
    formData.append("published", String(published));
    formData.append("date", date);
    formData.append("cover_image", coverImage);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      toast.success("✅ Post Created Successfully!");
      setTimeout(() => {
        navigate("/admin/posts");
      }, 800);
    } else {
      toast.error(data.error || "Something went wrong");
    }
  } catch (err) {
    toast.error("Server error");
    console.error(err);
  }
};



  return (
    <div className="bg-gray-100 min-h-screen flex">
      <div className="hidden md:block">
        <AdminSidebar open={true} setOpen={() => {}} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow z-50 md:hidden transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      <div className="flex-1 p-4 md:p-6 md:ml-64">
        <div className="flex justify-between items-center mb-6 mt-4 md:mt-0">
          <button
            className="md:hidden p-2 rounded bg-white shadow mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <h1 className="text-2xl font-bold">Create Post</h1>
        </div>

        <form onSubmit={submitPost} className="bg-white p-6 shadow rounded-lg space-y-4">
          {/* Title */}
          <div>
            <label className="font-semibold">Title *</label>
            <input
              className="border w-full p-2 rounded"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="font-semibold">Excerpt *</label>
            <textarea
              className="border w-full p-2 rounded"
              rows={2}
              placeholder="Short summary"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="font-semibold">Content *</label>
            <textarea
              className="border w-full p-2 rounded"
              rows={6}
              placeholder="Write blog content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="font-semibold">Author *</label>
            <input
              className="border w-full p-2 rounded"
              placeholder="Author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="font-semibold">Tags (comma separated) *</label>
            <input
              className="border w-full p-2 rounded"
              placeholder="eg: mern, react"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="font-semibold"> Date *</label>
            <input
              type="date"
              className="border w-full p-2 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Publish */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-6 h-6 cursor-pointer"
            />
            <span className="font-semibold text-lg">Publish</span>
          </div>

          {/* Image */}
          <div>
            <label className="font-semibold block mb-1">Cover Image *</label>
            <input type="file" accept="image/*" onChange={handleImageChange} required />

            {previewImage && (
              <img src={previewImage} className="w-40 h-40 object-cover rounded mt-2" />
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}
