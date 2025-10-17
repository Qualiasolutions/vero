'use client';

import { useState } from 'react';
import { Search, Clock, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomRequestPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    carBrand: '',
    modelName: '',
    year: '',
    preferredColor: '',
    manufacturers: [] as string[],
    additionalDetails: '',
    minBudget: '',
    maxBudget: '',
    timeline: 'flexible',
    agreedToTerms: false
  });

  const manufacturers = [
    'AUTOart', 'Minichamps', 'BBR Models', 'Kyosho',
    'Bburago', 'Maisto', 'Norev', 'GT Spirit', 'Any Brand'
  ];

  const handleManufacturerToggle = (manufacturer: string) => {
    setFormData(prev => ({
      ...prev,
      manufacturers: prev.manufacturers.includes(manufacturer)
        ? prev.manufacturers.filter(m => m !== manufacturer)
        : [...prev.manufacturers, manufacturer]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      toast.error('Please agree to the terms to continue');
      return;
    }

    // Here you would typically send the data to your API
    console.log('Form submitted:', formData);
    toast.success('Request submitted! We\'ll contact you within 24-48 hours.');

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      carBrand: '',
      modelName: '',
      year: '',
      preferredColor: '',
      manufacturers: [],
      additionalDetails: '',
      minBudget: '',
      maxBudget: '',
      timeline: 'flexible',
      agreedToTerms: false
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold vero-text-gradient mb-6 tracking-tight">
            Custom Diecast Request
          </h1>
          <p className="text-xl text-yellow-400/80 max-w-2xl mx-auto">
            Can't find your dream model? We'll source it for you!
          </p>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Search, title: "We Search", desc: "Our global network hunts for your model" },
            { icon: Clock, title: "24-48 Hours", desc: "Quick response with availability" },
            { icon: Sparkles, title: "Confirmation", desc: "Photos and final pricing sent" },
            { icon: Shield, title: "No Obligation", desc: "Approve before any purchase" }
          ].map((step, index) => (
            <div key={index} className="vero-card p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 mb-4">
                <step.icon className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-yellow-400 mb-2">{step.title}</h3>
              <p className="text-sm text-yellow-400/60">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="vero-card p-8 md:p-12">
          {/* Personal Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 uppercase tracking-wider border-b border-yellow-900/30 pb-4">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 placeholder-yellow-400/40 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 placeholder-yellow-400/40 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 placeholder-yellow-400/40 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  placeholder="john.doe@email.com"
                />
              </div>
              <div>
                <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 placeholder-yellow-400/40 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Model Details */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 uppercase tracking-wider border-b border-yellow-900/30 pb-4">
              Model Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                  Car Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.carBrand}
                  onChange={(e) => setFormData({...formData, carBrand: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 placeholder-yellow-400/40 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  placeholder="e.g., Ferrari, Porsche, Lamborghini"
                />
              </div>
              <div>
                <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                  Model Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.modelName}
                  onChange={(e) => setFormData({...formData, modelName: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 placeholder-yellow-400/40 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  placeholder="e.g., F40, 911 GT3"
                />
              </div>
              <div>
                <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                  Year / Generation
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 placeholder-yellow-400/40 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  placeholder="e.g., 2023, 964"
                />
              </div>
              <div>
                <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                  Preferred Color
                </label>
                <input
                  type="text"
                  value={formData.preferredColor}
                  onChange={(e) => setFormData({...formData, preferredColor: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 placeholder-yellow-400/40 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  placeholder="e.g., Rosso Corsa"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-yellow-400/80 mb-3 text-sm font-medium">
                Preferred Manufacturers
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {manufacturers.map((manufacturer) => (
                  <button
                    key={manufacturer}
                    type="button"
                    onClick={() => handleManufacturerToggle(manufacturer)}
                    className={`px-4 py-2 border transition-all ${
                      formData.manufacturers.includes(manufacturer)
                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
                        : 'bg-black/50 border-yellow-900/30 text-yellow-400/60 hover:border-yellow-400/60'
                    }`}
                  >
                    {manufacturer}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                Additional Details / Special Requests
              </label>
              <textarea
                value={formData.additionalDetails}
                onChange={(e) => setFormData({...formData, additionalDetails: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 placeholder-yellow-400/40 focus:outline-none focus:border-yellow-400/60 transition-colors resize-none"
                placeholder="Looking for specific edition, race livery, signed model, etc."
              />
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 uppercase tracking-wider border-b border-yellow-900/30 pb-4">
              Budget & Timeline
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                  Minimum Budget ($)
                </label>
                <input
                  type="number"
                  value={formData.minBudget}
                  onChange={(e) => setFormData({...formData, minBudget: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 placeholder-yellow-400/40 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                  Maximum Budget ($)
                </label>
                <input
                  type="number"
                  value={formData.maxBudget}
                  onChange={(e) => setFormData({...formData, maxBudget: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 placeholder-yellow-400/40 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  placeholder="500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-yellow-400/80 mb-2 text-sm font-medium">
                How soon do you need it?
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                className="w-full px-4 py-3 bg-black/50 border border-yellow-900/30 text-yellow-400 focus:outline-none focus:border-yellow-400/60 transition-colors"
              >
                <option value="flexible">Flexible - Whenever available</option>
                <option value="1-month">Within 1 month</option>
                <option value="2-weeks">Within 2 weeks</option>
                <option value="urgent">Urgent - ASAP</option>
              </select>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="mb-8 p-6 bg-yellow-900/10 border border-yellow-900/30">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 uppercase tracking-wider">
              What Happens Next?
            </h3>
            <ul className="space-y-2 text-yellow-400/70">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                We'll search our global network of suppliers and collectors
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                You'll receive a response within 24-48 hours
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                If found, we'll send photos and final pricing
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                No obligation to purchase until you approve
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                Small 10% finder's fee on successful orders
              </li>
            </ul>
          </div>

          {/* Terms Checkbox */}
          <div className="mb-8">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                className="mt-1 mr-3 w-5 h-5 bg-black/50 border border-yellow-900/30 text-yellow-400 focus:ring-yellow-400 focus:ring-2"
              />
              <span className="text-yellow-400/70">
                I understand this is a request service. Availability and pricing will be confirmed after searching. A 10% finder's fee applies to successful orders. <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="vero-button w-full md:w-auto px-12 py-4 text-lg"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
