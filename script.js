const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $("#menuToggle"), mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
$$(".main-nav a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open"); menuToggle.setAttribute("aria-expanded","false"); menuToggle.textContent="☰";
}));

// Experience filters
$$(".exp-tab").forEach(tab => tab.addEventListener("click", () => {
  $$(".exp-tab").forEach(t => {t.classList.toggle("active", t===tab);t.setAttribute("aria-selected",String(t===tab));});
  const filter = tab.dataset.filter;
  $$(".timeline-item").forEach(item => item.classList.toggle("hidden", filter!=="all" && item.dataset.category!==filter));
}));

// Portfolio filters
$$(".work-filter").forEach(tab => tab.addEventListener("click", () => {
  $$(".work-filter").forEach(t => t.classList.toggle("active",t===tab));
  const filter=tab.dataset.work;
  $$(".work-card").forEach(card => card.classList.toggle("hidden",filter!=="all" && card.dataset.kind!==filter));
}));

const projectData = {
  dm: {eyebrow:"01 / DM SETTING",title:"From first message to qualified lead",body:`<p>A thoughtful conversation starts with understanding the person, not pushing a sale. This flow shows how I welcome an inquiry, learn what the person needs, and guide them toward a clear next step.</p><div class="demo-box"><h3>Conversation flow</h3><div class="demo-row"><b>01 · Welcome</b><br>“Hi! Thanks for reaching out. What are you hoping to create?”</div><div class="demo-row"><b>02 · Qualify</b><br>“What's the goal, preferred style, and timeline for this project?”</div><div class="demo-row"><b>03 · Recommend</b><br>“Based on that, here's the option that fits your needs best.”</div><div class="demo-row"><b>04 · Follow up</b><br>“Just checking in — would you like me to reserve a spot for your project?”</div></div><p><b>Focus:</b> rapport · discovery · qualification · follow-up · handoff</p>`},
  design:{eyebrow:"02 / GRAPHIC DESIGN",title:"Visual communication",body:`<p>Design direction focused on clear hierarchy, bold typography, and a strong visual message. This visual board is a direction preview for social posts, promotional materials, and brand communication.</p><div class="demo-box" style="background:#9e1724;padding:35px;text-align:center"><div style="font:700 48px/.9 'Space Grotesk';letter-spacing:-3px">MAKE<br>IT<br><span style="color:#1b1111">MATTER.</span></div><p style="color:#f4d9d5">A strong message deserves a clear visual.</p></div><p><b>Tools:</b> Adobe Photoshop · social content · promotional design · branding</p>`},
  email:{eyebrow:"03 / EMAIL MANAGEMENT",title:"A cleaner, more useful inbox",body:`<p>An organized inbox helps important conversations move forward. Here's a practical email handling structure.</p><div class="demo-box"><h3>Inbox organization</h3><div class="demo-row">🔴 <b>Action required</b> — inquiries, approvals, urgent requests</div><div class="demo-row">🟡 <b>Waiting for reply</b> — follow-ups and pending responses</div><div class="demo-row">🟢 <b>Completed</b> — resolved conversations and confirmations</div><div class="demo-row">🔵 <b>Reference</b> — receipts, briefs, and project details</div></div><p><b>Reply checklist:</b> acknowledge · clarify · answer · confirm next step · record follow-up.</p>`},
  calendar:{eyebrow:"04 / CALENDAR MANAGEMENT",title:"A week with room to focus",body:`<p>A simple weekly structure balances appointments, admin work, creative tasks, and follow-ups. Selectable time blocks below are a small interactive planning preview.</p><div class="demo-box"><h3>Weekly schedule</h3><div class="mini-calendar"><span><b>MON</b>Focus<br>Admin</span><span><b>TUE</b>Calls<br>Follow-up</span><span><b>WED</b>Projects<br>Review</span><span><b>THU</b>Focus<br>Content</span><span><b>FRI</b>Wrap-up<br>Plan</span></div></div><p>Planning habits: time blocking · clear titles · reminders · buffer time · daily review.</p>`},
  tracker:{eyebrow:"05 / GOOGLE SHEETS",title:"Lead & follow-up tracker",body:`<p>A lightweight tracker keeps inquiries visible and makes the next action easy to identify.</p><div class="demo-box"><table class="tracker-table"><thead><tr><th>LEAD</th><th>STATUS</th><th>NEXT ACTION</th></tr></thead><tbody><tr><td>Alex M.</td><td>New</td><td>Reply</td></tr><tr><td>Jamie R.</td><td>Follow up</td><td>Friday</td></tr><tr><td>Sam C.</td><td>Qualified</td><td>Book call</td></tr><tr><td>Taylor P.</td><td>Closed</td><td>Archive</td></tr></tbody></table></div><p>Suggested columns: date received · name · channel · need · status · last contact · next action · follow-up date.</p>`},
  video:{eyebrow:"06 / VIDEO EDITING",title:"Stories in motion",body:`<p>My editing approach is to make content easy to follow, visually engaging, and suited to its platform.</p><div class="demo-box" style="min-height:150px;display:grid;place-items:center;background:radial-gradient(circle,#781b25,#171313)"><div style="text-align:center"><div style="font-size:35px">▶</div><b style="font:700 28px 'Space Grotesk'">STORIES IN MOTION.</b><p>SHORT-FORM · PROMO · REELS</p></div></div><p><b>Tools:</b> CapCut Pro · DaVinci Resolve · Adobe Premiere Pro</p><p>Add links to published video projects or upload your own video thumbnails as your portfolio grows.</p>`},
  sop:{eyebrow:"07 / WORKFLOW & SOP",title:"Inquiry to project start",body:`<p>A repeatable process creates a smoother experience for both the client and the person doing the work.</p><div class="demo-box"><div class="demo-row"><b>01 · RECEIVE</b><br>Record the inquiry, contact details, source, and request.</div><div class="demo-row"><b>02 · QUALIFY</b><br>Clarify goals, deliverables, budget, and expected timeline.</div><div class="demo-row"><b>03 · CONFIRM</b><br>Send scope, confirm details, and agree on the next step.</div><div class="demo-row"><b>04 · DELIVER</b><br>Track progress, share updates, collect feedback, and close out.</div></div><p><b>Quality check:</b> details recorded · expectations clear · deadline agreed · follow-up scheduled.</p>`}
};

