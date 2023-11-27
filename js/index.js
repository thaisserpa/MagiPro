
const listItemLogin = document.querySelector('.link-login');
const token = localStorage.getItem('token');

if (token) {
    listItemLogin.style.display = 'none';
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

/*const handleSaibaMaisClick = async (projectId) => {


    try {
        const res = await fetch(`http://89.117.75.191:8070/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.ok) {
            const projectDetails = await res.json();
            console.log('Detalhes do projeto:', projectDetails);

            // Aqui você pode decidir como deseja lidar com os detalhes do projeto
        } else {
            throw new Error(`Erro ao obter detalhes do projeto: ${res.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao obter detalhes do projeto:', error.message);
    }
};
*/

const redirectToDetailsPage = (projectId) => {
    window.location.href = `/visualizacao.html?projectId=${projectId}`;
};



const getProjects = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você não está autenticado. Faça login primeiro.');
        window.location.href = '/login.html';
        return;
    }

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const res = await fetch('http://89.117.75.191:8070/projects', options);

        if (res.ok) {
            const data = await res.json();
            console.log(data)

            if (data.projects && Array.isArray(data.projects)) {
                const mainContainer = document.querySelector('.main');

                data.projects.forEach(project => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    const img = document.createElement('img');
                    img.src = 'assets/front.jpg';
                    card.appendChild(img);

                    const details = document.createElement('div');

                    const title = document.createElement('h1');
                    title.textContent = project.title;
                    details.appendChild(title);

                    const description = document.createElement('h2');
                    description.textContent = project.description;
                    details.appendChild(description);

                    const professor = document.createElement('h5');
                    professor.textContent = `Prof. ${project.user.name}`;
                    details.appendChild(professor);

                    const button = document.createElement('button');
                    button.textContent = 'Saiba mais';
                    button.dataset.id = project.id
                    button.addEventListener('click', () => redirectToDetailsPage(project.id));
                    details.appendChild(button);

                    card.appendChild(details);

                    mainContainer.appendChild(card);
                });
            } else {
                console.error('Estrutura de dados inválida na resposta da requisição.');
            }
        } else {
            throw new Error(`Erro ao obter projetos: ${res.statusText}`);
        }
    } catch (error) {
        console.error('Erro na requisição de projetos:', error.message);
    }
};

getProjects();
