import Image from "next/image";
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          {/* Left: Illustration card */}
          <div className="flex items-stretch justify-center">
            <div className="w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl h-[620px] flex flex-col">
              <div className="relative w-full flex-1">
                <Image
                  src="/contact.gif"
                  alt="Person playing a game controller in front of a TV"
                  fill
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  We&apos;re here to help — reach out with any questions about
                  the site, submitting games, or collaboration.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form panel */}
          <div className="flex items-stretch justify-center">
            <div className="w-full rounded-xl p-6 shadow-lg ring-1 ring-black/5 h-[540px] flex flex-col justify-center">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold">Contact Us</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Have a question, feedback, or collaboration idea? Send us a
                  message and we&apos;ll get back to you shortly.
                </p>
              </div>

              <div className="w-full">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
