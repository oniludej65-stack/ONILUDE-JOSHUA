// ============ DATA STORE ============
let projects = JSON.parse(localStorage.getItem('jp_projects') || '[]');
let gallery = JSON.parse(localStorage.getItem('jp_gallery') || '[]');
let messages = JSON.parse(localStorage.getItem('jp_messages') || '[]');

function saveData() {
  localStorage.setItem('jp_projects', JSON.stringify(projects));
  localStorage.setItem('jp_gallery', JSON.stringify(gallery));
  localStorage.setItem('jp_messages', JSON.stringify(messages));
}

// ============ CUSTOM CURSOR ============
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

window.addEventListener("mousemove", function(e) {
  const posX = e.clientX;
  const posY = e.clientY;
  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;
  cursorOutline.style.left = `${posX}px`;
  cursorOutline.style.top = `${posY}px`;
  cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 300, fill: "forwards" });
});

// ============ LOADER ============
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.6s ease';
    setTimeout(() => { loader.style.display = 'none'; }, 600);
  }, 2000);
});

// ============ SCROLL REVEAL ============
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => observer.observe(el));

// ============ TYPEWRITER ============
const typewriterPhrases = [
  "Premium Websites",
  "Digital Solutions",
  "Elite Experiences",
  "Brand Growth"
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typewriterEl = document.getElementById("typewriterText");

function typewrite() {
  const currentPhrase = typewriterPhrases[phraseIndex];
  typewriterEl.textContent = isDeleting ? currentPhrase.substring(0, charIndex - 1) : currentPhrase.substring(0, charIndex + 1);
  charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
  
  let speed = isDeleting ? 40 : 100;
  if (!isDeleting && charIndex === currentPhrase.length) { speed = 2000; isDeleting = true; } 
  else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % typewriterPhrases.length; speed = 500; }
  setTimeout(typewrite, speed);
}
typewrite();

// ============ MOBILE MENU ============
function toggleMobileMenu() { document.getElementById('mobileMenu').classList.toggle('hidden'); }

// ============ TOAST ============
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============ ADMIN PANEL ============
function openAdmin() {
  document.getElementById('mainSite').style.display = 'none';
  document.getElementById('adminPanel').classList.remove('hidden');
  switchAdminTab('dashboard', document.querySelector('.sidebar-link.active'));
  refreshAdminData();
}

function closeAdmin() {
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('mainSite').style.display = '';
  refreshPublicProjects();
  lucide.createIcons();
  // Re-observe reveals
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('collapsed');
  document.getElementById('adminMain').classList.toggle('expanded');
}

function switchAdminTab(tab, element) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.add('hidden'));
  document.getElementById('tab-' + tab).classList.remove('hidden');
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  if(element) element.classList.add('active');
  refreshAdminData();
}

// ============ REFRESH DATA ============
function refreshAdminData() {
  document.getElementById('statProjects').textContent = projects.length;
  document.getElementById('statGallery').textContent = gallery.length;
  document.getElementById('statMessages').textContent = messages.length;
  document.getElementById('statPublished').textContent = projects.filter(p => p.published).length;

  const projList = document.getElementById('adminProjectList');
  const noProj = document.getElementById('noAdminProjects');
  if (projects.length === 0) { projList.innerHTML = ''; noProj.style.display = ''; } 
  else {
    noProj.style.display = 'none';
    projList.innerHTML = projects.map(p => `
      <div class="glass-card rounded-2xl overflow-hidden">
        ${p.image ? `<img src="${p.image}" class="w-full h-48 object-cover" alt="${p.title}" onerror="this.style.display='none'" />` : `<div class="w-full h-48 bg-blue-950 flex items-center justify-center"><i data-lucide="folder" class="w-10 h-10 text-blue-800"></i></div>`}
        <div class="p-5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase tracking-widest ${p.published ? 'text-amber-500' : 'text-slate-600'}">${p.published ? 'Published' : 'Draft'}</span>
            <span class="text-xs text-slate-600">${p.category}</span>
          </div>
          <h4 class="text-lg font-semibold mb-4">${p.title}</h4>
          <div class="flex gap-2">
            <button onclick="editProject('${p.id}')" class="flex-1 bg-blue-950 hover:bg-blue-900 text-slate-300 text-xs font-medium py-2 rounded-lg transition">Edit</button>
            <button onclick="togglePublish('${p.id}')" class="flex-1 ${p.published ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'} text-xs font-medium py-2 rounded-lg transition">${p.published ? 'Unpublish' : 'Publish'}</button>
            <button onclick="deleteProject('${p.id}')" class="bg-red-500/10 text-red-400 text-xs font-medium py-2 px-3 rounded-lg transition"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>
        </div>
      </div>
    `).join('');
  }

  const galGrid = document.getElementById('adminGalleryGrid');
  const noGal = document.getElementById('noAdminGallery');
  if (gallery.length === 0) { galGrid.innerHTML = ''; noGal.style.display = ''; } 
  else {
    noGal.style.display = 'none';
    galGrid.innerHTML = gallery.map(g => `
      <div class="relative group">
        <img src="${g.url}" class="gallery-thumb" alt="${g.title}" onerror="this.src='https://picsum.photos/seed/fallback${g.id}/400/300.jpg'" />
        <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
          <p class="text-xs text-white font-medium truncate">${g.title}</p>
        </div>
        <button onclick="deleteGalleryItem('${g.id}')" class="absolute top-2 right-2 w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><i data-lucide="x" class="w-3.5 h-3.5 text-white"></i></button>
      </div>
    `).join('');
  }

  const msgList = document.getElementById('adminMessagesList');
  const noMsg = document.getElementById('noAdminMessages');
  if (messages.length === 0) { msgList.innerHTML = ''; noMsg.style.display = ''; } 
  else {
    noMsg.style.display = 'none';
    msgList.innerHTML = messages.map(m => `
      <div class="glass-card rounded-2xl p-5">
        <div class="flex items-start justify-between mb-2">
          <div><span class="text-sm font-semibold text-white">${m.name}</span> <span class="text-xs text-slate-600 ml-2">${m.email}</span></div>
          <button onclick="deleteMessage('${m.id}')" class="text-slate-600 hover:text-red-400 transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
        </div>
        <p class="text-slate-400 text-sm font-light">${m.message}</p>
      </div>
    `).join('');
  }
  lucide.createIcons();
}

