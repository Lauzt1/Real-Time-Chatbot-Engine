import ContactForm from '../../components/ContactForm'
import ContactInfo from '../../components/ContactInfo'

export default function ContactPage() {
  return (
    <>
      {/* Page heading */}
      <h1 className="text-4xl font-bold text-center uppercase mb-2">
        Contact Us
      </h1>
      <hr className="border-t-2 border-gray-300 mb-8" />

      {/* Two-column layout: form on left, info on right */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ContactForm />
        </div>
        <div>
          <ContactInfo />
        </div>
      </div>
    </>
  )
}
