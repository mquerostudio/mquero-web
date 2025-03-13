'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    try {
      // In a real application, you would send the form data to your backend or a form service
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <div className="w-full py-12">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
        
        {/* About Me Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="md:w-1/3">
            <div className="rounded-lg overflow-hidden relative h-80 w-full">
              <Image
                src="/profile-picture.png"
                alt="Manuel Quero"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">{t('aboutMe')}</h2>
            <div className="prose prose-lg max-w-none">
              <p>
                I'm an Electronics and Embedded Systems Engineer with a passion for designing innovative hardware solutions and developing efficient firmware. With a Bachelor's Degree in Industrial Electronics and Automation Engineering, I've spent over 2 years working on various projects that combine my technical expertise with creative problem-solving.
              </p>
              <p>
                My journey in electronics began during my university years, where I developed a strong foundation in circuit design, microcontroller programming, and system integration. Since then, I've worked on projects ranging from IoT devices and energy monitoring systems to wearable technology and industrial automation.
              </p>
              <p>
                I specialize in PCB design, embedded firmware development, and low-power electronics. I'm proficient with various microcontroller platforms including AVR, ARM, and ESP32, and I have experience with design tools such as Altium Designer, KiCad, and Eagle.
              </p>
              <p>
                When I'm not designing circuits or writing firmware, I enjoy sharing my knowledge through blog posts, contributing to open-source projects, and exploring new technologies that can push the boundaries of what's possible in embedded systems.
              </p>
            </div>
            
            {/* Skills Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">{t('skills')}</h3>
              <div className="flex flex-wrap gap-2">
                {['PCB Design', 'Embedded Firmware', 'Microcontrollers', 'Circuit Design', 'IoT', 'Low-Power Electronics', 'Altium Designer', 'KiCad', 'C/C++', 'Python', 'RTOS', 'Hardware Debugging'].map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Education & Experience */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t('educationAndExperience')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t('education')}</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-gray-800 pl-4">
                  <h4 className="font-bold">Bachelor's Degree in Industrial Electronics and Automation Engineering</h4>
                  <p className="text-gray-600">University Name, 2016-2020</p>
                  <p className="mt-2">Focused on embedded systems, control theory, and industrial automation. Graduated with honors.</p>
                </div>
                <div className="border-l-4 border-gray-800 pl-4">
                  <h4 className="font-bold">Advanced Certification in PCB Design</h4>
                  <p className="text-gray-600">Institute Name, 2021</p>
                  <p className="mt-2">Specialized training in high-speed PCB design, signal integrity, and EMC considerations.</p>
                </div>
              </div>
            </div>
            
            {/* Experience */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t('experience')}</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-gray-800 pl-4">
                  <h4 className="font-bold">Embedded Systems Engineer</h4>
                  <p className="text-gray-600">Company Name, 2021-Present</p>
                  <p className="mt-2">Designing embedded hardware and developing firmware for IoT devices and industrial control systems.</p>
                </div>
                <div className="border-l-4 border-gray-800 pl-4">
                  <h4 className="font-bold">Electronics Design Intern</h4>
                  <p className="text-gray-600">Company Name, 2020-2021</p>
                  <p className="mt-2">Assisted in PCB design, component selection, and prototype testing for consumer electronics products.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">{t('contactMe')}</h2>
          <p className="mb-6">{t('contactDescription')}</p>
          
          {formStatus === 'success' ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p>{t('messageSent')}</p>
            </div>
          ) : formStatus === 'error' ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{t('messageError')}</p>
            </div>
          ) : null}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('formName')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('formEmail')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                {t('formSubject')}
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">{t('formSelectSubject')}</option>
                <option value="project">{t('formSubjectProject')}</option>
                <option value="collaboration">{t('formSubjectCollaboration')}</option>
                <option value="question">{t('formSubjectQuestion')}</option>
                <option value="other">{t('formSubjectOther')}</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                {t('formMessage')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {formStatus === 'submitting' ? t('formSubmitting') : t('formSubmit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 