// ============ PUBLIC PROJECTS ============
function refreshPublicProjects() {
  const published = projects.filter(p => p.published);
  const container = document.getElementById('publicProjects');
  const noMsg = document.getElementById('noProjectsMsg');
  if (published.length === 0) { container.innerHTML = ''; noMsg.style.display = ''; } 
  else {
    noMsg.style.display = 'none';
    container.innerHTML = published.map(p => `
      <div class="group glass-card rounded-3xl overflow-hidden reveal active">
        ${p.image ? `<div class="h-64 overflow-hidden"><img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="${p.title}" onerror="this.parentElement.style.display='none'" /></div>` : ''}
        <div class="p-8">
          <span class="text-xs font-bold uppercase tracking-widest text-amber-500">${p.category}</span>
          <h3 class="text-2xl font-serif font-semibold mt-2 mb-3">${p.title}</h3>
          <p class="text-slate-400 text-sm leading-relaxed font-light line-clamp-3">${p.description || ''}</p>
          ${p.url ? `<a href="${p.url}" target="_blank" class="inline-flex items-center gap-2 text-amber-500 text-sm mt-6 font-semibold hover:text-amber-400 transition">View Project <i data-lucide="arrow-right" class="w-4 h-4"></i></a>` : ''}
        </div>
      </div>
    `).join('');
  }
  lucide.createIcons();
}

// ============ PROJECT CRUD ============
function openProjectModal(editId) {
  document.getElementById('projectModal').classList.add('show');
  document.getElementById('projectForm').reset();
  document.getElementById('projectEditId').value = '';
  document.getElementById('projectModalTitle').textContent = 'New Project';
  if (editId) {
    const p = projects.find(pr => pr.id === editId);
    if (p) {
      document.getElementById('projectEditId').value = p.id;
      document.getElementById('projectTitle').value = p.title;
      document.getElementById('projectCategory').value = p.category;
      document.getElementById('projectDesc').value = p.description || '';
      document.getElementById('projectImage').value = p.image || '';
      document.getElementById('projectUrl').value = p.url || '';
      document.getElementById('projectPublished').checked = p.published;
      document.getElementById('projectModalTitle').textContent = 'Edit Project';
    }
  }
}
function closeProjectModal() { document.getElementById('projectModal').classList.remove('show'); }

function handleProjectSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('projectEditId').value;
  const data = {
    id: editId || 'p_' + Date.now(),
    title: document.getElementById('projectTitle').value,
    category: document.getElementById('projectCategory').value,
    description: document.getElementById('projectDesc').value,
    image: document.getElementById('projectImage').value,
    url: document.getElementById('projectUrl').value,
    published: document.getElementById('projectPublished').checked
  };
  if (editId) { const idx = projects.findIndex(p => p.id === editId); if (idx !== -1) projects[idx] = data; showToast('Project updated!'); } 
  else { projects.push(data); showToast('Project created!'); }
  saveData(); closeProjectModal(); refreshAdminData();
}

function editProject(id) { openProjectModal(id); }

function togglePublish(id) {
  const p = projects.find(pr => pr.id === id);
  if (p) { p.published = !p.published; saveData(); refreshAdminData(); showToast(p.published ? 'Published!' : 'Unpublished'); }
}

function deleteProject(id) {
  if (confirm('Delete this project?')) { projects = projects.filter(p => p.id !== id); saveData(); refreshAdminData(); showToast('Deleted'); }
}

// ============ GALLERY CRUD ============
function openGalleryModal() { document.getElementById('galleryModal').classList.add('show'); }
function closeGalleryModal() { document.getElementById('galleryModal').classList.remove('show'); }

function handleGallerySubmit(e) {
  e.preventDefault();
  gallery.push({ id: 'g_' + Date.now(), url: document.getElementById('galleryImageUrl').value, title: document.getElementById('galleryTitle').value });
  saveData(); closeGalleryModal(); refreshAdminData(); showToast('Image uploaded!');
}

function deleteGalleryItem(id) {
  if (confirm('Delete this image?')) { gallery = gallery.filter(g => g.id !== id); saveData(); refreshAdminData(); showToast('Deleted'); }
}

// ============ MESSAGES ============
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  messages.push({ id: 'm_' + Date.now(), name: form.querySelector('input[type="text"]').value, email: form.querySelector('input[type="email"]').value, message: form.querySelector('textarea').value, date: new Date().toLocaleDateString() });
  saveData(); form.reset(); showToast('Message sent successfully!');
}

function deleteMessage(id) { messages = messages.filter(m => m.id !== id); saveData(); refreshAdminData(); showToast('Deleted'); }

// ============ INIT ============
refreshPublicProjects();
lucide.createIcons();