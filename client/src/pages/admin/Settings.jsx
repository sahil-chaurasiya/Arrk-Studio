import { useState, useEffect } from 'react'
import { Save, Globe, Phone, Mail, Instagram, MapPin, Info } from 'lucide-react'
import { settingsAPI } from '../../utils/api'
import ImageUpload from '../../components/ImageUpload'
import toast from 'react-hot-toast'

const TABS = ['General', 'Contact', 'Social', 'SEO', 'Hero']

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('General')
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    settingsAPI.getAllAdmin()
      .then(r => setSettings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (key, value) => setSettings(s => ({ ...s, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsAPI.update(settings)
      toast.success('Settings saved!')
    } catch {
      toast.error('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, settingKey, type = 'text', placeholder = '', rows }) => (
    <div>
      <label className="admin-label">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={settings[settingKey] || ''}
          onChange={e => set(settingKey, e.target.value)}
          rows={rows || 3}
          placeholder={placeholder}
          className="admin-input resize-none"
        />
      ) : (
        <input
          type={type}
          value={settings[settingKey] || ''}
          onChange={e => set(settingKey, e.target.value)}
          placeholder={placeholder}
          className="admin-input"
        />
      )}
    </div>
  )

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-light">Settings</h1>
          <p className="font-body text-sm text-muted mt-1">Configure your website content and information</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2.5 px-5 disabled:opacity-50">
          <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-mono text-xs tracking-widest uppercase whitespace-nowrap border-b-2 transition-all
              ${activeTab === tab ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-light'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-secondary border border-border p-6 space-y-6">

        {activeTab === 'General' && (
          <>
            <h2 className="font-display text-lg font-light text-light flex items-center gap-2">
              <Info size={16} className="text-accent" /> General Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Studio Name" settingKey="site_name" placeholder="ARRK Studio" />
              <Field label="Tagline" settingKey="site_tagline" placeholder="From Concept to Creation" />
              <div className="md:col-span-2">
                <Field label="About (Short)" settingKey="about_short" type="textarea" rows={3}
                  placeholder="A short description of your studio..." />
              </div>
              <div className="md:col-span-2">
                <Field label="About (Full)" settingKey="about_full" type="textarea" rows={6}
                  placeholder="Full about section content..." />
              </div>
              <div>
                <label className="admin-label">Logo</label>
                <ImageUpload
                  value={settings['site_logo'] || ''}
                  onChange={url => set('site_logo', url)}
                  folder="arrk-studio/brand"
                />
              </div>
              <div>
                <label className="admin-label">Favicon</label>
                <ImageUpload
                  value={settings['site_favicon'] || ''}
                  onChange={url => set('site_favicon', url)}
                  folder="arrk-studio/brand"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div>
                <label className="admin-label">Projects Stat</label>
                <input value={settings['stat_projects'] || '50+'} onChange={e => set('stat_projects', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Experience Stat</label>
                <input value={settings['stat_experience'] || '8+'} onChange={e => set('stat_experience', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Clients Stat</label>
                <input value={settings['stat_clients'] || '40+'} onChange={e => set('stat_clients', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Awards Stat</label>
                <input value={settings['stat_awards'] || '5+'} onChange={e => set('stat_awards', e.target.value)} className="admin-input" />
              </div>
            </div>
          </>
        )}

        {activeTab === 'Contact' && (
          <>
            <h2 className="font-display text-lg font-light text-light flex items-center gap-2">
              <Phone size={16} className="text-accent" /> Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Phone" settingKey="contact_phone" placeholder="+91 XXXXX XXXXX" />
              <Field label="Email" settingKey="contact_email" placeholder="hello@arrkstudio.com" />
              <Field label="Address Line 1" settingKey="contact_address1" placeholder="Studio Address" />
              <Field label="Address Line 2" settingKey="contact_address2" placeholder="City, State, PIN" />
              <Field label="Working Hours (Weekdays)" settingKey="hours_weekday" placeholder="9:00 AM – 6:00 PM" />
              <Field label="Working Hours (Saturday)" settingKey="hours_saturday" placeholder="10:00 AM – 4:00 PM" />
              <div className="md:col-span-2">
                <Field label="Google Maps Embed URL" settingKey="maps_embed" placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </>
        )}

        {activeTab === 'Social' && (
          <>
            <h2 className="font-display text-lg font-light text-light flex items-center gap-2">
              <Instagram size={16} className="text-accent" /> Social Media
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Instagram URL" settingKey="social_instagram" placeholder="https://instagram.com/arrkstudio" />
              <Field label="Facebook URL" settingKey="social_facebook" placeholder="https://facebook.com/..." />
              <Field label="LinkedIn URL" settingKey="social_linkedin" placeholder="https://linkedin.com/..." />
              <Field label="WhatsApp Number" settingKey="social_whatsapp" placeholder="+91XXXXXXXXXX" />
              <Field label="Pinterest URL" settingKey="social_pinterest" placeholder="https://pinterest.com/..." />
              <Field label="Houzz URL" settingKey="social_houzz" placeholder="https://houzz.com/..." />
            </div>
          </>
        )}

        {activeTab === 'SEO' && (
          <>
            <h2 className="font-display text-lg font-light text-light flex items-center gap-2">
              <Globe size={16} className="text-accent" /> SEO & Meta
            </h2>
            <div className="space-y-6">
              <Field label="Meta Title" settingKey="meta_title" placeholder="ARRK Studio — Architecture & Interior Design" />
              <Field label="Meta Description" settingKey="meta_description" type="textarea" rows={3}
                placeholder="From concept to creation — ARRK Studio crafts exceptional architectural and interior design experiences." />
              <Field label="Meta Keywords" settingKey="meta_keywords"
                placeholder="architecture, interior design, space planning, India" />
              <div>
                <label className="admin-label">OG Image (Social Share Image)</label>
                <ImageUpload
                  value={settings['og_image'] || ''}
                  onChange={url => set('og_image', url)}
                  folder="arrk-studio/seo"
                />
              </div>
              <Field label="Google Analytics ID" settingKey="ga_id" placeholder="G-XXXXXXXXXX" />
            </div>
          </>
        )}

        {activeTab === 'Hero' && (
          <>
            <h2 className="font-display text-lg font-light text-light">Hero Section</h2>
            <div className="space-y-6">
              <Field label="Hero Heading" settingKey="hero_heading" placeholder="Spaces That Inspire" />
              <Field label="Hero Subheading" settingKey="hero_subheading" placeholder="Architecture · Interior Design · Space Planning" />
              <Field label="Hero CTA Button 1 Text" settingKey="hero_cta1_text" placeholder="View Our Work" />
              <Field label="Hero CTA Button 1 Link" settingKey="hero_cta1_link" placeholder="/projects" />
              <Field label="Hero CTA Button 2 Text" settingKey="hero_cta2_text" placeholder="Start a Project" />
              <Field label="Hero CTA Button 2 Link" settingKey="hero_cta2_link" placeholder="/contact" />
              <div>
                <label className="admin-label">Hero Background Images</label>
                <ImageUpload
                  value={settings['hero_images'] || []}
                  onChange={urls => set('hero_images', urls)}
                  folder="arrk-studio/hero"
                  multiple
                />
                <p className="font-mono text-xs text-muted mt-2">Upload up to 5 images for the hero slideshow</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Save button at bottom too */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2.5 px-8 disabled:opacity-50">
          <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  )
}
