import { useState, useRef, useEffect } from 'react';

// === CUSTOM MODEL SELECTION MENU ===
function ModelSelect({ selectedModel, setSelectedModel }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const models = [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 (70B)', desc: 'Advanced reasoning' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 (8B)', desc: 'Fast responses' },
    { id: 'openai/gpt-oss-120b', name: 'GPT OSS (120B)', desc: 'Massive scale' }
  ];

  // Close menu when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentModel = models.find(m => m.id === selectedModel);

  return (
    <div className="relative z-50" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg text-[13px] font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#27272a] transition-all shadow-sm"
      >
        <span>{currentModel?.name}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>

      <div 
        className={`absolute left-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 origin-top-left ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
      >
        <div className="p-1.5 space-y-0.5">
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => { setSelectedModel(model.id); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex flex-col transition-colors ${
                selectedModel === model.id 
                  ? 'bg-gray-100 dark:bg-[#27272a] text-black dark:text-white' 
                  : 'hover:bg-gray-50 dark:hover:bg-[#222] text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className="text-[13px] font-semibold">{model.name}</span>
              <span className={`text-[11px] ${selectedModel === model.id ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>{model.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// === CHAT MESSAGE COMPONENT ===
function ChatMessage({ msg }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  
  const [rotation, setRotation] = useState(0);
  const [contentHeight, setContentHeight] = useState('140px');
  
  const textRef = useRef(null);

  // Check if text exceeds height threshold to apply clamping
  useEffect(() => {
    if (textRef.current && msg.role === 'user') {
      if (textRef.current.scrollHeight > 140) {
        setIsClamped(true);
      }
    }
  }, [msg.text, msg.role]);

  const handleToggle = () => {
    if (isExpanded) {
      setContentHeight('140px');
      setIsExpanded(false);
      setRotation(prev => prev + 180);
    } else {
      setContentHeight(`${textRef.current.scrollHeight}px`);
      setIsExpanded(true);
      setRotation(prev => prev + 180);
    }
  };

  if (msg.role === 'system') {
    return (
      <div className="mx-auto text-xs font-mono text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] px-4 py-2 rounded-full border border-gray-100 dark:border-gray-800 transition-colors">
        {msg.text}
      </div>
    );
  }

  if (msg.role === 'assistant') {
    return (
      <div className="max-w-[85%] flex flex-col gap-2 items-start">
        <div className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 py-1 break-words whitespace-pre-wrap transition-colors">
          {msg.text}
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {msg.sources.map((src, i) => {
              // Extract filename, removing potential absolute paths
              let rawDocName = src.document_name || src.source || src.doc || 'document.pdf';
              let cleanDocName = rawDocName.split('/').pop().split('\\').pop();
              // Encode filename for URL to properly handle spaces and Cyrillic characters
              let encodedDocName = encodeURIComponent(cleanDocName);
              
              return (
                <a 
                  key={i} 
                  href={`${import.meta.env.VITE_API_BASE_URL}/docs/${encodedDocName}#page=${src.page}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-[11px] font-mono cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-colors no-underline shadow-sm hover:shadow"
                >
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="truncate max-w-[150px]">{cleanDocName}</span> <span className="opacity-40">|</span> p.{src.page}
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[85%] flex flex-col items-end">
      <div 
        className="relative bg-[#f4f4f5] dark:bg-[#27272a] text-gray-900 dark:text-gray-100 px-5 py-3.5 rounded-3xl rounded-tr-sm font-medium text-[15px] leading-relaxed overflow-hidden whitespace-pre-wrap"
        style={{ 
          wordBreak: 'break-word', 
          maxHeight: isClamped ? contentHeight : 'none',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s, color 0.3s' 
        }}
      >
        <div ref={textRef} className={isClamped ? 'pb-8' : ''}>
          {msg.text}
        </div>

        {isClamped && (
          <div 
            className={`absolute bottom-0 left-0 right-0 h-16 flex items-end justify-end p-2 pr-3 pointer-events-none transition-colors duration-400 ${
              isExpanded 
                ? 'bg-transparent' 
                : 'bg-gradient-to-t from-[#f4f4f5] dark:from-[#27272a] from-50% to-transparent'
            }`}
          >
            <button 
              onClick={handleToggle}
              className="pointer-events-auto w-7 h-7 bg-white dark:bg-[#18181b] rounded-full shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              style={{ 
                transform: `rotate(${rotation}deg)`, 
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// === MAIN APPLICATION COMPONENT ===
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [input, setInput] = useState('');
  
  // Model selection state
  // Стан для вибору моделі
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  
  // Session menu and renaming state
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const [isDark, setIsDark] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('theme')) return params.get('theme') === 'dark';
    return localStorage.getItem('rag_theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rag_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const defaultMessage = { role: 'assistant', text: 'System pipelines status: ONLINE.\nReady to analyze industrial documentation.' };
  
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('rag_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map(s => ({
        ...s,
        updatedAt: s.updatedAt || s.id,
        isPinned: s.isPinned || false
      }));
    }
    return [{ id: Date.now(), updatedAt: Date.now(), isPinned: false, title: 'New Conversation', messages: [defaultMessage] }];
  });
  
  const [activeSessionId, setActiveSessionId] = useState(sessions[0]?.id);

  useEffect(() => {
    localStorage.setItem('rag_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return b.updatedAt - a.updatedAt;
    }
    return a.isPinned ? -1 : 1;
  });

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  const updateActiveSessionMessages = (newMessages) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const firstUserMsg = newMessages.find(m => m.role === 'user');
        const newTitle = firstUserMsg && s.title === 'New Conversation' 
          ? firstUserMsg.text.slice(0, 25) + '...' 
          : s.title;
        return { ...s, title: newTitle, messages: newMessages, updatedAt: Date.now() };
      }
      return s;
    }));
  };

  const handleNewChat = () => {
    const newId = Date.now();
    setSessions(prev => [{ id: newId, updatedAt: newId, isPinned: false, title: 'New Conversation', messages: [defaultMessage] }, ...prev]);
    setActiveSessionId(newId);
    setAttachedFile(null);
    setInput('');
  };

  // MENU FUNCTIONS
  const togglePin = (e, id) => {
    e.stopPropagation();
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
    setOpenMenuId(null);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== id);
      if (newSessions.length === 0) {
        const newId = Date.now();
        setActiveSessionId(newId);
        return [{ id: newId, updatedAt: newId, isPinned: false, title: 'New Conversation', messages: [defaultMessage] }];
      }
      if (activeSessionId === id) {
        setActiveSessionId(newSessions[0].id);
      }
      return newSessions;
    });
    setOpenMenuId(null);
  };

  const startRename = (e, session) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
    setOpenMenuId(null);
  };

  const saveRename = (id) => {
    if (editTitle.trim()) {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, title: editTitle.trim() } : s));
    }
    setEditingId(null);
  };

  // Input handling
  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    if (input === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input]);

const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() && !attachedFile) return;

    // Cache values to clear UI instantly
    const userText = input.trim();
    const fileToSend = attachedFile;
    const newMessages = [...activeSession.messages];
    
    if (fileToSend) {
      newMessages.push({ role: 'system', text: `[System] Uploading & Processing: "${fileToSend.name}"...` });
    }
    if (userText) {
      newMessages.push({ role: 'user', text: userText });
    }

    // Update UI to show user message
    updateActiveSessionMessages(newMessages);
    setInput('');
    setAttachedFile(null);

    try {
      // 1. Prepare form data payload (Text + File + Model)
      const formData = new FormData();
      if (userText) formData.append('query', userText);
      if (fileToSend) formData.append('file', fileToSend);
      formData.append('model', selectedModel); // Append selected model

      // 2. Execute backend request using environment variable
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // 3. Parse FastAPI response
      const data = await response.json();

      // 4. Append assistant response to UI
      updateActiveSessionMessages([
        ...newMessages, 
        { 
          role: 'assistant', 
          text: data.text || "No text received.",
          sources: data.sources || [] 
        }
      ]);

    } catch (error) {
      console.error("Fetch error:", error);
      updateActiveSessionMessages([
        ...newMessages, 
        { role: 'system', text: `[Error] Failed connecting to RAG backend: ${error.message}` }
      ]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setAttachedFile(file);
    e.target.value = null; 
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex text-gray-900 dark:text-gray-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      
      {/* SIDEBAR */}
      <div className={`${isSidebarOpen ? 'w-72' : 'w-16'} group transition-all duration-300 ease-in-out border-r border-gray-100 dark:border-gray-800 bg-[#f9f9f9] dark:bg-[#121212] flex flex-col shrink-0 z-40 relative`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
          
          <div className={`overflow-hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <h1 className="font-extrabold tracking-tight text-[13.5px] text-gray-900 dark:text-white whitespace-nowrap ml-2">
              Engineering RAG <span className="font-light text-gray-400 dark:text-gray-500">Copilot</span>
            </h1>
          </div>

          {isSidebarOpen ? (
            <button onClick={() => setIsSidebarOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" className="text-gray-400"></rect>
                <line x1="8" y1="6" x2="8" y2="18"></line>
                <polyline points="15 8 11 12 15 16"></polyline>
              </svg>
            </button>
          ) : (
            <div className="w-full h-full flex items-center justify-center cursor-pointer relative" onClick={() => setIsSidebarOpen(true)}>
              <img src="/favicon.png" alt="MS Logo" className="w-6 h-6 object-contain absolute transition-opacity duration-200 group-hover:opacity-0 filter dark:invert" />
              <div className="absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" className="text-gray-400"></rect>
                  <line x1="16" y1="6" x2="16" y2="18"></line>
                  <polyline points="9 8 13 12 9 16"></polyline>
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {/* New Chat Button */}
        <div className={`p-4 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'}`}>
          <button onClick={handleNewChat} className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#18181b] dark:bg-white text-white dark:text-black text-[13px] font-semibold rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-colors shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Chat
          </button>
        </div>

        {/* Sessions List */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 space-y-2 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {sortedSessions.map(session => (
            <div 
              key={session.id}
              className={`relative group transition-all duration-300 ${openMenuId === session.id ? 'z-50' : 'z-10'}`}
            >
              <div 
                onClick={() => setActiveSessionId(session.id)}
                className={`p-3 pr-8 rounded-xl border text-sm font-medium cursor-pointer shadow-sm w-full transition-colors ${
                  activeSessionId === session.id 
                    ? 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white' 
                    : 'bg-transparent border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {/* Pin Icon */}
                  {session.isPinned && (
                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                    </svg>
                  )}
                  
                  {/* Renaming Logic */}
                  {editingId === session.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename(session.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      onBlur={() => saveRename(session.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-white dark:bg-[#27272a] border border-gray-500 rounded px-1 -ml-1 text-sm outline-none w-full text-gray-900 dark:text-white"
                    />
                  ) : (
                    <span className="truncate">{session.title}</span>
                  )}
                </div>
              </div>

              {/* Options Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === session.id ? null : session.id);
                }}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${
                  openMenuId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="2"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                  <circle cx="12" cy="19" r="2"></circle>
                </svg>
              </button>

              {/* Dropdown Menu with Overlay */}
              {openMenuId === session.id && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
                  ></div>
                  <div className="absolute right-8 top-8 z-50 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg py-1.5 w-44 text-[13px] font-medium overflow-hidden">
                    <button 
                      onClick={(e) => togglePin(e, session.id)} 
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {session.isPinned ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.143 3.143l7.714 7.714M3 21l6.857-6.857M10.286 10.286l3.428 3.428M15.429 8.571L12 5.143M5.143 12l3.428-3.428M21 21L3 3" /></svg>
                          Unpin Chat
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
                          Pin Chat
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={(e) => startRename(e, session)} 
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      Rename Chat
                    </button>

                    <button 
                      onClick={(e) => deleteSession(e, session.id)} 
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 text-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Delete Chat
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0a0a0a] relative transition-colors duration-300">
        
        <div className="h-16 border-b border-gray-100 dark:border-gray-800 px-8 flex justify-between items-center bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm z-10 transition-colors">
          
          {/* Custom Model Selector */}
          <ModelSelect selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
          
          <button 
            onClick={() => setIsDark(!isDark)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 transition-colors overflow-hidden"
            title="Toggle Theme"
          >
            <svg className={`absolute w-5 h-5 transition-all duration-500 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg className={`absolute w-5 h-5 transition-all duration-500 ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          <div className="max-w-3xl mx-auto space-y-8 pb-4">
            {activeSession?.messages.map((msg, index) => (
              <ChatMessage key={index} msg={msg} />
            ))}
          </div>
        </div>

        <div className="p-6 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md transition-colors">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex flex-col bg-[#f4f4f5] dark:bg-[#27272a] rounded-[24px] focus-within:bg-[#ebebeb] dark:focus-within:bg-[#323236] transition-colors duration-300">
              
              {attachedFile && (
                <div className="pt-4 px-5 pb-1">
                  <div className="inline-flex items-center gap-2 bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 shadow-sm transition-colors">
                    <div className="p-1.5 bg-gray-50 dark:bg-[#27272a] rounded-lg">
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v6h6v10H6z"/></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                      {attachedFile.name}
                    </span>
                    <button onClick={() => setAttachedFile(null)} className="ml-1 text-gray-400 hover:text-red-500 transition-colors p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2 p-2">
                <input type="file" accept=".pdf,.txt,.doc" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                
                <button type="button" onClick={() => fileInputRef.current.click()} className="p-2.5 mb-0.5 ml-2 text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Ask a question or upload a document..."
                  className="flex-1 max-h-[150px] min-h-[24px] py-3.5 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 resize-none text-[15px] text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 leading-relaxed"
                  rows={1}
                />

                <button 
                  onClick={handleSend}
                  disabled={!input.trim() && !attachedFile}
                  className="w-10 h-10 mb-1 flex-shrink-0 bg-[#18181b] dark:bg-white text-white dark:text-black rounded-full disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-100 dark:disabled:text-gray-500 hover:bg-black dark:hover:bg-gray-200 transition-all flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V6m0 0l-8 8m8-8l8 8" /></svg>
                </button>
              </div>
            </div>
            
            <div className="text-center mt-3 text-[11px] text-gray-400 dark:text-gray-500 font-medium transition-colors">
              RAG Copilot uses localized Vector Search. Verify critical engineering parameters manually.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;