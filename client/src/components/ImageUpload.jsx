import { useState, useRef } from 'react'
import { Upload, X, Loader } from 'lucide-react'
import { uploadAPI } from '../utils/api'
import toast from 'react-hot-toast'

export default function ImageUpload({ value, onChange, folder = 'arrk-studio', multiple = false, className = '' }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      if (multiple) {
        const fd = new FormData()
        files.forEach(f => fd.append('images', f))
        fd.append('folder', folder)
        const { data } = await uploadAPI.multiple(fd)
        onChange([...(value || []), ...data.map(d => d.url)])
      } else {
        const fd = new FormData()
        fd.append('image', files[0])
        fd.append('folder', folder)
        const { data } = await uploadAPI.single(fd)
        onChange(data.url)
      }
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      inputRef.current.value = ''
    }
  }

  const removeImage = (idx) => {
    if (multiple) {
      onChange(value.filter((_, i) => i !== idx))
    } else {
      onChange('')
    }
  }

  return (
    <div className={className}>
      {/* Single image preview */}
      {!multiple && value && (
        <div className="relative mb-3 group w-full aspect-video bg-surface overflow-hidden">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => removeImage()}
            className="absolute top-2 right-2 bg-primary/80 hover:bg-red-600 text-light w-8 h-8 flex items-center justify-center transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Multiple images */}
      {multiple && value && value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {value.map((url, i) => (
            <div key={i} className="relative aspect-square bg-surface overflow-hidden group">
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-primary/80 hover:bg-red-600 text-light w-6 h-6 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {(!value || value === '' || (multiple)) && (
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          disabled={uploading}
          className="w-full border border-dashed border-border hover:border-accent bg-surface/50 hover:bg-surface py-6 flex flex-col items-center gap-2 transition-all duration-300 disabled:opacity-50"
        >
          {uploading ? <Loader size={20} className="text-accent animate-spin" /> : <Upload size={20} className="text-muted" />}
          <span className="font-mono text-xs text-muted">
            {uploading ? 'Uploading...' : `Click to upload ${multiple ? 'images' : 'image'}`}
          </span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} onChange={handleUpload} className="hidden" />
    </div>
  )
}
