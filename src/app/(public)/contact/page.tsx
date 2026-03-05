"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // TODO: connect with API
    console.log(form);

    alert("Message sent successfully!");
    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900">
            Contact <span className="text-yellow-500">Us</span>
          </h1>
          <p className="text-slate-500 mt-3 font-medium">
            We'd love to hear from you. Send us a message and our team will respond shortly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-14">

          {/* Contact Information */}
          <div className="space-y-8">

            <div>
              <h2 className="text-xl font-black text-slate-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Have questions about Talentbees? Whether you're a job seeker,
                employer, or partner, our support team is here to help.
              </p>
            </div>

            <div className="space-y-6">

              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Mail className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Email</p>
                  <p className="text-slate-500">support@talentbees.co</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Phone className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Phone</p>
                  <p className="text-slate-500">+92 312 2912921</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <MapPin className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Office</p>
                  <p className="text-slate-500">
                    Karachi, Pakistan
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="Your email"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="Subject"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="Write your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black py-3 rounded-xl transition"
              >
                <Send size={18} />
                Send Message
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}