/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.setAttribute('data-lucide', 'sun');
        lucide.createIcons();
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.body.getAttribute('data-theme');
        if (theme === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.setAttribute('data-lucide', 'moon');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.setAttribute('data-lucide', 'sun');
        }
        lucide.createIcons();
    });

    // --- Age Selection & Timeline ---
    const ageInput = document.getElementById('user-age');
    const setAgeBtn = document.getElementById('set-age-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    let userAge = localStorage.getItem('userAge') || 0;
    if (userAge) {
        ageInput.value = userAge;
        updateTimeline(userAge);
        // Use a small timeout to ensure layout is ready before scrolling
        setTimeout(scrollToTimeline, 100);
    }

    function scrollToTimeline() {
        const timelineSection = document.getElementById('timeline');
        if (timelineSection) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const currentItem = document.querySelector('.timeline-item.current');
            
            // If there's a current item, scroll to it specifically
            const scrollTarget = currentItem ? currentItem : timelineSection;
            
            window.scrollTo({
                top: scrollTarget.offsetTop - navHeight - 20,
                behavior: 'smooth'
            });

            // Add a pulse effect to the current item
            if (currentItem) {
                currentItem.style.animation = 'none';
                currentItem.offsetHeight; // trigger reflow
                currentItem.style.animation = 'pulse 1.5s ease-in-out';
            }
        }
    }

    setAgeBtn.addEventListener('click', () => {
        const age = parseInt(ageInput.value);
        if (age > 0 && age < 100) {
            userAge = age;
            localStorage.setItem('userAge', age);
            updateTimeline(age);
            scrollToTimeline();
        } else {
            alert("Please enter a valid age between 1 and 99.");
        }
    });

    function updateTimeline(age) {
        timelineItems.forEach(item => {
            const min = parseInt(item.getAttribute('data-age-min'));
            const max = parseInt(item.getAttribute('data-age-max'));
            
            item.classList.remove('past', 'current', 'future');
            
            if (age > max) {
                item.classList.add('past');
            } else if (age >= min && age <= max) {
                item.classList.add('current');
            } else {
                item.classList.add('future');
            }
        });
    }

    // --- Motivation Quote Generator ---
    const inspireBtn = document.getElementById('inspire-btn');
    const quotes = [
        { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
        { text: "Your career is like a garden. It can hold an assortment of life's transitions that are nurtured and cultivated over time.", author: "Unknown" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The future depends on what you do today.", author: "Mahatma Gandhi" }
    ];

    inspireBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        alert(`"${quote.text}" - ${quote.author}`);
    });

    // --- Skill Progress System ---
    const skillData = JSON.parse(localStorage.getItem('skillProgress')) || {
        html: 0,
        css: 0,
        js: 0,
        comm: 0,
        prob: 0
    };

    const topicData = JSON.parse(localStorage.getItem('topicProgress')) || {};

    function updateSkillUI() {
        for (const skill in skillData) {
            const bar = document.getElementById(`skill-${skill}`);
            const percentText = document.getElementById(`percent-${skill}`);
            if (bar && percentText) {
                const topics = document.querySelectorAll(`.topic-check[data-skill="${skill}"]`);
                const checkedTopics = document.querySelectorAll(`.topic-check[data-skill="${skill}"]:checked`);
                
                // Topics now contribute 100% of the progress
                const totalProgress = topics.length > 0 ? Math.round((checkedTopics.length / topics.length) * 100) : 0;
                
                bar.style.width = `${totalProgress}%`;
                percentText.textContent = `${totalProgress}%`;
            }
        }
        localStorage.setItem('skillProgress', JSON.stringify(skillData));
        localStorage.setItem('topicProgress', JSON.stringify(topicData));
    }

    // Handle topic checks
    document.querySelectorAll('.topic-check').forEach(check => {
        const skill = check.getAttribute('data-skill');
        const topicLabel = check.parentElement.textContent.trim();
        
        // Load saved state
        if (topicData[skill] && topicData[skill].includes(topicLabel)) {
            check.checked = true;
        }

        check.addEventListener('change', () => {
            if (!topicData[skill]) topicData[skill] = [];
            
            if (check.checked) {
                if (!topicData[skill].includes(topicLabel)) {
                    topicData[skill].push(topicLabel);
                }
            } else {
                topicData[skill] = topicData[skill].filter(t => t !== topicLabel);
            }
            updateSkillUI();
        });
    });

    updateSkillUI();

    // --- Life Goal Tracker ---
    const goalInput = document.getElementById('goal-input');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const goalList = document.getElementById('goal-list');
    const goalPercentage = document.getElementById('goal-percentage');
    const goalProgressBar = document.getElementById('goal-progress-bar');

    let goals = JSON.parse(localStorage.getItem('lifeGoals')) || [];

    const renderGoals = () => {
        goalList.innerHTML = '';
        goals.forEach(goal => {
            const li = document.createElement('li');
            li.className = `goal-item ${goal.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="goal-item-left">
                    <input type="checkbox" ${goal.completed ? 'checked' : ''} data-id="${goal.id}">
                    <span>${goal.text}</span>
                </div>
                <button class="delete-goal" data-id="${goal.id}"><i data-lucide="trash-2"></i></button>
            `;
            goalList.appendChild(li);
        });
        lucide.createIcons();
        updateGoalProgress();
        localStorage.setItem('lifeGoals', JSON.stringify(goals));
    };

    addGoalBtn.addEventListener('click', () => {
        const text = goalInput.value.trim();
        if (text) {
            goals.push({ id: Date.now(), text, completed: false });
            goalInput.value = '';
            renderGoals();
        }
    });

    goalList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (target && target.classList.contains('delete-goal')) {
            const id = parseInt(target.getAttribute('data-id'));
            goals = goals.filter(g => g.id !== id);
            renderGoals();
        }

        if (e.target.type === 'checkbox') {
            const id = parseInt(e.target.getAttribute('data-id'));
            const goal = goals.find(g => g.id === id);
            if (goal) {
                goal.completed = e.target.checked;
                renderGoals();
            }
        }
    });

    const updateGoalProgress = () => {
        if (goals.length === 0) {
            goalPercentage.textContent = '0%';
            goalProgressBar.style.width = '0%';
            return;
        }
        const completedCount = goals.filter(g => g.completed).length;
        const percentage = Math.round((completedCount / goals.length) * 100);
        goalPercentage.textContent = percentage + '%';
        goalProgressBar.style.width = percentage + '%';
    };

    renderGoals();

    // --- FutureMe Section ---
    const futureMessage = document.getElementById('future-message');
    const timeOption = document.getElementById('time-option');
    const saveMsgBtn = document.getElementById('save-msg-btn');
    const clearMsgBtn = document.getElementById('clear-msg-btn');
    const saveNotice = document.getElementById('save-notice');
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');
    const targetDateEl = document.getElementById('countdown-target');

    let countdownInterval;

    const loadFutureMe = () => {
        const savedData = JSON.parse(localStorage.getItem('futureMe'));
        if (savedData) {
            futureMessage.value = savedData.message || '';
            timeOption.value = savedData.option || '';
            startCountdown(savedData.targetDate);
        }
    };

    function startCountdown(targetDateStr) {
        if (countdownInterval) clearInterval(countdownInterval);
        
        const targetDate = new Date(targetDateStr);
        if (isNaN(targetDate.getTime())) return;

        targetDateEl.textContent = `Unlocks on: ${targetDate.toLocaleString()}`;

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance <= 0) {
                clearInterval(countdownInterval);
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minsEl.textContent = '00';
                secsEl.textContent = '00';
                targetDateEl.textContent = "Message Unlocked!";
                
                // Show the message in a more prominent way
                const savedData = JSON.parse(localStorage.getItem('futureMe'));
                if (savedData && savedData.message) {
                    futureMessage.value = `[UNLOCKED MESSAGE]:\n\n${savedData.message}`;
                    futureMessage.style.borderColor = 'var(--primary)';
                    futureMessage.style.boxShadow = '0 0 20px var(--primary)';
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.textContent = days.toString().padStart(2, '0');
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minsEl.textContent = minutes.toString().padStart(2, '0');
            secsEl.textContent = seconds.toString().padStart(2, '0');
        };

        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    }

    saveMsgBtn.addEventListener('click', () => {
        const message = futureMessage.value.trim();
        const option = timeOption.value;

        if (!message || !option) {
            alert("Please write a message and select a time period.");
            return;
        }

        let targetDate = new Date();
        if (option === '1hour') targetDate.setHours(targetDate.getHours() + 1);
        else if (option === '2hours') targetDate.setHours(targetDate.getHours() + 2);
        else if (option === 'graduation') targetDate.setFullYear(targetDate.getFullYear() + 1);
        else if (option === '3years') targetDate.setFullYear(targetDate.getFullYear() + 3);
        else if (option === '5years') targetDate.setFullYear(targetDate.getFullYear() + 5);

        const data = { 
            message, 
            option, 
            targetDate: targetDate.toISOString()
        };
        
        localStorage.setItem('futureMe', JSON.stringify(data));
        startCountdown(data.targetDate);
        
        saveNotice.classList.remove('hidden');
        setTimeout(() => saveNotice.classList.add('hidden'), 3000);
    });

    clearMsgBtn.addEventListener('click', () => {
        localStorage.removeItem('futureMe');
        futureMessage.value = '';
        timeOption.value = '';
        if (countdownInterval) clearInterval(countdownInterval);
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        targetDateEl.textContent = '';
        alert("Time capsule cleared.");
    });

    // --- Job Recommendation ---
    const jobBtns = document.querySelectorAll('.job-btn');
    const modal = document.getElementById('company-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const companyList = document.getElementById('company-list');

    const companies = {
        "Web Developer": [
            { name: "Google", type: "Product" },
            { name: "Meta", type: "Product" },
            { name: "TCS", type: "Service" },
            { name: "Infosys", type: "Service" }
        ],
        "Data Scientist": [
            { name: "Microsoft", type: "Product" },
            { name: "Amazon", type: "Product" },
            { name: "Accenture", type: "Service" },
            { name: "IBM", type: "Service" }
        ],
        "UI/UX Designer": [
            { name: "Apple", type: "Product" },
            { name: "Adobe", type: "Product" },
            { name: "Wipro", type: "Service" },
            { name: "Cognizant", type: "Service" }
        ]
    };

    jobBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const career = btn.getAttribute('data-career');
            
            // Highlight job step
            document.querySelectorAll('.step').forEach(s => s.classList.remove('highlight'));
            btn.classList.add('highlight');

            // Show modal
            modalTitle.textContent = `Top Companies for ${career}`;
            companyList.innerHTML = '';
            companies[career].forEach(c => {
                const div = document.createElement('div');
                div.className = 'company-item';
                div.innerHTML = `<span>${c.name}</span> <small>${c.type}</small>`;
                companyList.appendChild(div);
            });
            modal.classList.remove('hidden');
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Initial load
    loadFutureMe();
});
