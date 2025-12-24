window.addEventListener('load', () => {
  const loading = document.getElementById('loading-screen');
  const progressBar = document.querySelector('.progress-bar');
  const percentage = document.querySelector('.loading-percentage');
  const words = document.querySelectorAll('.loading-text .word');
  
  if (loading) {
    let progress = 0;
    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const increment = 100 / (duration / interval);
    
    // Animate progress bar and percentage
    const progressTimer = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressTimer);
        
        // Add pulsing animation to words
        setTimeout(() => {
          words.forEach(word => {
            word.classList.add('animate');
          });
        }, 500);
        
        // Start exit animation
        setTimeout(() => {
          loading.classList.add('fade-out');
          setTimeout(() => {
            loading.style.display = 'none';
          }, 1000);
        }, 1500);
      }
      
      if (percentage) {
        percentage.textContent = Math.floor(progress) + '%';
      }
    }, interval);
  }
});

function toggleNav() {
  document.getElementById('mobileNav').classList.toggle('active');
}

function calculateMacros() {
  const w = parseFloat(document.getElementById('weight')?.value);
  const h = parseFloat(document.getElementById('height')?.value);
  const a = parseFloat(document.getElementById('age')?.value);
  const g = document.getElementById('gender')?.value;
  const goal = document.getElementById('goal')?.value;
  const res = document.getElementById('result');

  if (isNaN(w) || isNaN(h) || isNaN(a)) {
    alert('Please fill all fields with numbers.');
    return;
  }

  let bmr = g === 'male'
    ? 10 * w + 6.25 * h - 5 * a + 5
    : 10 * w + 6.25 * h - 5 * a - 161;

  const tdee = bmr * 1.55;
  let cals = goal === 'bulk' ? tdee + 300 : goal === 'cut' ? tdee - 500 : tdee;
  cals = Math.round(cals);
  const protein = Math.round(w * 2.2);
  const fat = Math.round((cals * 0.25) / 9);
  const carbs = Math.round((cals - protein * 4 - fat * 9) / 4);
  const bmi = (w / ((h / 100) ** 2)).toFixed(1);
  const status = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';

  if (res) {
    res.innerHTML = `
      <h3>Your Champion Plan</h3>
      <p><strong>BMI:</strong> ${bmi} (${status})</p>
      <p><strong>Calories:</strong> ${cals} kcal/day</p>
      <p><strong>Protein:</strong> ${protein}g | <strong>Carbs:</strong> ${carbs}g | <strong>Fats:</strong> ${fat}g</p>
    `;
    res.style.display = 'block';
  }
}

// Theme toggle: toggles `data-theme` on the documentElement and persists choice
(function(){
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  function applyTheme(t){
    root.setAttribute('data-theme', t);
  }

  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  if(btn){
    btn.addEventListener('click', ()=>{
      const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(current);
      localStorage.setItem('theme', current);
    });
  }
})();

// Photo Upload Functionality
document.addEventListener('DOMContentLoaded', function() {
  const photoInput = document.getElementById('photo-upload');
  const photoPreview = document.getElementById('photoPreview');
  
  if (photoInput && photoPreview) {
    photoInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            previewItem.innerHTML = `
              <img src="${e.target.result}" alt="Preview">
              <button class="remove-photo" onclick="removePhoto(this)">×</button>
            `;
            
            photoPreview.appendChild(previewItem);
          };
          
          reader.readAsDataURL(file);
        }
      });
      
      // Clear the input so the same file can be selected again
      photoInput.value = '';
    });
  }
});

function removePhoto(button) {
  const previewItem = button.parentElement;
  previewItem.style.animation = 'photoSlideOut 0.3s ease-out forwards';
  
  setTimeout(() => {
    previewItem.remove();
  }, 300);
}

// Add CSS animation for photo removal
const style = document.createElement('style');
style.textContent = `
  @keyframes photoSlideOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.8) translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

// Package Selection Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the package page
  const packageLinks = document.querySelectorAll('.package-link');
  
  packageLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      // Store selected package info
      const packageNames = ['BASIC', 'PRO', 'CHAMPION'];
      const packagePrices = ['1,500 ETB/month', '3,500 ETB/month', '7,000 ETB/month'];
      
      localStorage.setItem('selectedPackage', packageNames[index]);
      localStorage.setItem('selectedPackagePrice', packagePrices[index]);
      
      // Add visual feedback
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
  
  // Check if we're on the contact page and auto-fill package info
  if (window.location.pathname.includes('contact.html')) {
    const selectedPackage = localStorage.getItem('selectedPackage');
    const selectedPackagePrice = localStorage.getItem('selectedPackagePrice');
    
    if (selectedPackage) {
      const textarea = document.querySelector('textarea');
      if (textarea && !textarea.value) {
        textarea.value = `Hi Eske! I'm interested in the ${selectedPackage} package (${selectedPackagePrice}). `;
        textarea.focus();
        
        // Clear the stored package info after use
        localStorage.removeItem('selectedPackage');
        localStorage.removeItem('selectedPackagePrice');
      }
    }
  }
});

// AI ChatGPT Integration
function openChatGPT() {
  openFullChatGPT();
}

