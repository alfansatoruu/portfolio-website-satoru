import React, { useState, useEffect } from 'react';
import { X, Minus, Maximize, Github, Linkedin, Mail } from 'lucide-react';

const sectionContent = {
  aboutSection: `
    <p class="mb-4">
      Hi! I'm a software developer with a passion for creating intuitive and engaging web applications. 
      I specialize in React, TypeScript, and modern web technologies.
    </p>
    <p class="mb-4">
      With 5+ years of experience in full-stack development, I've worked on everything from small business websites 
      to large-scale enterprise applications.
    </p>
  `,
  projectsSection: `
    <div class="space-y-6">
      <div class="border-b pb-4">
        <h3 class="text-xl font-semibold mb-2">E-commerce Platform</h3>
        <p class="text-gray-600 mb-2">Built a full-stack e-commerce solution using React, Node.js, and MongoDB</p>
        <div class="flex gap-2">
          <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">React</span>
          <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Node.js</span>
          <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">MongoDB</span>
        </div>
      </div>
      <div class="border-b pb-4">
        <h3 class="text-xl font-semibold mb-2">Task Management App</h3>
        <p class="text-gray-600 mb-2">Developed a real-time collaborative task management application</p>
        <div class="flex gap-2">
          <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">TypeScript</span>
          <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">Firebase</span>
          <span class="bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm">Tailwind</span>
        </div>
      </div>
    </div>
  `,
  experienceSection: `
    <div class="space-y-6">
      <div class="border-b pb-4">
        <h3 class="text-xl font-semibold">Senior Frontend Developer</h3>
        <p class="text-gray-600">TechCorp Inc. • 2021 - Present</p>
        <ul class="list-disc ml-4 mt-2">
          <li>Led development of company's flagship web application</li>
          <li>Mentored junior developers and established best practices</li>
          <li>Reduced application bundle size by 40%</li>
        </ul>
      </div>
      <div class="border-b pb-4">
        <h3 class="text-xl font-semibold">Full Stack Developer</h3>
        <p class="text-gray-600">StartupX • 2019 - 2021</p>
        <ul class="list-disc ml-4 mt-2">
          <li>Built and maintained multiple client projects</li>
          <li>Implemented CI/CD pipelines</li>
          <li>Increased test coverage from 40% to 85%</li>
        </ul>
      </div>
    </div>
  `,
  contactSection: `
    <div class="space-y-4">
      <p class="mb-4">Let's connect! You can reach me through any of the following channels:</p>
      <div class="flex space-x-4">
        <a href="#" class="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <Mail class="w-5 h-5" /> email@example.com
        </a>
        <a href="#" class="flex items-center gap-2 text-gray-700 hover:text-gray-900">
          <Github class="w-5 h-5" /> github/username
        </a>
        <a href="#" class="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <Linkedin class="w-5 h-5" /> linkedin/in/username
        </a>
      </div>
    </div>
  `
};

const sectionHeading = {
  aboutSection: "About Me",
  projectsSection: "Projects",
  experienceSection: "Experience",
  contactSection: "Contact"
};

const PortfolioWindow = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [activeSection, setActiveSection] = useState('aboutSection');
  const [isMaximized, setIsMaximized] = useState(false);

  const useTime = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const formatTime = () => {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const hours = time.getHours() % 12 || 12;
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

      return `${daysOfWeek[time.getDay()]} ${time.getDate()} ${months[time.getMonth()]} ${hours}:${minutes} ${ampm}`;
    };

    return formatTime();
  };

  const currentTime = useTime();

  const handleDragStart = (e) => {
    if (isMaximized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 });
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    } else {
      setPosition({ x: 20, y: 20 });
      setWindowSize({ width: 800, height: 600 });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      {/* Folder Icon */}
      <div 
        className="absolute top-4 left-4 cursor-pointer"
        onClick={() => setIsVisible(true)}
      >
        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
          📁
        </div>
      </div>

      {/* Window */}
      {isVisible && (
        <div 
          className="absolute bg-white rounded-lg shadow-lg overflow-hidden"
          style={{
            width: windowSize.width,
            height: windowSize.height,
            left: position.x,
            top: position.y,
            transform: isDragging ? 'scale(1.02)' : 'scale(1)',
            transition: 'transform 0.1s'
          }}
        >
          {/* Title Bar */}
          <div 
            className="h-8 bg-gray-200 flex items-center justify-between px-2 select-none"
            onMouseDown={handleDragStart}
          >
            <div className="text-sm font-medium">Portfolio</div>
            <div className="flex gap-2">
              <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-gray-300 rounded">
                <Minus className="w-4 h-4" />
              </button>
              <button onClick={handleMaximize} className="p-1 hover:bg-gray-300 rounded">
                <Maximize className="w-4 h-4" />
              </button>
              <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-gray-300 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-[calc(100%-56px)]">
            {/* Sidebar */}
            <div className="w-48 bg-gray-100 p-4">
              {Object.keys(sectionContent).map(section => (
                <div
                  key={section}
                  className={`cursor-pointer p-2 rounded mb-2 ${
                    activeSection === section ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  {sectionHeading[section]}
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
              <h2 className="text-2xl font-bold mb-4">{sectionHeading[activeSection]}</h2>
              <div dangerouslySetInnerHTML={{ __html: sectionContent[activeSection] }} />
            </div>
          </div>

          {/* Status Bar */}
          <div className="h-8 bg-gray-100 px-2 flex items-center text-sm border-t">
            {currentTime}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioWindow;