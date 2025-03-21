'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

export default function AboutPageClient() {
  const t = useTranslations('AboutPage');

  return (
    <div className="w-full py-12">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

        {/* About Me Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="md:w-1/3">
            <div className="rounded-lg overflow-hidden relative h-115 w-full">
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
            <div className="prose prose-lg max-w-none space-y-4">
              {t('aboutMeDescription').split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Skills Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">{t('skills')}</h3>
              <div className="flex flex-wrap gap-2">
                {['PCB Design', 'Embedded Firmware', 'Microcontrollers', 'Circuit Design', 'IoT', 'Low-Power Electronics', 'Altium Designer', 'KiCad', 'C/C++', 'Python', 'RTOS'].map((skill, index) => (
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
                  <h4 className="font-bold">{t('education-1-title')}</h4>
                  <p className="text-gray-600">{t('education-1-university')}, {t('education-1-date')}</p>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t('experience')}</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-gray-800 pl-4">
                  <h4 className="font-bold">{t('experience-2-title')}</h4>
                  <p className="text-gray-600">{t('experience-2-company')}, {t('experience-2-date')}</p>
                  <p className="mt-2">{t('experience-2-description')}</p>
                </div>
                <div className="border-l-4 border-gray-800 pl-4">
                  <h4 className="font-bold">{t('experience-1-title')}</h4>
                  <p className="text-gray-600">{t('experience-1-company')}, {t('experience-1-date')}</p>
                  <p className="mt-2">{t('experience-1-description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">{t('contactMe')}</h2>

          <div className="text-center">
            <p className="text-lg mb-6">
              {t('contactDescription')}
            </p>

            <div className="flex flex-col md:flex-row gap-64 justify-center">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <a
                  href="mailto:mquerostudio@gmail.com"
                  className="text-blue-600 hover:underline text-lg "
                >
                  mquerostudio@gmail.com
                </a>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Social Media</h3>
                <div className="flex justify-center space-x-6">
                  <a
                    href="https://www.instagram.com/mquerostudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:opacity-80"
                    aria-label="Instagram"
                  >
                    <Image
                      src="/social-logos/instagram-logo.svg"
                      alt="Instagram"
                      width={40}
                      height={40}
                    />
                  </a>
                  <a
                    href="https://www.tiktok.com/@mquerostudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:opacity-80"
                    aria-label="TikTok"
                  >
                    <Image
                      src="/social-logos/tiktok-logo.svg"
                      alt="TikTok"
                      width={40}
                      height={40}
                    />
                  </a>
                  <a
                    href="https://x.com/mquerostudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:opacity-80"
                    aria-label="X"
                  >
                    <Image
                      src="/social-logos/x-logo-black.svg"
                      alt="X"
                      width={40}
                      height={40}
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/manuelquero"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:opacity-80"
                    aria-label="LinkedIn"
                  >
                    <Image
                      src="/social-logos/linkedin-logo.svg"
                      alt="LinkedIn"
                      width={40}
                      height={40}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 