// ========================================
// UNIVERSAL INTERACTIVE MODAL SYSTEM
// ========================================

const modal = $("#projectModal");
let lastModalTrigger = null;

function openModal(data, trigger) {
  if (!modal || !data) return;

  lastModalTrigger = trigger;

  $("#modalEyebrow").textContent = data.eyebrow;
  $("#modalTitle").textContent = data.title;
  $("#modalContent").innerHTML = data.body;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  $(".modal-close", modal)?.focus();
}

function closeModal() {
  if (!modal) return;

  if (lastModalTrigger) {
    lastModalTrigger.focus();
  }

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  lastModalTrigger = null;
}




// Copy email address
$("#copyEmail").addEventListener("click",async()=>{
  const email="johnreyson.mansueto@gmail.com", feedback=$("#copyFeedback");
  try{await navigator.clipboard.writeText(email);feedback.textContent="Email address copied to clipboard.";}
  catch{feedback.textContent="Email: "+email;}
});

// Subtle cursor glow on devices with a fine pointer
const glow=$(".cursor-glow");
if(window.matchMedia("(pointer:fine)").matches){
  window.addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";},{passive:true});
}

// ==========================================
// INTERACTIVE CATEGORY GALLERY
// ==========================================

const categoryModal = $("#categoryModal");

const categoryData = {
  customer: {
    number: "CATEGORY / 001",
    title: "CUSTOMER EXPERIENCE",
    experience: "support",
    portfolio: "support"
  },

  workforce: {
    number: "CATEGORY / 002",
    title: "WORKFORCE SUPPORT",
    experience: "operations",
    portfolio: "ops"
  },

  social: {
    number: "CATEGORY / 003",
    title: "SOCIAL MEDIA MANAGEMENT",
    experience: "creative",
    portfolio: "support"
  },

  design: {
    number: "CATEGORY / 004",
    title: "GRAPHIC DESIGN",
    experience: "creative",
    portfolio: "design"
  },

  video: {
    number: "CATEGORY / 005",
    title: "VIDEO EDITING",
    experience: "creative",
    portfolio: "design"
  }
};

let selectedCategory = null;
let previousCategoryTrigger = null;

function openCategoryModal(category, trigger) {
  const data = categoryData[category];

  if (!data || !categoryModal) return;

  selectedCategory = data;
  previousCategoryTrigger = trigger;

  $("#categoryModalEyebrow").textContent = data.number;
  $("#categoryModalTitle").textContent = data.title;

  categoryModal.classList.add("open");
  categoryModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("category-modal-open");

  $(".category-modal-close").focus();
}

function closeCategoryModal() {
  if (!categoryModal) return;

  categoryModal.classList.remove("open");
  categoryModal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("category-modal-open");

  previousCategoryTrigger?.focus();

  selectedCategory = null;
}

// Open category cards
$$(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    openCategoryModal(card.dataset.category, card);
  });
});

// Close category modal
$$("[data-category-close]").forEach(button => {
  button.addEventListener("click", closeCategoryModal);
});

// Experience or portfolio selection
$$("[data-category-destination]").forEach(button => {

  button.addEventListener("click", () => {

    if (!selectedCategory) return;

    const destination = button.dataset.categoryDestination;

    if (destination === "experience") {

      const filter = selectedCategory.experience;

      const tab = $(`.exp-tab[data-filter="${filter}"]`);

      if (tab) tab.click();

      closeCategoryModal();

      $("#experience").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

    else if (destination === "portfolio") {

      const filter = selectedCategory.portfolio;

      const tab = $(`.work-filter[data-work="${filter}"]`);

      if (tab) tab.click();

      closeCategoryModal();

      $("#work").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  });

});

// Close with Escape
document.addEventListener("keydown", event => {

  if (
    event.key === "Escape" &&
    categoryModal?.classList.contains("open")
  ) {
    closeCategoryModal();
  }

});
