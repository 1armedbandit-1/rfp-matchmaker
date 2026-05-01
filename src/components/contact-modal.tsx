'use client'

import { useState } from 'react'
import { UserProfile } from '@/types'
import { Mail, Phone, MessageCircle, ExternalLink, X } from 'lucide-react'

interface ContactModalProps {
  user: UserProfile
}

const contactIconMap: Record<string, React.ReactNode> = {
  email: <Mail size={24} />,
  phone: <Phone size={24} />,
  instagram: <MessageCircle size={24} />,
  facebook: <MessageCircle size={24} />,
  signal: <MessageCircle size={24} />,
  whatsapp: <MessageCircle size={24} />,
  in_app: <MessageCircle size={24} />,
}

export default function ContactModal({ user }: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = async () => {
    setIsOpen(true)
    // Log contact reveal to database
    try {
      await fetch('/api/contact-reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_user_id: user.id,
          contact_method: user.preferred_contact_method,
        }),
      })
    } catch (error) {
      console.error('Error logging contact reveal:', error)
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-[#E63946] hover:bg-[#c72d3a] text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
      >
        Get Contact Info
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#EAEAEA]">
              <h2 className="font-bold text-lg text-[#1A1A1A]">Contact Info</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-center mb-6">
                <p className="text-sm text-[#6B6B6B] mb-3">Preferred contact method</p>
                <div className="flex items-center justify-center gap-3 p-4 bg-[#FAFAF7] rounded-xl">
                  {contactIconMap[user.preferred_contact_method || 'email'] && (
                    <div className="text-[#E63946]">
                      {contactIconMap[user.preferred_contact_method || 'email']}
                    </div>
                  )}
                  <p className="font-semibold text-[#1A1A1A]">
                    {user.preferred_contact_value}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#E63946] hover:bg-[#c72d3a] text-white rounded-xl px-4 py-2.5 font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