function openFullChatGPT() {
  // Get user's fitness data if available
  const weight = document.getElementById('weight')?.value || '';
  const height = document.getElementById('height')?.value || '';
  const age = document.getElementById('age')?.value || '';
  const gender = document.getElementById('gender')?.value || '';
  const goal = document.getElementById('goal')?.value || '';
  
  // Create a personalized prompt for ChatGPT
  let prompt = "I need help with fitness and nutrition advice. ";
  
  if (weight && height && age) {
    prompt += `My stats: ${weight}kg, ${height}cm, ${age} years old, ${gender}. `;
    prompt += `My fitness goal is to ${goal === 'bulk' ? 'build muscle' : goal === 'cut' ? 'lose fat' : 'maintain my current weight'}. `;
  }
  
  prompt += "Can you help me create a personalized workout and nutrition plan?";
  
  // Encode the prompt for URL
  const encodedPrompt = encodeURIComponent(prompt);
  
  // Open ChatGPT with the pre-filled prompt
  const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`;
  
  // Open ChatGPT in a new tab
  window.open(chatGPTUrl, '_blank');
}

function toggleChatSize() {
  const phoneFrame = document.querySelector('.phone-frame');
  if (phoneFrame) {
    phoneFrame.classList.toggle('minimized');
  }
}

function sendQuickMessage(type) {
  const weight = document.getElementById('weight')?.value || '';
  const height = document.getElementById('height')?.value || '';
  const age = document.getElementById('age')?.value || '';
  const gender = document.getElementById('gender')?.value || '';
  const goal = document.getElementById('goal')?.value || '';
  
  let prompt = '';
  
  switch(type) {
    case 'workout plan':
      prompt = 'Create a personalized workout plan for me. ';
      break;
    case 'nutrition advice':
      prompt = 'Give me nutrition advice and meal planning guidance. ';
      break;
    case 'progress tracking':
      prompt = 'Help me track my fitness progress and set goals. ';
      break;
  }
  
  if (weight && height && age) {
    prompt += `My stats: ${weight}kg, ${height}cm, ${age} years old, ${gender}. `;
    prompt += `My fitness goal is to ${goal === 'bulk' ? 'build muscle' : goal === 'cut' ? 'lose fat' : 'maintain my current weight'}. `;
  }
  
  const encodedPrompt = encodeURIComponent(prompt);
  const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`;
  
  // Add visual feedback
  const clickedButton = event.target;
  clickedButton.style.transform = 'scale(0.95)';
  setTimeout(() => {
    clickedButton.style.transform = 'scale(1.05)';
  }, 100);
  
  window.open(chatGPTUrl, '_blank');
}

// Handle iframe loading and fallback
document.addEventListener('DOMContentLoaded', function() {
  const iframe = document.getElementById('chatgpt-iframe');
  const fallback = document.getElementById('iframe-fallback');
  
  if (iframe && fallback) {
    // Show fallback initially
    fallback.classList.add('show');
    
    // Try to load iframe
    iframe.onload = function() {
      // Hide fallback when iframe loads successfully
      setTimeout(() => {
        fallback.classList.remove('show');
      }, 1000);
    };
    
    // Handle iframe errors
    iframe.onerror = function() {
      fallback.classList.add('show');
    };
    
    // Fallback timeout - if iframe doesn't load in 5 seconds, show fallback
    setTimeout(() => {
      if (iframe.contentDocument === null) {
        fallback.classList.add('show');
      }
    }, 5000);
  }
});

// Add CSS for minimized state
const additionalStyle = document.createElement('style');
additionalStyle.textContent = `
  .phone-frame.minimized {
    height: 200px;
    transition: height 0.3s ease;
  }
  
  .phone-frame.minimized .phone-screen {
    height: 120px;
  }
  
  .phone-frame.minimized .iframe-container {
    display: none;
  }
  
  .phone-frame.minimized .chat-quick-actions {
    display: flex;
  }
`;
document.head.appendChild(additionalStyle);

// Testimonial Page Animations
document.addEventListener('DOMContentLoaded', function() {
  // Animated counters for testimonial stats
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
      }, 16);
    });
  }
  
  // Intersection Observer for counter animation
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) {
    observer.observe(statsSection);
  }
  
  // Add hover effects to testimonial cards
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialCards.forEach((card, index) => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-15px) scale(1.02) rotateY(5deg)';
      this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
      this.style.zIndex = '1';
    });
  });
  
  // Video card interactions
  const videoCards = document.querySelectorAll('.video-card');
  videoCards.forEach(card => {
    card.addEventListener('click', function() {
      const clientName = this.querySelector('h4').textContent;
      alert(`Video testimonial from ${clientName} - Coming Soon!`);
    });
  });
  
  // Add parallax effect to featured testimonial
  const featuredTestimonial = document.querySelector('.featured-testimonial');
  if (featuredTestimonial) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      featuredTestimonial.style.transform = `translateY(${rate}px)`;
    });
  }
  
  // Add typing effect to featured quote
  const featuredQuote = document.querySelector('.featured-quote p');
  if (featuredQuote) {
    const text = featuredQuote.textContent;
    featuredQuote.textContent = '';
    let i = 0;
    
    function typeWriter() {
      if (i < text.length) {
        featuredQuote.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 30);
      }
    }
    
    // Start typing effect when element comes into view
    const typingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(typeWriter, 500);
          typingObserver.unobserve(entry.target);
        }
      });
    });
    
    typingObserver.observe(featuredQuote);
  }
  
  // Add stagger animation to testimonial grid
  const gridCards = document.querySelectorAll('.testimonials-grid .testimonial-card');
  const gridObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, { threshold: 0.1 });
  
  gridCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.6s ease';
    gridObserver.observe(card);
  });
});