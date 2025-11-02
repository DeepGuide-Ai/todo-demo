'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'

type FormData = {
  // Step 1: Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  // Step 2: Company Info
  companyName: string
  companySize: string
  industry: string
  website: string
  // Step 3: Project Details
  projectType: string
  budget: string
  timeline: string
  description: string
  // Step 4: Additional Info
  howHeard: string
  newsletter: boolean
  agreeToTerms: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

export default function Forms() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    companySize: '',
    industry: '',
    website: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    howHeard: '',
    newsletter: false,
    agreeToTerms: false
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const totalSteps = 4

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'First name is required'
        if (!formData.lastName) newErrors.lastName = 'Last name is required'
        if (!formData.email) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
        break
      case 2:
        if (!formData.companyName) newErrors.companyName = 'Company name is required'
        if (!formData.companySize) newErrors.companySize = 'Company size is required'
        break
      case 3:
        if (!formData.projectType) newErrors.projectType = 'Project type is required'
        if (!formData.budget) newErrors.budget = 'Budget is required'
        if (!formData.description) newErrors.description = 'Description is required'
        break
      case 4:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    try {
      // Submit form to API
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit form')
      }

      // Show success message
      setShowSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        setCurrentStep(1)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          companyName: '',
          companySize: '',
          industry: '',
          website: '',
          projectType: '',
          budget: '',
          timeline: '',
          description: '',
          howHeard: '',
          newsletter: false,
          agreeToTerms: false
        })
      }, 3000)
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        )
        
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Company Name *</label>
              <input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Size *</label>
                <select
                  id="companySize"
                  value={formData.companySize}
                  onChange={(e) => updateFormData('companySize', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.companySize ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
                {errors.companySize && <p className="text-red-500 text-xs mt-1">{errors.companySize}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => updateFormData('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateFormData('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </div>
        )
        
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Project Type *</label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={(e) => updateFormData('projectType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.projectType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select project type</option>
                <option value="new-website">New Website</option>
                <option value="redesign">Website Redesign</option>
                <option value="mobile-app">Mobile App</option>
                <option value="web-app">Web Application</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
              {errors.projectType && <p className="text-red-500 text-xs mt-1">{errors.projectType}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Budget Range *</label>
                <select
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => updateFormData('budget', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.budget ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select budget</option>
                  <option value="< $10k">Less than $10,000</option>
                  <option value="$10k-$25k">$10,000 - $25,000</option>
                  <option value="$25k-$50k">$25,000 - $50,000</option>
                  <option value="$50k-$100k">$50,000 - $100,000</option>
                  <option value="> $100k">More than $100,000</option>
                </select>
                {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Timeline</label>
                <select
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => updateFormData('timeline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="3-months">Within 3 months</option>
                  <option value="6-months">Within 6 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Project Description *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
                placeholder="Tell us about your project..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>
        )
        
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
            <div>
              <label className="block text-sm font-medium mb-1">How did you hear about us?</label>
              <select
                value={formData.howHeard}
                onChange={(e) => updateFormData('howHeard', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an option</option>
                <option value="google">Google Search</option>
                <option value="social">Social Media</option>
                <option value="referral">Referral</option>
                <option value="event">Event/Conference</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.newsletter}
                  onChange={(e) => updateFormData('newsletter', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Subscribe to our newsletter for updates and tips</span>
              </label>
              
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                  className="mr-2 mt-1"
                />
                <span className="text-sm">
                  I agree to the Terms of Service and Privacy Policy *
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}
            </div>
            
            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h3 className="font-semibold mb-3">Summary</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Company:</strong> {formData.companyName}</div>
                <div><strong>Project:</strong> {formData.projectType}</div>
                <div><strong>Budget:</strong> {formData.budget}</div>
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <div>
      <Navigation />
      
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Project Inquiry Form</h1>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 text-center ${
                  step <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 ${
                  step < currentStep
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : step === currentStep
                    ? 'border-blue-600 text-blue-600'
                    : 'border-gray-300'
                }`}>
                  {step < currentStep ? '✓' : step}
                </div>
                <div className="text-xs mt-1">
                  {step === 1 && 'Personal'}
                  {step === 2 && 'Company'}
                  {step === 3 && 'Project'}
                  {step === 4 && 'Review'}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-200 h-2 rounded-full">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Form Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {getStepContent()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {currentStep < totalSteps ? (
              <button
                id="form-next-button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next Step
              </button>
            ) : (
              <button
                id="form-submit-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Form Submitted Successfully!</h2>
            <p className="text-gray-600">
              Thank you for your inquiry. We'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}