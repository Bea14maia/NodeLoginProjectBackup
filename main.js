const KEY_BD = '@usuariosestudo';

var listaRegistros = {
    ultimoIdGerado: 0,
    usuarios: [],
};
var FILTRO = '';

function gravarBD() {
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros));
}

function lerBD() {
    const data = localStorage.getItem(KEY_BD);
    if (data) {
        listaRegistros = JSON.parse(data);
    }
    desenhar();
}

function pesquisar(value) {
    FILTRO = value;
    desenhar();
}

function visualizar(pagina, novo = false, id = null) {
    document.body.setAttribute('page', pagina);
    if (pagina === 'cadastro') {
      if (id) {
        preencherFormulario(id);
      }
      document.getElementById('nome').focus();
    } else {
      document.getElementById('cadastroRegistro').style.display = 'none';
    }
  }



  function preencherFormulario(id) {
    const usuario = listaRegistros.usuarios.find((user) => user.id == id);
    if (usuario) {
        document.getElementById('id').value = usuario.id;
        document.getElementById('nome').value = usuario.nome;
        document.getElementById('cpf').value = usuario.cpf;
        document.getElementById('dataNascimento').value = usuario.dataNascimento;
        document.getElementById('estadoCivil').value = usuario.estadoCivil;
        document.getElementById('rendaMensal').value = usuario.rendaMensal;
        document.getElementById('logradouro').value = usuario.logradouro;
        document.getElementById('numero').value = usuario.numero;
        document.getElementById('complemento').value = usuario.complemento;
        document.getElementById('estado').value = usuario.estado;
        document.getElementById('cidade').value = usuario.cidade;
    }
}


function desenhar() {
    const tbody = document.getElementById('listaRegistrosBody');
    if (tbody) {
        var data = listaRegistros.usuarios;
        if (FILTRO.trim()) {
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g, '.*')}/i`);
            data = data.filter((usuario) => {
                return (
                    expReg.test(usuario.id) ||
                    expReg.test(usuario.nome) ||
                    expReg.test(usuario.cpf) ||
                    expReg.test(usuario.dataNascimento) ||
                    expReg.test(usuario.estadoCivil) ||
                    expReg.test(usuario.rendaMensal) ||
                    expReg.test(usuario.logradouro) ||
                    expReg.test(usuario.numero) ||
                    expReg.test(usuario.complemento) ||
                    expReg.test(usuario.estado) ||
                    expReg.test(usuario.cidade)
                );
            });
        }
        data = data
    .sort((a, b) => {
        return a.nome < b.nome ? 1 : -1; // Corrigido o retorno do sort
    })
    .map((usuario) => {
        return `<tr>
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.cpf}</td>
                <td>${usuario.dataNascimento}</td>
                <td>${usuario.estadoCivil}</td>
                <td>${usuario.rendaMensal}</td>
                <td>${usuario.logradouro}</td>
                <td>${usuario.numero}</td>
                <td>${usuario.complemento}</td>
                <td>${usuario.estado}</td>
                <td>${usuario.cidade}</td>
                <td>
                    <button onclick='visualizar("cadastro", false, ${usuario.id})'>Editar</button>
                    <button class='vermelho' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                </td>
            </tr>`;
    });
        tbody.innerHTML = data.join('');

        // Adicione um listener para cada botão de editar após desenhar a tabela
        for (const usuario of listaRegistros.usuarios) {
            const editarBtn = document.getElementById(`editarUsuario${usuario.id}`);
            if (editarBtn) {
                editarBtn.addEventListener('click', () => preencherFormulario(usuario.id));
            }
        }
    }
}


function insertUsuario(
    nome,
    cpf,
    dataNascimento,
    estadoCivil,
    rendaMensal,
    logradouro,
    numero,
    complemento,
    estado,
    cidade
) {
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id,
        nome,
        cpf,
        dataNascimento,
        estadoCivil,
        rendaMensal,
        logradouro,
        numero,
        complemento,
        estado,
        cidade,
    });

    console.log(
        'Novo usuário:',
        id,
        nome,
        cpf,
        dataNascimento,
        estadoCivil,
        rendaMensal,
        logradouro,
        numero,
        complemento,
        estado,
        cidade
    );

    gravarBD();
    desenhar();
    
}

function submeter(e) {
    e.preventDefault();
    const id = document.getElementById('id').value; // Adicione esta linha para obter o valor do id
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const estadoCivil = document.getElementById('estadoCivil').value;
    const rendaMensal = document.getElementById('rendaMensal').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const estado = document.getElementById('estado').value;
    const cidade = document.getElementById('cidade').value;

    if (id) {
        editUsuario(id, nome, cpf, dataNascimento, estadoCivil, rendaMensal, logradouro, numero, complemento, estado, cidade);
    } else {
        insertUsuario(nome, cpf, dataNascimento, estadoCivil, rendaMensal, logradouro, numero, complemento, estado, cidade);
    }
    desenhar();
    visualizar('lista');
}

function editUsuario(
    id,
    nome,
    cpf,
    dataNascimento,
    estadoCivil,
    rendaMensal,
    logradouro,
    numero,
    complemento,
    estado,
    cidade
) {
    var usuario = listaRegistros.usuarios.find((usuario) => usuario.id == id);
    usuario.nome = nome;
    usuario.cpf = cpf;
    usuario.dataNascimento = dataNascimento;
    usuario.estadoCivil = estadoCivil;
    usuario.rendaMensal = rendaMensal;
    usuario.logradouro = logradouro;
    usuario.numero = numero;
    usuario.complemento = complemento;
    usuario.estado = estado;
    usuario.cidade = cidade;
    gravarBD();
    desenhar();
}

function deletarUsuario(id) {
    const index = listaRegistros.usuarios.findIndex((usuario) => usuario.id === id);
    if (index !== -1) {
        listaRegistros.usuarios.splice(index, 1);
        gravarBD();
        desenhar();
        ajustarUltimoIdGerado();
    }
}



function perguntarSeDeleta(id) {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
        deletarUsuario(id);
    }
}

function ajustarUltimoIdGerado() {
    const maiorIdExistente = listaRegistros.usuarios.reduce((maiorId, usuario) => {
        return usuario.id > maiorId ? usuario.id : maiorId;
    }, 0);

    listaRegistros.ultimoIdGerado = maiorIdExistente;
}


window.addEventListener('load', () => {
    lerBD();
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter);
    document.getElementById('inputPesquisa').addEventListener('keyup', (e) => {
        pesquisar(e.target.value);
    });
});

document.getElementById('btnSalvar').addEventListener('click', function (event) {
    submeter(event);
});



