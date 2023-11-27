function redirectToCandidatura(projectId, projectName) {
    
    window.location.href = `/candidatura.html?projectId=${projectId}&projectName=${encodeURIComponent(projectName)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const dashboardIcon = document.querySelector('.dashboard-link');
    
    if (dashboardIcon) {
        dashboardIcon.addEventListener('click', () => {
            const userType = localStorage.getItem('userType');
            console.log('Tipo de Usuário:', userType);

            if (userType === 'STUDENT') {
                window.location.href = '/dashaluno.html'; 
            } else if (userType === 'TEACHER') {
                window.location.href = '/dashprofessor.html'; 
            } else {
                alert('Erro: Tipo de usuário desconhecido.');
            }
        });
    } else {
        console.error('Elemento não encontrado.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');

    const listItemLogin = document.querySelector('.link-login');
    const token = localStorage.getItem('token');

    if (token) {
        fetch(`http://89.117.75.191:8070/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(projectDetails => {
            console.log(projectDetails);
            renderProjectDetails(projectDetails); 
            const inscreverBtn = document.getElementById('inscreverBtn');
            inscreverBtn.addEventListener('click', () => {
                const projectName = projectDetails.title;
                redirectToCandidatura(projectId, projectName);
            });
        })
        .catch(error => console.error('Erro:', error.message));
    } else {
        window.location.href = '/login.html';
    }
});

function renderProjectDetails(project) {
    const projectDetailsContainer = document.querySelector('.project-details');
    
    const titleElement = document.createElement('h1');
    titleElement.textContent = `Projeto: ${project.title}`;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Descrição: ${project.description}`;

    const professorElement = document.createElement('h5');
    professorElement.textContent = `Prof. ${project.user ? project.user.name : 'Nome do Professor Indisponível'}`;

    const interestAreaElement = document.createElement('p');
    interestAreaElement.textContent = `Área de Interesse: ${project.interestArea.join(', ')}`;

    const objectivesElement = document.createElement('p');
    objectivesElement.textContent = `Objetivos: ${project.objectives.join(', ')}`;

    const resourcesElement = document.createElement('p');
    resourcesElement.textContent = `Recursos: ${project.resources.join(', ')}`;

    const studentCountElement = document.createElement('p');
    studentCountElement.textContent = `Número de Estudantes maximo: ${project.studentCount}`;

    const timelineElement = document.createElement('p');
    timelineElement.textContent = `Cronograma: ${project.timeline.map(phase => `${phase.fase} (${phase.início} - ${phase.fim})`).join(', ')}`;

    projectDetailsContainer.appendChild(titleElement);
    projectDetailsContainer.appendChild(descriptionElement);
    projectDetailsContainer.appendChild(professorElement);
    projectDetailsContainer.appendChild(interestAreaElement);
    projectDetailsContainer.appendChild(objectivesElement);
    projectDetailsContainer.appendChild(resourcesElement);
    projectDetailsContainer.appendChild(studentCountElement);
    projectDetailsContainer.appendChild(timelineElement);
}

