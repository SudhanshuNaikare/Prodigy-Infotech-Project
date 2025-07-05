class Portfolio {
    constructor() {
        this.projectsGrid = document.querySelector('.projects-grid');


        this.initialize();
    }

    initialize() {
        this.loadProjects();
        this.setupScrollAnimation();
    }

    loadProjects() {
        this.projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            this.projectsGrid.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-links">
                    <a href="${project.demo}" target="_blank">Live Demo</a>
                    <a href="${project.code}" target="_blank">View Code</a>
                </div>
            </div>
        `;

        return card;
    }

    setupScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.project-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            observer.observe(card);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new Portfolio();
}); 