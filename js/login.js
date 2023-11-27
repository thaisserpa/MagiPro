document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
		window.location.href = '/index.html';
    }
});

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

const btnSignin = document.querySelector(".btn-signin");
const btnLogin = document.querySelector(".btn-login");

const username = document.querySelector('#username');
const registerEmail = document.querySelector('#register-email');
const registerPass = document.querySelector('#register-pass');
const confirmPassword= document.querySelector('#confirm-register-pass');
const role = document.querySelector('#tipo');

const loginEmail = document.querySelector('#login-email');
const loginPass = document.querySelector('#login-pass');

const urlRegister = 'http://89.117.75.191:8070/register';
const urlLogin = 'http://89.117.75.191:8070/login'

const postRegister = async () => {
	const bodyPost = {
		name: username.value,
		email: registerEmail.value,
		password: registerPass.value,
		confirmPassword: confirmPassword.value,
		role: role.value
	}
	
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(bodyPost)
	}
	const resRegister = await fetch(urlRegister, options).then(data => data);
	console.log(resRegister);

	if(resRegister.ok){
		console.log(resRegister);
		alert('Usuário criado com sucesso!');
		username.value = '';
		registerEmail.value = '';
		registerPass.value = '';
		confirmPassword.value = '';
		return;
	} else {
		const errorResponse = await resRegister.json();
		console.error('Erro no registro:', resRegister.status, resRegister.statusText, errorResponse.errors);
		alert('Falha ao se cadastrar. Detalhes do erro: ' + errorResponse.errors.join(', '));
	}
}

const postLogin = async () => {
    const bodyPost = {
        email: loginEmail.value,
        password: loginPass.value
    };

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(bodyPost)
    };

    try {
        const resLogin = await fetch(urlLogin, options);
        const data = await resLogin.json();

        if (resLogin.ok && data.mensagem === 'usuario autenticado') {
			localStorage.setItem('userType', data.role);
            localStorage.setItem('token', data.token);
            window.location.href = '/index.html';
        } else {
            throw new Error(`Erro no login: ${data.mensagem}`);
        }
    } catch (error) {
        console.error('Erro no login:', error.message);
        alert('Falha ao entrar. Detalhes do erro: ' + error.message);
    }
};

btnSignin.addEventListener('click', postRegister)

btnLogin.addEventListener('click', postLogin)

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});