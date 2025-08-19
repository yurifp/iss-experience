// src/components/core/ISSExperienceApp.jsx
// NASA Space Apps Challenge 2025 - ISS 25th Anniversary Experience

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Camera, Rocket, Globe, Users, Activity, Award, Calendar, Info,
  Volume2, VolumeX, Play, Pause, ChevronRight, Star, Lock,
  Share2, Download, Zap, Heart, MessageCircle, Compass, 
  Cpu, Microscope, Radio, Wifi, AlertCircle, CheckCircle
} from 'lucide-react';

const ISSExperienceApp = () => {

  const [issPosition, setIssPosition] = useState({ lat: 0, lon: 0, altitude: 0, velocity: 0 });
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [unlockedExperiences, setUnlockedExperiences] = useState(['cupola']);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentView, setCurrentView] = useState('overview');
  const [astronautStories, setAstronautStories] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [realTimeData, setRealTimeData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [zeroGMode, setZeroGMode] = useState(false);
  const [cupolaView, setCupolaView] = useState(false);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [peopleInSpace, setPeopleInSpace] = useState([]);
  
 
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const earthRef = useRef(null);
  const issRef = useRef(null);
  const starsRef = useRef(null);
  const cameraRef = useRef(null);
  const audioRef = useRef(null);

 
  const experiences = [
    {
      id: 'cupola',
      title: 'Vista da Cupola',
      description: 'Experimente a vista de 360° da Terra através da famosa janela de observação',
      icon: <Camera className="w-6 h-6" />,
      points: 100,
      requiredLevel: 1,
      duration: '5 min',
      difficulty: 'Fácil',
      facts: [
        'A Cupola tem 7 janelas e oferece a maior janela já construída para o espaço!',
        'Cada janela tem múltiplas camadas para proteção contra micrometeoritos',
        'A vista da Cupola já inspirou milhares de fotos icônicas da Terra'
      ],
      interactive: true
    },
    {
      id: 'zerog',
      title: 'Simulador Gravidade Zero',
      description: 'Entenda como astronautas vivem e trabalham flutuando',
      icon: <Rocket className="w-6 h-6" />,
      points: 150,
      requiredLevel: 2,
      duration: '8 min',
      difficulty: 'Médio',
      facts: [
        'Astronautas experimentam 16 amanheceres e entardeceres por dia!',
        'Ossos e músculos enfraquecem rapidamente sem gravidade',
        'Dormir flutuando requer sacos de dormir presos às paredes'
      ],
      interactive: true
    },
    {
      id: 'experiments',
      title: 'Laboratório Científico',
      description: 'Conduza experimentos que beneficiam a humanidade',
      icon: <Microscope className="w-6 h-6" />,
      points: 200,
      requiredLevel: 3,
      duration: '10 min',
      difficulty: 'Difícil',
      facts: [
        'Mais de 3000 experimentos científicos já foram realizados',
        'Pesquisas sobre câncer avançaram graças à microgravidade',
        'Cristais de proteínas crescem melhor no espaço'
      ],
      interactive: true
    },
    {
      id: 'international',
      title: 'Centro de Cooperação',
      description: 'Conheça a colaboração entre 15 países',
      icon: <Users className="w-6 h-6" />,
      points: 120,
      requiredLevel: 1,
      duration: '6 min',
      difficulty: 'Fácil',
      facts: [
        'ISS é o projeto mais caro da história: $150 bilhões',
        'Astronautas aprendem múltiplos idiomas para cooperar',
        'Cada país contribui com módulos e experimentos únicos'
      ],
      interactive: false
    },
    {
      id: 'spacewalk',
      title: 'Caminhada Espacial EVA',
      description: 'Vista o traje espacial e saia da estação',
      icon: <Compass className="w-6 h-6" />,
      points: 300,
      requiredLevel: 5,
      duration: '15 min',
      difficulty: 'Expert',
      facts: [
        'Trajes espaciais são como naves espaciais pessoais',
        'Uma EVA pode durar até 8 horas',
        'Astronautas treinam debaixo d\'água para simular EVAs'
      ],
      interactive: true
    },
    {
      id: 'communication',
      title: 'Centro de Comunicações',
      description: 'Conecte-se com o controle da missão',
      icon: <Radio className="w-6 h-6" />,
      points: 100,
      requiredLevel: 2,
      duration: '5 min',
      difficulty: 'Fácil',
      facts: [
        'Sinais levam 1.3 segundos para viajar Terra-ISS',
        'ISS perde contato com a Terra várias vezes por dia',
        'Astronautas podem fazer videochamadas com familiares'
      ],
      interactive: false
    }
  ];

  
  const astronautStoriesData = [
    {
      name: 'Chris Hadfield',
      country: '🇨🇦 Canadá',
      mission: 'Expedition 34/35',
      story: 'Primeiro canadense a caminhar no espaço. Ficou famoso por seus vídeos educacionais e por tocar "Space Oddity" na ISS.',
      quote: '"A Terra não tem fronteiras quando vista do espaço"',
      image: '👨‍🚀'
    },
    {
      name: 'Sunita Williams',
      country: '🇺🇸 EUA',
      mission: 'Expedition 14/15, 32/33',
      story: 'Recordista feminina de caminhadas espaciais. Correu a Maratona de Boston na esteira da ISS.',
      quote: '"No espaço, cada dia é uma aventura extraordinária"',
      image: '👩‍🚀'
    },
    {
      name: 'Marcos Pontes',
      country: '🇧🇷 Brasil',
      mission: 'Missão Centenário',
      story: 'Primeiro astronauta brasileiro. Levou a bandeira do Brasil e conduziu 8 experimentos nacionais.',
      quote: '"O espaço pertence a toda a humanidade"',
      image: '👨‍🚀'
    }
  ];

  
  const experimentsData = [
    {
      id: 'protein-crystal',
      title: 'Cristalização de Proteínas',
      category: 'Biomedicina',
      status: 'Em Andamento',
      progress: 67,
      description: 'Crescendo cristais de proteínas para desenvolver novos medicamentos',
      benefit: 'Pode levar a cura de doenças como Alzheimer e câncer',
      icon: '🧬'
    },
    {
      id: 'plant-growth',
      title: 'Cultivo de Plantas',
      category: 'Agricultura Espacial',
      status: 'Completo',
      progress: 100,
      description: 'Estudando como plantas crescem sem gravidade',
      benefit: 'Essencial para missões de longa duração a Marte',
      icon: '🌱'
    },
    {
      id: 'alloy-formation',
      title: 'Formação de Ligas Metálicas',
      category: 'Ciência de Materiais',
      status: 'Em Andamento',
      progress: 45,
      description: 'Criando novos materiais impossíveis de fazer na Terra',
      benefit: 'Materiais mais leves e resistentes para aviação',
      icon: '⚙️'
    }
  ];

 
  const achievementsList = [
    { id: 'first_steps', name: 'Primeiros Passos', description: 'Complete sua primeira experiência', icon: '🚀', points: 50 },
    { id: 'explorer', name: 'Explorador', description: 'Desbloqueie 3 experiências', icon: '🔭', points: 100 },
    { id: 'scientist', name: 'Cientista', description: 'Complete o laboratório', icon: '🔬', points: 200 },
    { id: 'spacewalker', name: 'Caminhante Espacial', description: 'Complete a EVA', icon: '👨‍🚀', points: 500 },
    { id: 'commander', name: 'Comandante', description: 'Alcance nível 10', icon: '⭐', points: 1000 },
    { id: 'earth_observer', name: 'Observador da Terra', description: 'Passe 10 minutos na Cupola', icon: '🌍', points: 150 },
    { id: 'zero_g_master', name: 'Mestre Zero-G', description: 'Domine a gravidade zero', icon: '🎮', points: 250 },
    { id: 'international', name: 'Diplomata Espacial', description: 'Aprenda sobre todos os países parceiros', icon: '🤝', points: 300 }
  ];

 
  const timeline = [
    { year: 1998, month: 'Nov', event: 'Lançamento do módulo Zarya (Rússia)', highlight: true, details: 'Primeiro componente da ISS lançado ao espaço' },
    { year: 1998, month: 'Dez', event: 'Unity (EUA) se conecta ao Zarya', highlight: false, details: 'Primeira conexão internacional no espaço' },
    { year: 2000, month: 'Nov', event: 'Expedition 1 - Primeira tripulação permanente', highlight: true, details: 'Bill Shepherd, Yuri Gidzenko e Sergei Krikalev' },
    { year: 2001, month: 'Abr', event: 'Canadarm2 instalado', highlight: false, details: 'Braço robótico crucial para construção' },
    { year: 2003, month: 'Fev', event: 'Tragédia do Columbia', highlight: true, details: 'ISS continua com suprimentos limitados' },
    { year: 2008, month: 'Fev', event: 'Laboratório Columbus (ESA)', highlight: false, details: 'Europa ganha seu próprio laboratório' },
    { year: 2008, month: 'Mar', event: 'Módulo Japonês Kibo', highlight: false, details: 'Maior módulo da estação' },
    { year: 2011, month: 'Jul', event: 'Última missão Space Shuttle', highlight: true, details: 'Fim de uma era, início da comercialização' },
    { year: 2016, month: 'Abr', event: 'BEAM - Módulo inflável', highlight: false, details: 'Teste para habitats futuros' },
    { year: 2020, month: 'Mai', event: 'SpaceX Crew Dragon', highlight: true, details: 'Era comercial espacial começa' },
    { year: 2021, month: 'Abr', event: 'Módulo Nauka (Rússia)', highlight: false, details: 'Novo laboratório multipropósito' },
    { year: 2023, month: 'Nov', event: '25 anos de operação contínua', highlight: true, details: 'Maior colaboração internacional da história' }
  ];

 
  useEffect(() => {
    if (typeof window !== 'undefined' && soundEnabled) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
  }, [soundEnabled]);


  useEffect(() => {
    const fetchISSPosition = async () => {
      try {
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await response.json();
        setIssPosition({
          lat: data.latitude,
          lon: data.longitude,
          altitude: data.altitude,
          velocity: data.velocity
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ISS position:', error);
        setIssPosition({ lat: 51.5074, lon: -0.1278, altitude: 408, velocity: 27600 });
        setLoading(false);
      }
    };

   
    const fetchPeopleInSpace = async () => {
      try {
        const response = await fetch('http://api.open-notify.org/astros.json');
        const data = await response.json();
        setPeopleInSpace(data.people.filter(p => p.craft === 'ISS'));
      } catch (error) {
        console.error('Error fetching people in space:', error);
        setPeopleInSpace([
          { name: 'Jasmin Moghbeli', craft: 'ISS' },
          { name: 'Andreas Mogensen', craft: 'ISS' },
          { name: 'Satoshi Furukawa', craft: 'ISS' }
        ]);
      }
    };

    fetchISSPosition();
    fetchPeopleInSpace();
    const interval = setInterval(fetchISSPosition, 5000);
    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    if (!mountRef.current) return;

   
    const scene = new THREE.Scene();
    sceneRef.current = scene;

   
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = cupolaView ? 1.2 : 3;
    cameraRef.current = camera;

   
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

   
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.002,
      transparent: true,
      opacity: 0.8
    });
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    starsRef.current = stars;

    
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2e7dff,
      emissive: 0x112244,
      shininess: 20,
      specular: 0x222222
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.castShadow = true;
    earth.receiveShadow = true;
    scene.add(earth);
    earthRef.current = earth;

   
    const atmosphereGeometry = new THREE.SphereGeometry(1.1, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x4444ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    const cloudsGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    
    const issGroup = new THREE.Group();
    
    
    const issBodyGeometry = new THREE.BoxGeometry(0.1, 0.04, 0.15);
    const issBodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xdddddd,
      emissive: 0x222222,
      metalness: 0.8
    });
    const issBody = new THREE.Mesh(issBodyGeometry, issBodyMaterial);
    issGroup.add(issBody);
    
    
    const panelGeometry = new THREE.BoxGeometry(0.3, 0.001, 0.1);
    const panelMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x000044,
      emissive: 0x000022,
      metalness: 0.9
    });
    
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.x = -0.2;
    issGroup.add(leftPanel);
    
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.x = 0.2;
    issGroup.add(rightPanel);
    
    issGroup.position.set(1.5, 0, 0);
    scene.add(issGroup);
    issRef.current = issGroup;

 
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(5, 3, 5);
    sunLight.castShadow = true;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 50;
    scene.add(sunLight);

    
    const earthGlow = new THREE.PointLight(0x4444ff, 0.5, 3);
    earthGlow.position.set(0, 0, 0);
    scene.add(earthGlow);

    
    const animate = () => {
      requestAnimationFrame(animate);
      
     
      if (earthRef.current) {
        earthRef.current.rotation.y += 0.002;
      }
      clouds.rotation.y += 0.0015;
      clouds.rotation.x += 0.0005;
      
   
      const time = Date.now() * 0.0005;
      if (issRef.current) {
        issRef.current.position.x = Math.cos(time) * 1.5;
        issRef.current.position.z = Math.sin(time) * 1.5;
        issRef.current.position.y = Math.sin(time * 2) * 0.2;
        issRef.current.rotation.y = -time;
        
        
        if (issRef.current.children[1]) {
          issRef.current.children[1].rotation.z = Math.sin(time * 2) * 0.1;
          issRef.current.children[2].rotation.z = -Math.sin(time * 2) * 0.1;
        }
      }
      
     
      if (starsRef.current) {
        starsRef.current.rotation.x += 0.0001;
        starsRef.current.rotation.y += 0.0001;
      }
      
     
      if (zeroGMode && cameraRef.current) {
        camera.position.x = Math.sin(time * 0.5) * 0.5;
        camera.position.y = Math.cos(time * 0.3) * 0.3;
        camera.rotation.z = Math.sin(time * 0.2) * 0.1;
      }
      
      
      if (cupolaView && cameraRef.current) {
        camera.position.x = Math.sin(time * 0.1) * 0.1;
        camera.position.y = Math.cos(time * 0.1) * 0.1;
        camera.lookAt(0, 0, 0);
      }
      
      renderer.render(scene, camera);
    };
    animate();

    
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [cupolaView, zeroGMode]);

  
  const selectExperience = useCallback((exp) => {
    if (exp.requiredLevel > userLevel) {
      showNotification(`Requer nível ${exp.requiredLevel}!`, 'warning');
      return;
    }
    
    setSelectedExperience(exp);
    setUserScore(prev => {
      const newScore = prev + exp.points;
      checkLevelUp(newScore);
      return newScore;
    });
    
    if (!achievements.includes(exp.id)) {
      setAchievements(prev => [...prev, exp.id]);
      checkAchievements(exp.id);
    }
    
    if (!unlockedExperiences.includes(exp.id)) {
      setUnlockedExperiences(prev => [...prev, exp.id]);
    }
    
   
    if (exp.id === 'cupola') {
      setCupolaView(true);
      setTimeout(() => setCupolaView(false), 10000);
    } else if (exp.id === 'zerog') {
      setZeroGMode(true);
      setTimeout(() => setZeroGMode(false), 8000);
    }
    
    showNotification(`+${exp.points} pontos ganhos!`, 'success');
  }, [userLevel, achievements, unlockedExperiences]);

 
  const checkLevelUp = (score) => {
    const newLevel = Math.floor(score / 500) + 1;
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
      showNotification(`🎉 Nível ${newLevel} alcançado!`, 'success');
      unlockNewExperiences(newLevel);
    }
  };

  
  const unlockNewExperiences = (level) => {
    experiences.forEach(exp => {
      if (exp.requiredLevel <= level && !unlockedExperiences.includes(exp.id)) {
        setUnlockedExperiences(prev => [...prev, exp.id]);
        showNotification(`🔓 ${exp.title} desbloqueado!`, 'info');
      }
    });
  };

  
  const checkAchievements = (expId) => {
    if (expId === 'cupola' && !achievements.includes('first_steps')) {
      unlockAchievement('first_steps');
    }
    if (achievements.length === 3 && !achievements.includes('explorer')) {
      unlockAchievement('explorer');
    }
    if (expId === 'experiments' && !achievements.includes('scientist')) {
      unlockAchievement('scientist');
    }
    if (userLevel >= 10 && !achievements.includes('commander')) {
      unlockAchievement('commander');
    }
  };

 
  const unlockAchievement = (achId) => {
    const achievement = achievementsList.find(a => a.id === achId);
    if (achievement) {
      setAchievements(prev => [...prev, achId]);
      setUserScore(prev => prev + achievement.points);
      showNotification(`🏆 Conquista: ${achievement.name}!`, 'achievement');
    }
  };

  
  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  
  useEffect(() => {
    setAstronautStories(astronautStoriesData);
    setExperiments(experimentsData);
  }, []);

  
  const runExperiment = (expId) => {
    const exp = experiments.find(e => e.id === expId);
    if (exp) {
      showNotification(`Experimento ${exp.title} iniciado!`, 'success');
      setTimeout(() => {
        showNotification(`Experimento concluído! +50 pontos`, 'success');
        setUserScore(prev => prev + 50);
      }, 3000);
    }
  };

  
  const shareProgress = () => {
    const text = `🚀 Estou explorando a ISS no seu 25º aniversário! Nível ${userLevel}, ${userScore} pontos, ${achievements.length} conquistas! #NASA #SpaceApps2025`;
    if (navigator.share) {
      navigator.share({ title: 'ISS Experience', text });
    } else {
      navigator.clipboard.writeText(text);
      showNotification('Progresso copiado!', 'success');
    }
  };

  
  const calculateProgress = () => {
    const totalExperiences = experiences.length;
    const completed = achievements.length;
    return Math.round((completed / totalExperiences) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black text-white overflow-x-hidden">
      <header className="bg-black/50 backdrop-blur-md border-b border-blue-500/30 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Rocket className="w-8 h-8 text-blue-400 animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ISS 25º Aniversário Experience
                </h1>
                <p className="text-sm text-gray-400">Celebrando 25 anos de cooperação espacial</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Live indicator */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">AO VIVO</span>
              </div>
              
              {/* Sound toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              
              {/* Share */}
              <button
                onClick={shareProgress}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              {/* User Stats */}
              <div className="flex items-center gap-4 bg-black/30 px-4 py-2 rounded-lg">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Nível {userLevel}</p>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all"
                      style={{ width: `${(userScore % 500) / 5}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Pontuação</p>
                  <p className="text-xl font-bold text-yellow-400">{userScore.toLocaleString()}</p>
                </div>
                <div className="flex gap-1">
                  {achievements.slice(0, 5).map((a, i) => (
                    <Award key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                  {achievements.length > 5 && (
                    <span className="text-xs text-yellow-400">+{achievements.length - 5}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {['overview', 'experiences', 'crew', 'experiments', 'timeline', 'achievements'].map(tab => (
              <button
                key={tab}
                onClick={() => setCurrentView(tab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  currentView === tab 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`px-4 py-2 rounded-lg shadow-lg animate-slide-in ${
              notif.type === 'success' ? 'bg-green-600' :
              notif.type === 'warning' ? 'bg-yellow-600' :
              notif.type === 'achievement' ? 'bg-purple-600' :
              'bg-blue-600'
            }`}
          >
            <p className="text-sm font-medium">{notif.message}</p>
          </div>
        ))}
      </div>

      {/* Main Content - Continue in next section... */}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Overview View */}
        {currentView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3D Visualization */}
            <div className="lg:col-span-2">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Posição Atual da ISS
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCupolaView(!cupolaView)}
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        cupolaView ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      Vista Cupola
                    </button>
                    <button
                      onClick={() => setZeroGMode(!zeroGMode)}
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        zeroGMode ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      Zero-G
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                  </div>
                ) : (
                  <>
                    <div ref={mountRef} className="h-96 rounded-lg overflow-hidden mb-4 bg-black" />
                    
                    {/* ISS Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-900/30 p-3 rounded-lg">
                        <p className="text-xs text-gray-400">Latitude</p>
                        <p className="text-lg font-mono">{issPosition.lat.toFixed(4)}°</p>
                      </div>
                      <div className="bg-blue-900/30 p-3 rounded-lg">
                        <p className="text-xs text-gray-400">Longitude</p>
                        <p className="text-lg font-mono">{issPosition.lon.toFixed(4)}°</p>
                      </div>
                      <div className="bg-blue-900/30 p-3 rounded-lg">
                        <p className="text-xs text-gray-400">Altitude</p>
                        <p className="text-lg font-mono">{issPosition.altitude.toFixed(1)} km</p>
                      </div>
                      <div className="bg-blue-900/30 p-3 rounded-lg">
                        <p className="text-xs text-gray-400">Velocidade</p>
                        <p className="text-lg font-mono">{(issPosition.velocity / 1000).toFixed(1)} km/s</p>
                      </div>
                    </div>
                    
                    {/* Current Location Over */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Passando sobre:</p>
                      <p className="text-lg font-semibold">
                        {issPosition.lat > 0 ? 'Hemisfério Norte' : 'Hemisfério Sul'}, 
                        {' '}{Math.abs(issPosition.lon) > 90 ? 'Oceano Pacífico' : 'Continente'}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/30 p-4">
                  <Wifi className="w-8 h-8 text-green-400 mb-2" />
                  <p className="text-2xl font-bold">{peopleInSpace.length}</p>
                  <p className="text-sm text-gray-400">Pessoas no Espaço</p>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-4">
                  <Zap className="w-8 h-8 text-yellow-400 mb-2" />
                  <p className="text-2xl font-bold">16</p>
                  <p className="text-sm text-gray-400">Órbitas por Dia</p>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4">
                  <Activity className="w-8 h-8 text-purple-400 mb-2" />
                  <p className="text-2xl font-bold">3000+</p>
                  <p className="text-sm text-gray-400">Experimentos</p>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              {/* Progress Overview */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4">
                <h3 className="text-lg font-semibold mb-3">Seu Progresso</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Experiências Completas</span>
                      <span>{achievements.length}/{experiences.length}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all"
                        style={{ width: `${calculateProgress()}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Próximas Conquistas</p>
                    {achievementsList
                      .filter(a => !achievements.includes(a.id))
                      .slice(0, 3)
                      .map(ach => (
                        <div key={ach.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-1">
                          <span className="text-xl">{ach.icon}</span>
                          <div className="flex-1">
                            <p className="text-xs font-medium">{ach.name}</p>
                            <p className="text-xs text-gray-400">{ach.description}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>

              {/* Current Crew */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Tripulação Atual
                </h3>
                <div className="space-y-2">
                  {peopleInSpace.slice(0, 5).map((person, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                      <div className="text-2xl">👨‍🚀</div>
                      <div>
                        <p className="text-sm font-medium">{person.name}</p>
                        <p className="text-xs text-gray-400">ISS Expedition</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Experiences View */}
        {currentView === 'experiences' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiences.map(exp => {
              const isUnlocked = exp.requiredLevel <= userLevel;
              const isCompleted = achievements.includes(exp.id);
              
              return (
                <div
                  key={exp.id}
                  className={`relative bg-black/30 backdrop-blur-sm rounded-xl border p-6 transition-all cursor-pointer ${
                    isUnlocked 
                      ? 'border-blue-500/30 hover:border-blue-400 hover:transform hover:scale-105' 
                      : 'border-gray-700/30 opacity-50'
                  }`}
                  onClick={() => isUnlocked && selectExperience(exp)}
                >
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Requer Nível {exp.requiredLevel}</p>
                      </div>
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-blue-600/20 rounded-lg">
                      {exp.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{exp.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-yellow-600/20 px-2 py-1 rounded">
                          +{exp.points} pts
                        </span>
                        <span className="text-xs bg-blue-600/20 px-2 py-1 rounded">
                          {exp.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3">{exp.description}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded ${
                      exp.difficulty === 'Fácil' ? 'bg-green-600/20 text-green-400' :
                      exp.difficulty === 'Médio' ? 'bg-yellow-600/20 text-yellow-400' :
                      exp.difficulty === 'Difícil' ? 'bg-orange-600/20 text-orange-400' :
                      'bg-red-600/20 text-red-400'
                    }`}>
                      {exp.difficulty}
                    </span>
                    {exp.interactive && (
                      <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                        Interativo
                      </span>
                    )}
                  </div>
                  
                  {selectedExperience?.id === exp.id && (
                    <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
                      <p className="text-xs text-yellow-400 font-semibold mb-2">Fatos Curiosos:</p>
                      {exp.facts.map((fact, idx) => (
                        <p key={idx} className="text-xs text-gray-300 mb-1">• {fact}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Crew Stories View */}
        {currentView === 'crew' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {astronautStoriesData.map((astronaut, idx) => (
              <div key={idx} className="bg-black/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{astronaut.image}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{astronaut.name}</h3>
                    <p className="text-sm text-gray-400">{astronaut.country}</p>
                    <p className="text-xs text-blue-400">{astronaut.mission}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-3">{astronaut.story}</p>
                <blockquote className="italic text-sm text-yellow-400 border-l-2 border-yellow-400 pl-3">
                  {astronaut.quote}
                </blockquote>
              </div>
            ))}
          </div>
        )}

        {/* Experiments View */}
        {currentView === 'experiments' && (
          <div className="space-y-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Microscope className="w-5 h-5" />
                Experimentos Científicos Ativos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {experimentsData.map(exp => (
                  <div key={exp.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{exp.icon}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        exp.status === 'Completo' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {exp.status}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{exp.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">{exp.category}</p>
                    <p className="text-sm text-gray-300 mb-3">{exp.description}</p>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progresso</span>
                        <span>{exp.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full"
                          style={{ width: `${exp.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="p-2 bg-green-900/20 rounded">
                      <p className="text-xs text-green-400">
                        <span className="font-semibold">Benefício:</span> {exp.benefit}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => runExperiment(exp.id)}
                      className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition"
                    >
                      Simular Experimento
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Timeline View */}
        {currentView === 'timeline' && (
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              25 Anos de História da ISS
            </h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-500/30"></div>
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start mb-6">
                  <div className={`absolute left-4 w-4 h-4 rounded-full ${
                    item.highlight ? 'bg-yellow-400 animate-pulse' : 'bg-blue-400'
                  } border-2 border-black`}></div>
                  <div className="ml-12 flex-1">
                    <div className={`p-4 rounded-lg ${
                      item.highlight ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-blue-900/20'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg">{item.year}</span>
                        <span className="text-sm text-gray-400">{item.month}</span>
                        {item.highlight && <Star className="w-4 h-4 text-yellow-400" />}
                      </div>
                      <p className="font-medium mb-1">{item.event}</p>
                      <p className="text-sm text-gray-400">{item.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements View */}
        {currentView === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
              <h2 className="text-xl font-semibold mb-4">Suas Conquistas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievementsList.map(ach => {
                  const unlocked = achievements.includes(ach.id);
                  return (
                    <div 
                      key={ach.id}
                      className={`p-4 rounded-lg border transition-all ${
                        unlocked 
                          ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/30' 
                          : 'bg-gray-900/30 border-gray-700/30 opacity-50'
                      }`}
                    >
                      <div className="text-3xl mb-2 text-center">{ach.icon}</div>
                      <h3 className="font-semibold text-sm text-center mb-1">{ach.name}</h3>
                      <p className="text-xs text-gray-400 text-center mb-2">{ach.description}</p>
                      <p className="text-xs text-center text-yellow-400">+{ach.points} pts</p>
                      {unlocked && (
                        <div className="mt-2 text-center">
                          <CheckCircle className="w-5 h-5 text-green-400 inline" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
              <h3 className="text-lg font-semibold mb-4">Estatísticas Globais</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{userScore.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Pontos Totais</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">{userLevel}</p>
                  <p className="text-sm text-gray-400">Nível Atual</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{achievements.length}</p>
                  <p className="text-sm text-gray-400">Conquistas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-400">{calculateProgress()}%</p>
                  <p className="text-sm text-gray-400">Completo</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-md border-t border-blue-500/30 p-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-blue-400">Sobre o Projeto</h4>
              <p className="text-sm text-gray-400">
                 Celebrando 25 anos da Estação Espacial Internacional.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-blue-400">APIs NASA Utilizadas</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• ISS Location Now API</li>
                <li>• Open Notify - People in Space</li>
                <li>• NASA Image and Video Library</li>
                <li>• Where The ISS At API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-blue-400">Compartilhe</h4>
              <div className="flex gap-3">
                <button 
                  onClick={shareProgress}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition"
                >
                  Compartilhar Progresso
                </button>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition">
                  <Download className="w-4 h-4 inline mr-1" />
                  Baixar Certificado
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          
            <p className="mt-1">Celebrando 25 anos de descobertas e cooperação internacional 🚀</p>
          </div>
        </div>
      </footer>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ISSExperienceApp;