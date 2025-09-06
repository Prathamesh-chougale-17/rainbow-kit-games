import Image from "next/image";
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-stretch gap-10 md:grid-cols-2">
          {/* Left: Illustration card */}
          <div className="flex items-stretch justify-center">
            <div className="flex h-[620px] w-full max-w-2xl flex-col overflow-hidden rounded-xl shadow-2xl">
              <div className="relative w-full flex-1">
                <Image
                  alt="Person playing a game controller in front of a TV"
                  className="h-full w-full object-cover"
                  fill
                  priority
                  src="/contact.gif"
                />
              </div>
              <div className="px-6 py-4">
                <p className="text-muted-foreground text-sm">
                  We&apos;re here to help — reach out with any questions about
                  the site, submitting games, or collaboration.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form panel */}
          <div className="flex items-stretch justify-center">
            <div className="flex h-[540px] w-full flex-col justify-center rounded-xl p-6 shadow-lg ring-1 ring-black/5">
              <div className="mb-4">
                <h1 className="font-semibold text-2xl">Contact Us</h1>
                <p className="mt-2 text-muted-foreground text-sm">
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
