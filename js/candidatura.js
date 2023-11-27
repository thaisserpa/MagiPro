document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get('projectName');

    const projectNameElement = document.getElementById('projectName');
    projectNameElement.textContent = `Candidatura ao Projeto: ${projectName || 'Nome do Projeto Indisponível'}`;

    const formulario = document.getElementById('formulario');
    formulario.addEventListener('submit', enviarFormulario);
});

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
    const cancelarBtn = document.querySelector('button[name="reset"]');

    cancelarBtn.addEventListener('click', () => {

        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('projectId');

        window.location.href = `/visualizacao.html?projectId=${projectId}`;
    });
});

function enviarFormulario(event) {
    event.preventDefault(); 

    const resumo = document.querySelector('textarea[name="resumo"]').value;
    const habilidade = document.querySelector('textarea[name="habilidade"]').value;
    const curriculo = document.querySelector('textarea[name="curriculo"]').value;

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você não está autenticado. Faça login primeiro.');
        window.location.href = '/login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');

    const data = {
        projectId: projectId,
        summary: resumo,
        resumePath: curriculo,
        message: habilidade
    };

    fetch('http://89.117.75.191:8070/application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(`Erro na requisição: ${error.message}`);
            });
        }
        return response.json();
    })
    .then(result => {
        console.log('Resposta da API:', result);
        alert(result.message);
        window.location.href = '/index.html';
    })
    .catch(error => {
        console.error('Erro na requisição:', error.message);
        alert(error.message); 
    });
}
