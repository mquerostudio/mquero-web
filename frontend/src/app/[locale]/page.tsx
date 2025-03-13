import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import Card from '../components/custom/Card';
import SkillCard from '../components/custom/SkillCard';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const commonT = useTranslations('Common');

  // Sample project data
  const projects = [
    {
      id: 1,
      title: "Article name - Headline for article",
      description: "Lorem ipsum dolor amet, consectetur adipiscing elit. Elementum non donec cursu.",
      imageSrc: "/placeholder.png",
      link: "/projects/1"
    },
    {
      id: 2,
      title: "Article name - Headline for article",
      description: "Lorem ipsum dolor amet, consectetur adipiscing elit. Elementum non donec cursu.",
      imageSrc: "/placeholder.png",
      link: "/projects/2"
    }
  ];

  // Sample blog articles data
  const blogArticles = [
    {
      id: 1,
      title: "Blog Post Title 1",
      description: "Short description of the blog post content. This gives readers a preview of what to expect.",
      imageSrc: "/placeholder.png",
      link: "/blog/1"
    },
    {
      id: 2,
      title: "Blog Post Title 2",
      description: "Short description of the blog post content. This gives readers a preview of what to expect.",
      imageSrc: "/placeholder.png",
      link: "/blog/2"
    },
    {
      id: 3,
      title: "Blog Post Title 3",
      description: "Short description of the blog post content. This gives readers a preview of what to expect.",
      imageSrc: "/placeholder.png",
      link: "/blog/3"
    }
  ];

  // SVG Icons
  const schematicIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
    </svg>
  );

  const prototypeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
    </svg>
  );

  const firmwareIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  );

  // Skills data
  const skills = [
    {
      id: 1,
      title: "Schematics and PCB",
      description: "Lorem ipsum dolor amet, consectetur adipiscing elit. Elementum non donec cursus turpis tristique magnis massa natoque ultrices magnis quis nascetur leo massa pellentesque.",
      color: "bg-gray-500",
      icon: schematicIcon
    },
    {
      id: 2,
      title: "Prototyping",
      description: "Lorem ipsum dolor amet, consectetur adipiscing elit. Elementum non donec cursus turpis tristique magnis massa natoque ultrices magnis quis nascetur leo massa pellentesque.",
      color: "bg-green-400",
      icon: prototypeIcon
    },
    {
      id: 3,
      title: "Firmware",
      description: "Lorem ipsum dolor amet, consectetur adipiscing elit. Elementum non donec cursus turpis tristique magnis massa natoque ultrices magnis quis nascetur leo massa pellentesque.",
      color: "bg-red-300",
      icon: firmwareIcon
    },
    {
      id: 4,
      title: "Schematics and PCB",
      description: "Lorem ipsum dolor amet, consectetur adipiscing elit. Elementum non donec cursus turpis tristique magnis massa natoque ultrices magnis quis nascetur leo massa pellentesque.",
      color: "bg-gray-500",
      icon: schematicIcon
    },
    {
      id: 5,
      title: "Prototyping",
      description: "Lorem ipsum dolor amet, consectetur adipiscing elit. Elementum non donec cursus turpis tristique magnis massa natoque ultrices magnis quis nascetur leo massa pellentesque.",
      color: "bg-green-400",
      icon: prototypeIcon
    },
    {
      id: 6,
      title: "Firmware",
      description: "Lorem ipsum dolor amet, consectetur adipiscing elit. Elementum non donec cursus turpis tristique magnis massa natoque ultrices magnis quis nascetur leo massa pellentesque.",
      color: "bg-red-300",
      icon: firmwareIcon
    }
  ];

  return (
    <div className="space-y-12 py-12 w-full">
      {/* Hero Section */}
      <section className="w-full">
        <div className="max-w-6xl w-full flex flex-col lg:flex-row justify-between items-center mx-auto space-y-4 lg:space-y-0 lg:space-x-6 h-auto border-4 border-gray-300 rounded-3xl p-4 sm:p-8 bg-white">
          <div className="sm:rounded-[80px] rounded-[40px] overflow-hidden h-auto w-48 sm:h-auto sm:w-80 flex-shrink-0">
            <Image
              src="/profile-picture.png"
              alt="Profile Picture"
              width={384}
              height={384}
              className="w-full h-full object-cover rounded-xl"
              priority
            />
          </div>

          <div className="flex flex-col items-center justify-center flex-1 text-center gap-4">
            <h1 className="text-2xl sm:text-4xl font-bold">{t('title')}</h1>
            <p className="text-base sm:text-xl">{t('subtitle')}</p>
            <Link
              href="/about"
              className="text-base sm:text-xl font-medium bg-gray-800 text-white hover:bg-[#ffaa00ff] hover:text-black px-6 py-3 rounded-md transition-colors duration-200"
            >
              {t('about')}
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="w-full">
        <div className="max-w-6xl w-full mx-auto">
          <h2 className="text-3xl font-bold mb-6">{t('projects')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map(project => (
              <Card
                key={project.id}
                title={project.title}
                description={project.description}
                imageSrc={project.imageSrc}
                link={project.link}
              />
            ))}
          </div>

          {/* See All Projects Button */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/projects"
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              see all projects :)
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Articles Section */}
      <section className="w-full">
        <div className="max-w-6xl w-full mx-auto">
          <h2 className="text-3xl font-bold mb-6">{t('blog')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogArticles.map(article => (
              <Card
                key={article.id}
                title={article.title}
                description={article.description}
                imageSrc={article.imageSrc}
                link={article.link}
              />
            ))}
          </div>

          {/* See All Blog Posts Button */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/blog"
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              read more articles :)
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="w-full">
        <div className="max-w-6xl w-full mx-auto">
          <h2 className="text-3xl font-bold mb-6">{t('skills')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map(skill => (
              <SkillCard
                key={skill.id}
                title={skill.title}
                description={skill.description}
                color={skill.color}
                icon={skill.icon}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}