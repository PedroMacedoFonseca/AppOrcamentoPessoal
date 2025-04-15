class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (let campo in this) {
      if (
        this[campo] === "" ||
        this[campo] === null ||
        this[campo] === undefined
      ) {
        return false;
      }
    }
    return true;
  }
}

function mostrarModal(titulo, mensagem, tipo) {
  document.getElementById("modalTitulo").innerText = titulo;
  document.getElementById("modalMensagem").innerText = mensagem;

  let botao = document.getElementById("modalBotao");
  let modalHeader = document.querySelector("#mensagemModal .modal-header");

  botao.classList.remove("btn-danger", "btn-success");
  modalHeader.classList.remove("text-danger", "text-success");

  if (tipo === "erro") {
    botao.classList.add("btn-danger");
    modalHeader.classList.add("text-danger");
  } else {
    botao.classList.add("btn-success");
    modalHeader.classList.add("text-success");
  }

  $("#mensagemModal").modal("show");
}

class Bd {
  constructor() {
    let id = localStorage.getItem("id");
    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoId() {
    let proximoId = parseInt(localStorage.getItem("id"));
    return proximoId + 1;
  }

  gravar(d) {
    let id = this.getProximoId();
    d.id = id;
    localStorage.setItem(id, JSON.stringify(d));
    localStorage.setItem("id", id);
  }

  recuperarTodosRegistros() {
    let despesas = Array();

    let id = localStorage.getItem("id");

    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));
      if (despesa === null) {
        continue;
      }

      despesas.id = i;
      despesas.push(despesa);
    }

    return despesas;
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array();
    despesasFiltradas = this.recuperarTodosRegistros();
    if (despesa.ano != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.ano == despesa.ano);
    }
    if (despesa.mes != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.mes == despesa.mes);
    }
    if (despesa.dia != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.dia == despesa.dia);
    }
    if (despesa.tipo != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.tipo == despesa.tipo
      );
    }
    if (despesa.descricao != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.descricao == despesa.descricao
      );
    }
    if (despesa.valor != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.valor == despesa.valor
      );
    }
    return despesasFiltradas;
  }

  remover(id) {
    localStorage.removeItem(id);
  
    let despesas = this.recuperarTodosRegistros().filter(d => d.id != id);
  
    localStorage.clear();
    localStorage.setItem("id", 0);
  
    despesas.forEach((d, index) => {
      d.id = index + 1; // Reatribuir IDs corretamente
      localStorage.setItem(d.id, JSON.stringify(d));
      localStorage.setItem("id", d.id);
    });
  
    carregaListaDespesas(); // Recarregar lista sem atualizar a página
  }
}

let bd = new Bd();

function cadastrarDespesa() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  if (despesa.validarDados()) {
    bd.gravar(despesa);
    mostrarModal("Sucesso!", "Despesa cadastrada com sucesso.", "sucesso");
    ano.value = "";
    mes.value = "";
    dia.value = "";
    tipo.value = "";
    descricao.value = "";
    valor.value = "";
  } else {
    mostrarModal(
      "Erro na gravação",
      "Existem campos obrigatórios que não foram preenchidos.",
      "erro"
    );
  }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
  if (despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros();
  }

  let listaDespesas = document.getElementById("listaDespesas");
  listaDespesas.innerHTML = "";

  despesas.forEach(function (d) {
    let linha = listaDespesas.insertRow();
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

    switch (d.tipo) {
      case "1":
        d.tipo = "Alimentação";
        break;
      case "2":
        d.tipo = "Educação";
        break;
      case "3":
        d.tipo = "Lazer";
        break;
      case "4":
        d.tipo = "Saúde";
        break;
      case "5":
        d.tipo = "Transporte";
        break;
    }

    linha.insertCell(1).innerHTML = d.tipo;
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;

    let btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = `id_despesa_${d.id}`;
    btn.onclick = function () {
      let id = this.id.replace("id_despesa_", "");
      bd.remover(id);
      carregaListaDespesas();
    };
    linha.insertCell(4).append(btn);
  });
}

function pesquisarDespesas() {
  let ano = document.getElementById("ano").value;
  let mes = document.getElementById("mes").value;
  let dia = document.getElementById("dia").value;
  let tipo = document.getElementById("tipo").value;
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
  let despesas = bd.pesquisar(despesa);
  carregaListaDespesas(despesas, true);
}
